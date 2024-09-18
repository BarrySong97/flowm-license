import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  main()
    .catch((e) => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
}
bootstrap();

async function main() {
  if (
    (await prisma.user.count({ where: { email: 'barrysong97@gmail.com' } })) ===
    0
  ) {
    await prisma.user.create({
      data: {
        email: 'barrysong97@gmail.com',
        username: 'admin',
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      },
    });
  }
}
