import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function checkPasswords() {
  const users = await prisma.user.findMany();
  const testPasswords = ['123456', '12345678', 'password', 'admin123', 'budi123', 'rizki123', '123'];

  for (const u of users) {
    console.log(`Checking user: ${u.name} (${u.email})`);
    for (const pwd of testPasswords) {
      const match = await bcrypt.compare(pwd, u.password);
      if (match) {
        console.log(`✅ MATCH FOUND! Email: ${u.email} | Password: ${pwd}`);
      }
    }
  }
}

checkPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
