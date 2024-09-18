import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
