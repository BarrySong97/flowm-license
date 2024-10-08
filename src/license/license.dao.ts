import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { License } from '@prisma/client';
import {
  GenerateLicense,
  LicenseQuery,
  UpdateLicense,
} from './models/license.model';
import { PageResponse } from 'src/common/models/page.model';
import * as dayjs from 'dayjs';

@Injectable()
export class LicenseDao {
  constructor(private prisma: PrismaService) {}

  async verify(licenseKey: string, macId: string): Promise<License | null> {
    const license = await this.prisma.license.findUnique({
      where: { key: licenseKey, macIds: { has: macId } },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }
    if (license.status === 'DISABLED') {
      throw new UnauthorizedException('License disabled');
    }

    // 检查是否过期
    if (license.expiresAt && dayjs(license.expiresAt).isBefore(dayjs())) {
      // 如果许可证已过期，更新状态为 'EXPIRED'
      throw new ForbiddenException('License expired');
    }

    return license;
  }

  async generate(licenseData: GenerateLicense): Promise<License> {
    return this.prisma.license.create({
      data: {
        key: this.generateLicenseKey(),
        email: licenseData.email,
        maxDevices: licenseData.maxDevices,
        expiresAt: new Date(licenseData.expiresAt),
      },
    });
  }

  generateLicenseKey(): string {
    // Generate a random license key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const keyLength = 16;
    let result = '';
    for (let i = 0; i < keyLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    // Format the key as XXXX-XXXX-XXXX-XXXX
    return result.match(/.{1,4}/g).join('-');
  }

  async activate(
    licenseKey: string,
    macId: string,
    email: string,
  ): Promise<License> {
    // 首先获取当前许可证信息
    const currentLicense = await this.prisma.license.findUnique({
      where: { key: licenseKey, email },
    });

    if (!currentLicense) {
      throw new NotFoundException('License not found');
    }
    // 检查是否过期
    if (
      currentLicense.expiresAt &&
      dayjs(currentLicense.expiresAt).isBefore(dayjs())
    ) {
      // 如果许可证已过期，更新状态为 'EXPIRED'
      throw new ForbiddenException('License expired');
    }

    // 检查 macId 是否已存在
    const canActivate =
      currentLicense &&
      !currentLicense.macIds.includes(macId) &&
      currentLicense.activatedDevices < currentLicense.maxDevices;
    if (currentLicense.macIds.includes(macId)) {
      return currentLicense;
    }

    if (currentLicense.activatedDevices >= currentLicense.maxDevices) {
      throw new BadRequestException(
        'Maximum number of devices reached for this license',
      );
    }

    if (canActivate) {
      return this.prisma.license.update({
        where: { key: licenseKey },
        data: {
          status: 'ACTIVE',
          macIds: { push: macId },
          activatedDevices: { increment: 1 },
        },
      });
    }

    return currentLicense;
  }

  async deactivate(
    licenseKey: string,
    macId: string,
    email: string,
  ): Promise<License> {
    const currentLicense = await this.prisma.license.findUnique({
      where: { key: licenseKey, email },
    });
    if (!currentLicense) {
      throw new NotFoundException('License not found');
    }
    // 检查是否过期
    if (currentLicense.expiresAt && currentLicense.expiresAt < new Date()) {
      // 如果许可证已过期，更新状态为 'EXPIRED'
      throw new ForbiddenException('License expired');
    }

    if (
      currentLicense &&
      currentLicense.macIds.includes(macId) &&
      currentLicense.macIds.length > 0
    ) {
      const macIds = currentLicense.macIds.filter((id) => id !== macId);
      return this.prisma.license.update({
        where: { key: licenseKey },
        data: {
          status: 'INACTIVE',
          macIds: { set: macIds },
          activatedDevices: { decrement: 1 },
        },
      });
    } else {
      return currentLicense;
    }
  }

  async getAllLicenses(query: LicenseQuery): Promise<PageResponse<License>> {
    const { page, pageSize, status, email, licenseKey, expiresAt } = query;
    const where = {
      status,
      email,
      key: licenseKey,
      expiresAt: expiresAt ? dayjs(Number(expiresAt)).toDate() : undefined,
    };

    const totalCount = await this.prisma.license.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const licenses = await this.prisma.license.findMany({
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      where,
    });
    // Calculate if licenses are expired and update status if necessary

    licenses.map((license) => {
      if (license.expiresAt && dayjs(license.expiresAt).isBefore(dayjs())) {
        license.status = 'EXPIRED';
      }
      return license;
    });

    return {
      data: licenses,
      totalPage: totalPages,
      total: totalCount,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  async getLicense(id: string): Promise<License | null> {
    return this.prisma.license.findUnique({
      where: { id },
    });
  }

  async updateLicense(id: string, updateData: UpdateLicense) {
    const data = {
      ...updateData,
      expiresAt: updateData.expiresAt
        ? new Date(Number(updateData.expiresAt))
        : undefined,
    };
    // Remove undefined values from the data object
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return this.prisma.license.update({
      where: { id },
      data: cleanedData,
    });
  }

  async deleteLicense(id: string) {
    return this.prisma.license.delete({
      where: { id },
    });
  }
}
