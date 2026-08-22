import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('Belum ada user di database. Silakan register di aplikasi terlebih dahulu.');
    return;
  }
  
  // Mengambil user pertama sebagai ADMIN
  const firstUser = users[0];
  await prisma.user.update({
    where: { id: firstUser.id },
    data: { role: 'ADMIN', plan: 'ENTERPRISE', aiQuotaLimit: 999999 }
  });
  
  console.log(`Berhasil mengubah ${firstUser.email} menjadi Super Admin!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
