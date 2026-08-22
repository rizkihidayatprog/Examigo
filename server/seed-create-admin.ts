import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'rizki@a.com';
  const password = '123456';
  const name = 'Super Admin Rizki';

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`User ${email} sudah ada, mengatur ulang password dan menjadikannya ADMIN...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        plan: 'ENTERPRISE',
        aiQuotaLimit: 999999,
        aiQuotaUsed: 0
      }
    });
    console.log('Berhasil update akun Admin!');
  } else {
    console.log(`Membuat akun baru ${email}...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        plan: 'ENTERPRISE',
        aiQuotaLimit: 999999,
        aiQuotaUsed: 0
      }
    });
    console.log('Berhasil membuat akun Admin baru!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
