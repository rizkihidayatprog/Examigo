import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function resetBudiPassword() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.update({
    where: { email: 'budi@examigo.com' },
    data: { password: hashedPassword },
  });
  console.log('✅ Password budi@examigo.com berhasil di-reset ke 123456');
}

resetBudiPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
