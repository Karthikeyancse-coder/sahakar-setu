import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    select: {
      id: true,
      moduleId: true,
      title: true,
      contentType: true,
      videoUrl: true,
      contentEn: true,
    },
    orderBy: { orderIndex: 'asc' },
  });

  console.log(`Found ${lessons.length} lessons in database:`);
  for (const l of lessons) {
    const en = l.contentEn as any;
    console.log(`- [${l.id}] (${l.moduleId}) "${l.title}" | videoUrl: ${JSON.stringify(l.videoUrl)} | contentEn.videoUrl: ${JSON.stringify(en?.videoUrl)}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
