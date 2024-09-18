import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}
}
