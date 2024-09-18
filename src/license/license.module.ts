import { Module } from '@nestjs/common';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { LicenseDao } from './license.dao';

@Module({
  imports: [],
  controllers: [LicenseController],
  providers: [LicenseService, LicenseDao],
})
export class LicenseModule {}
