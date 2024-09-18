import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../common/decorators/user.decorator';
import { PrismaService } from 'nestjs-prisma';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './models/user.model';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }
  @Get('')
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
