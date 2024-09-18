import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { License } from '@prisma/client';
import { GenerateLicense } from './models/license.model';

@Injectable()
export class LicenseDao {
  constructor(private prisma: PrismaService) {}

  async verify(licenseKey: string, macId: string): Promise<License | null> {
    return this.prisma.license.findUnique({
      where: { key: licenseKey, macIds: { has: macId } },
    });
  }

  async generate(licenseData: GenerateLicense): Promise<License> {
    return this.prisma.license.create({
      data: {
        key: licenseData.licenseKey,
        email: licenseData.email,
        maxDevices: licenseData.maxDevices,
        expiresAt: licenseData.expiresAt,
      },
    });
  }

  async activate(licenseKey: string, macId: string): Promise<License> {
    // 首先获取当前许可证信息
    const currentLicense = await this.prisma.license.findUnique({
      where: { key: licenseKey },
    });

    // 检查 macId 是否已存在
    const canActivate =
      currentLicense &&
      !currentLicense.macIds.includes(macId) &&
      currentLicense.status !== 'ACTIVE' &&
      currentLicense.activatedDevices < currentLicense.maxDevices;

    if (canActivate) {
      // macId 不存在、状态不是 active、且未超过最大设备数，执行激活操作
      return this.prisma.license.update({
        where: { key: licenseKey },
        data: {
          status: 'ACTIVE',
          macIds: { push: macId },
          activatedDevices: { increment: 1 },
        },
      });
    } else if (currentLicense.activatedDevices >= currentLicense.maxDevices) {
      // 已达到或超过最大设备数
      throw new Error('Maximum number of devices reached for this license');
    } else {
      // macId 已存在、状态已是 active 或其他情况，返回当前许可证状态，不进行激活
      return currentLicense;
    }
  }

  async deactivate(licenseKey: string, macId: string): Promise<License> {
    const currentLicense = await this.prisma.license.findUnique({
      where: { key: licenseKey },
    });

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
    }
  }

  async retrieveByEmail(email: string): Promise<License | null> {
    return this.prisma.license.findFirst({
      where: { email },
    });
  }

  async getAllLicenses(): Promise<License[]> {
    return this.prisma.license.findMany();
  }

  async getLicense(id: string): Promise<License | null> {
    return this.prisma.license.findUnique({
      where: { id },
    });
  }
}
