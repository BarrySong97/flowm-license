import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from './password.service';
import { JWTAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_ACCESS_SECRET,
          signOptions: {
            expiresIn: Number(process.env.JWT_EXPIRES_IN),
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JWTAuthGuard, PasswordService],
  controllers: [AuthController],
  exports: [JWTAuthGuard],
})
export class AuthModule {}
