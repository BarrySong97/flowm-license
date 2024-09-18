import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { AuthGuard } from '@nestjs/passport'; // 假设你使用 Passport 进行身份验证
import { License } from './models/license.model';

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
  @Post('generate')
  async generate(@Body() generateData: any) {
    return this.licenseService.generate(generateData);
  }

  // 激活许可证
  @UseGuards(AuthGuard('jwt'))
  @Post('activate')
  async activate(@Body() activateData: License) {
    return this.licenseService.activate(activateData);
  }

  // 停用许可证
  @UseGuards(AuthGuard('jwt'))
  @Post('deactivate')
  async deactivate(@Body() deactivateData: License) {
    return this.licenseService.deactivate(deactivateData);
  }

  // 通过邮箱检索许可证
  @UseGuards(AuthGuard('jwt'))
  @Post('retrieve')
  async retrieveByEmail(@Query('email') email: string) {
    return this.licenseService.retrieveByEmail(email);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllLicenses() {
    return this.licenseService.getAllLicenses();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getLicense(@Param('id') id: string) {
    return this.licenseService.getLicense(id);
  }
}
