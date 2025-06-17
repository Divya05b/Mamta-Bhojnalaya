import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'divya_admin@mamtabhojnalaya.com',
      password: '$2a$10$8lvDCXrmncOHlOnV6HAMXOAN7E5f9jLKWZSptRzTt8bxA0FIsNAFC', // password: admin123
      role: 'admin',
    },
  });
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });