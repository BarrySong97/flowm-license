import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LicenseModule } from './license/license.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    LicenseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
