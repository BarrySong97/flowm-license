import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
  Delete,
  Header,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { AuthGuard } from '@nestjs/passport'; // 假设你使用 Passport 进行身份验证
import { License, LicenseQuery, UpdateLicense } from './models/license.model';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  // 验证许可证
  @Post('verify')
  async verify(@Body() verifyData: License) {
    return this.licenseService.verify(verifyData);
  }

  // 生成许可证
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async generate(@Body() generateData: any) {
    return this.licenseService.generate(generateData);
  }

  // 激活许可证
  @Post('activate')
  async activate(@Body() activateData: License) {
    return this.licenseService.activate(activateData);
  }

  // 停用许可证
  @Post('deactivate')
  async deactivate(@Body() deactivateData: License) {
    return this.licenseService.deactivate(deactivateData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getAllLicenses(@Query() query: LicenseQuery) {
    return this.licenseService.getAllLicenses(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getLicense(@Param('id') id: string) {
    return this.licenseService.getLicense(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateLicense(
    @Param('id') id: string,
    @Body() updateData: UpdateLicense,
  ) {
    return this.licenseService.updateLicense(id, updateData);
  }

  // 删除许可证
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteLicense(@Param('id') id: string) {
    return this.licenseService.deleteLicense(id);
  }
}
