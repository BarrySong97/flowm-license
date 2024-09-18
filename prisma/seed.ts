import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.user.count({ where: { username: 'Barry' } })) === 0) {
    await prisma.user.create({
      data: {
        email: 'lisa@simpson.com',
        username: 'Barry',
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
