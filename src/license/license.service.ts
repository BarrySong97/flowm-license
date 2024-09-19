import { Injectable } from '@nestjs/common';
import { LicenseDao } from './license.dao';
import {
  GenerateLicense,
  License,
  LicenseQuery,
  UpdateLicense,
} from './models/license.model';

@Injectable()
export class LicenseService {
  constructor(private licenseDao: LicenseDao) {}

  // 验证许可证
  async verify(verifyData: License) {
    return this.licenseDao.verify(verifyData.licenseKey, verifyData.macId);
  }

  // 生成许可证
  async generate(generateData: GenerateLicense) {
    return this.licenseDao.generate(generateData);
  }

  // 激活许可证
  async activate(activateData: License) {
    return this.licenseDao.activate(
      activateData.licenseKey,
      activateData.macId,
    );
  }
  async deactivate(deactivateData: License) {
    return this.licenseDao.deactivate(
      deactivateData.licenseKey,
      deactivateData.macId,
    );
  }

  // 通过邮箱检索许可证
  async retrieveByEmail(email: string) {
    return this.licenseDao.retrieveByEmail(email);
  }

  async getAllLicenses(query: LicenseQuery) {
    return this.licenseDao.getAllLicenses(query);
  }

  async getLicense(id: string) {
    return this.licenseDao.getLicense(id);
  }

  // 更新许可证
  async updateLicense(id: string, updateData: UpdateLicense) {
    return this.licenseDao.updateLicense(id, updateData);
  }

  // 删除许可证
  async deleteLicense(id: string) {
    return this.licenseDao.deleteLicense(id);
  }
}
