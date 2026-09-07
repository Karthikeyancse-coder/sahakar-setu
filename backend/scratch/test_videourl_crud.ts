import { PrismaClient } from '@prisma/client';
import { curriculumService } from '../src/services/curriculumService';

const prisma = new PrismaClient();

const facultyUser = {
  userId: 'usr-faculty-pacs',
  role: 'faculty',
  instituteId: 'inst-vamnicom',
};

async function runTest() {
  console.log('=== STARTING VIDEO URL CRUD PERSISTENCE TEST ===\n');

  const testLessonId = 'les-pacs-2-2';
  const targetModuleId = 'mod-pacs-2';

  // 1. Initial State Check
  const initialDb = await prisma.lesson.findUnique({
    where: { id: testLessonId },
    select: { id: true, title: true, videoUrl: true },
  });
  console.log('[STEP 1] Current database row for', testLessonId, ':', initialDb);

  // 2. Update with TEST 1 URL
  const testUrl1 = 'https://www.youtube.com/watch?v=TEST123';
  console.log('\n[STEP 2] Updating lesson with videoUrl:', testUrl1);
  const updated1 = await curriculumService.updateLesson(
    testLessonId,
    {
      videoUrl: testUrl1,
      title: 'Data Entry & Audit Workflow',
    },
    facultyUser
  );
  console.log('API Service returned videoUrl:', updated1.videoUrl);

  // Check Database Directly
  const dbAfter1 = await prisma.lesson.findUnique({
    where: { id: testLessonId },
    select: { id: true, title: true, videoUrl: true, contentEn: true },
  });
  console.log('Direct PostgreSQL row in Supabase:', {
    id: dbAfter1?.id,
    videoUrl: dbAfter1?.videoUrl,
    contentEnVideoUrl: (dbAfter1?.contentEn as any)?.videoUrl,
  });

  if (dbAfter1?.videoUrl !== testUrl1) {
    throw new Error(`FAIL: Expected DB videoUrl to be "${testUrl1}", but got "${dbAfter1?.videoUrl}"`);
  }
  console.log('==> PASS: videoUrl successfully persisted to PostgreSQL column!');

  // 3. GET Single Lesson (READ)
  console.log('\n[STEP 3] Reading single lesson from DB via getLesson()');
  const readLesson = await curriculumService.getLesson(testLessonId);
  console.log('getLesson returned:', {
    id: readLesson.id,
    title: readLesson.title,
    videoUrl: readLesson.videoUrl,
  });
  if (readLesson.videoUrl !== testUrl1) {
    throw new Error(`FAIL: getLesson did not return "${testUrl1}"`);
  }
  console.log('==> PASS: getLesson correctly reads persisted videoUrl!');

  // 4. Update with TEST 2 URL
  const testUrl2 = 'https://www.youtube.com/watch?v=TEST456';
  console.log('\n[STEP 4] Changing videoUrl to:', testUrl2);
  await curriculumService.updateLesson(
    testLessonId,
    {
      videoUrl: testUrl2,
    },
    facultyUser
  );
  const dbAfter2 = await prisma.lesson.findUnique({
    where: { id: testLessonId },
    select: { id: true, videoUrl: true },
  });
  console.log('Direct PostgreSQL row:', dbAfter2);
  if (dbAfter2?.videoUrl !== testUrl2) {
    throw new Error(`FAIL: Expected DB videoUrl to be "${testUrl2}", but got "${dbAfter2?.videoUrl}"`);
  }
  console.log('==> PASS: Changing video URL successfully updated the database value!');

  // 5. Clear Video URL (DELETE / NULL test)
  console.log('\n[STEP 5] Clearing videoUrl (passing empty string "")');
  await curriculumService.updateLesson(
    testLessonId,
    {
      videoUrl: '',
    },
    facultyUser
  );
  const dbAfter3 = await prisma.lesson.findUnique({
    where: { id: testLessonId },
    select: { id: true, videoUrl: true },
  });
  console.log('Direct PostgreSQL row after clearing:', dbAfter3);
  if (dbAfter3?.videoUrl !== null) {
    throw new Error(`FAIL: Expected DB videoUrl to be NULL, but got "${dbAfter3?.videoUrl}"`);
  }
  console.log('==> PASS: Clearing videoUrl sets PostgreSQL videoUrl = NULL!');

  // 6. Restore to user URL from screenshot
  const screenshotUrl = 'https://youtu.be/CdOsH01m55Y?si=bRcdccZGCBifreQ8';
  console.log('\n[STEP 6] Restoring to user screenshot URL:', screenshotUrl);
  await curriculumService.updateLesson(
    testLessonId,
    {
      videoUrl: screenshotUrl,
    },
    facultyUser
  );
  const dbFinal = await prisma.lesson.findUnique({
    where: { id: testLessonId },
    select: { id: true, videoUrl: true, contentEn: true },
  });
  console.log('Direct PostgreSQL row restored:', {
    id: dbFinal?.id,
    videoUrl: dbFinal?.videoUrl,
  });
  if (dbFinal?.videoUrl !== screenshotUrl) {
    throw new Error(`FAIL: Expected DB videoUrl to be "${screenshotUrl}", but got "${dbFinal?.videoUrl}"`);
  }
  console.log('==> PASS: Database is confirmed holding the exact screenshot URL in PostgreSQL!');

  // 7. Check Full Course Curriculum matches
  console.log('\n[STEP 7] Verifying Course Curriculum endpoint reflects DB state...');
  const fullCurriculum = await curriculumService.getCourseCurriculum('crs-pacs-erp-101');
  const mod = fullCurriculum.modules.find((m: any) => m.id === targetModuleId);
  const les = mod?.lessons.find((l: any) => l.id === testLessonId);
  console.log('Course Curriculum lesson videoUrl:', les?.videoUrl);
  if (les?.videoUrl !== screenshotUrl) {
    throw new Error(`FAIL: Full curriculum did not reflect "${screenshotUrl}"`);
  }
  console.log('==> PASS: Course Curriculum correctly provides database videoUrl to CourseBuilder & Trainee views!');

  console.log('\n========================================');
  console.log('ALL VIDEO URL CRUD PERSISTENCE TESTS PASSED!');
  console.log('========================================');
}

runTest()
  .catch((e) => {
    console.error('TEST ERROR:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
