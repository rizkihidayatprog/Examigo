import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'adit@a.com' },
    data: { role: 'ADMIN', plan: 'ENTERPRISE', aiQuotaLimit: 999999 }
  });
  
  console.log(`Berhasil mengubah adit@a.com menjadi Super Admin!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
