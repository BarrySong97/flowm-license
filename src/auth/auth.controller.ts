import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { JWTAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } =
      await this.authService.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('login')
  async login(@Body() { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JWTAuthGuard)
  @Post('user')
  async getUser(@Headers('Authorization') headers: string) {
    return await this.authService.getUserFromToken(headers?.split(' ')?.[1]);
  }
}
