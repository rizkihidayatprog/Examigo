import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = [
    'User',
    'Transaction',
    'Subject',
    'Material',
    'Question',
    'Choice',
    'Exam',
    'ExamQuestion',
    'Participant',
    'Answer',
    'Result'
  ];

  for (const table of tables) {
    // PostgreSQL requires double quotes around table names if they are case sensitive
    await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
    console.log(`Enabled RLS for ${table}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
