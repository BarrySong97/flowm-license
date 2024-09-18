import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class License {
  @IsNotEmpty()
  @IsString()
  licenseKey: string;

  @IsNotEmpty()
  @IsString()
  macId: string;
}

export class GenerateLicense {
  @IsNotEmpty()
  @IsString()
  licenseKey: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  maxDevices: number;

  @IsNotEmpty()
  @IsDate()
  expiresAt: Date | null;
}
