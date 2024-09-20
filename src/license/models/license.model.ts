import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageSearch } from 'src/common/models/page.model';

export class License {
  @IsNotEmpty()
  @IsString()
  licenseKey: string;

  @IsNotEmpty()
  @IsString()
  macId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class UpdateLicense {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  maxDevices?: number;

  @IsOptional()
  @IsNumber()
  expiresAt?: number;
}

export class GenerateLicense {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  maxDevices: number;

  @IsNotEmpty()
  @IsNumber()
  expiresAt: number;
}
export class LicenseQuery extends PageSearch {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  licenseKey?: string;

  @IsNumber()
  @IsOptional()
  expiresAt?: number;
}
