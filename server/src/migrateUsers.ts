import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  const users = await prisma.user.findMany({
    where: {
      plan: {
        in: ['PERSONAL', 'PRO_AI', 'ENTERPRISE']
      },
      planValidUntil: null
    }
  });

  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 1);

  let updated = 0;
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { planValidUntil: validUntil }
    });
    updated++;
  }

  console.log(`Migrated ${updated} users to have 30 days planValidUntil.`);
  process.exit(0);
}

migrate();
