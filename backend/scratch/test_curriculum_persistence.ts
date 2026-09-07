import { PrismaClient } from '@prisma/client';
import { curriculumService } from '../src/services/curriculumService';
import { facultyService } from '../src/services/facultyService';
import { learningService } from '../src/services/learningService';

const prisma = new PrismaClient();

async function runDatabasePersistenceTest() {
  console.log('🧪 ========================================================');
  console.log('🧪 RUNNING COURSE BUILDER CURRICULUM PERSISTENCE TEST');
  console.log('🧪 ========================================================\n');

  // 1. Identify faculty user
  const facultyUser = await prisma.user.findFirst({
    where: { role: 'faculty' },
  });
  if (!facultyUser) throw new Error('No faculty user found in database');
  console.log(`✅ Step 1: Authenticated faculty: ${facultyUser.name} (${facultyUser.email}, Institute: ${facultyUser.instituteId})`);

  const facultyAuth = {
    userId: facultyUser.id,
    role: facultyUser.role,
    instituteId: facultyUser.instituteId,
  };

  // 2. Identify trainee user
  const traineeUser = await prisma.user.findFirst({
    where: { role: 'trainee' },
  });
  if (!traineeUser) throw new Error('No trainee user found in database');
  console.log(`✅ Step 2: Trainee user: ${traineeUser.name} (${traineeUser.email})`);

  const courseId = 'crs-pacs-erp-101';
  console.log(`\n📚 Testing on Course: ${courseId}`);

  // 3. CREATE MODULE
  console.log('\n--- Step 3: Create Module in Database ---');
  const modTitle = `Test Persistent Module ${Date.now()}`;
  const createdMod = await curriculumService.createModule(
    courseId,
    {
      title: modTitle,
      titleHi: 'परीक्षण मॉड्यूल',
      titleMr: 'चाचणी घटक',
      description: 'Automated test module for database persistence validation.',
    },
    facultyAuth
  );
  console.log(`✅ Module Created in PostgreSQL! ID: ${createdMod.id}, Title: "${createdMod.title}"`);

  // Verify in Prisma directly
  const dbModCheck = await prisma.module.findUnique({ where: { id: createdMod.id } });
  if (!dbModCheck) throw new Error(`Module ${createdMod.id} not found in DB!`);
  console.log(`✅ Verified Module exists in PostgreSQL 'Module' table.`);

  // 4. CREATE LESSON
  console.log('\n--- Step 4: Create Lesson in Database ---');
  const lessonTitle = `Test Lesson 1.${Date.now()}`;
  const createdLesson = await curriculumService.createLesson(
    createdMod.id,
    {
      title: lessonTitle,
      titleHi: 'पाठ शीर्षक',
      titleMr: 'धडा शीर्षक',
      durationMinutes: 30,
      contentType: 'TEXT',
      contentByLanguage: {
        en: {
          text: 'This is verified persistent lesson content stored in Supabase PostgreSQL.',
          overview: 'Overview of verified database persistent lesson.',
          learningObjectives: ['Verify database persistence', 'Test trainee sync'],
          keyTakeaways: ['All curriculum items are backed by PostgreSQL tables'],
        },
      },
    },
    facultyAuth
  );
  console.log(`✅ Lesson Created in PostgreSQL! ID: ${createdLesson.id}, Title: "${createdLesson.title}"`);

  // Verify in Prisma directly
  const dbLessonCheck = await prisma.lesson.findUnique({ where: { id: createdLesson.id } });
  if (!dbLessonCheck) throw new Error(`Lesson ${createdLesson.id} not found in DB!`);
  console.log(`✅ Verified Lesson exists in PostgreSQL 'Lesson' table.`);

  // 5. CREATE QUIZ / ASSESSMENT
  console.log('\n--- Step 5: Create Assessment / Quiz in Database ---');
  const quizTitle = `Assessment for ${modTitle}`;
  const createdQuiz = await curriculumService.saveQuiz(
    createdMod.id,
    {
      title: quizTitle,
      titleHi: 'मूल्यांकन परीक्षा',
      titleMr: 'मूल्यांकन चाचणी',
      passThreshold: 80,
      questions: [
        {
          id: `test-q-1-${Date.now()}`,
          question: 'Where is the curriculum data stored in Sahakar Setu?',
          questionHi: 'सहकार सेतु में पाठ्यक्रम डेटा कहाँ संग्रहीत होता है?',
          questionMr: 'सहकार सेतूमध्ये अभ्यासक्रम डेटा कुठे साठवला जातो?',
          options: {
            en: [
              'Real PostgreSQL / Supabase Database',
              'Temporary React State Only',
              'Static Array in Frontend',
              'Local Storage Only',
            ],
            hi: [
              'वास्तविक पोस्टग्रेएसक्यूएल / सुपाबेस डेटाबेस',
              'केवल अस्थायी रिएक्ट स्थिति',
              'फ्रंटएंड में स्थिर सरणी',
              'केवल स्थानीय भंडारण',
            ],
            mr: [
              'खरा पोस्टग्रेएसक्यूएल / सुपाबेस डेटाबेस',
              'फक्त तात्पुरती रिएक्ट स्थिती',
              'फ्रंटएंडमध्ये स्थिर अरे',
              'फक्त स्थानिक स्टोरेज',
            ],
          },
          correctOptionIndex: 0,
          explanation: {
            en: 'All curriculum is normalized and stored directly in PostgreSQL tables.',
            hi: 'सभी पाठ्यक्रम सामान्यीकृत हैं और सीधे पोस्टग्रेएसक्यूएल तालिकाओं में संग्रहीत हैं।',
            mr: 'सर्व अभ्यासक्रम सामान्यीकृत असून थेट पोस्टग्रेएसक्यूएल टेबल्समध्ये साठवला जातो.',
          },
        },
      ],
    },
    facultyAuth
  );
  console.log(`✅ Quiz Created in PostgreSQL! ID: ${createdQuiz.id}, Questions: ${createdQuiz.questions?.length}`);

  // Verify in Prisma directly
  const dbQuizCheck = await prisma.quiz.findUnique({
    where: { id: createdQuiz.id },
    include: { questions: { include: { options: true } } },
  });
  if (!dbQuizCheck) throw new Error(`Quiz ${createdQuiz.id} not found in DB!`);
  console.log(`✅ Verified Quiz exists in PostgreSQL 'Quiz' table with ${dbQuizCheck.questions.length} questions and ${dbQuizCheck.questions[0]?.options.length} options.`);

  // 6. SIMULATE REFRESH / FULL CURRICULUM QUERY
  console.log('\n--- Step 6: Simulate Browser Refresh (Fetch Course Curriculum) ---');
  const refreshedCurriculum = await curriculumService.getCourseCurriculum(courseId);
  const foundMod = refreshedCurriculum.modules.find((m: any) => m.id === createdMod.id);
  if (!foundMod) throw new Error('Refreshed curriculum does not contain newly created module!');
  console.log(`✅ Refresh Verification: Found module "${foundMod.title}" with ${foundMod.lessons.length} lessons and quiz: ${foundMod.quiz?.title}`);

  // 7. TRAINEE VIEW QUERY
  console.log('\n--- Step 7: Trainee View Verification ---');
  // Ensure trainee is enrolled
  await learningService.enroll(traineeUser.id, courseId);
  const traineeLearning = await learningService.getCourseLearning(traineeUser.id, courseId);
  const traineeFoundMod = (traineeLearning.modules || []).find((m: any) => m.id === createdMod.id);
  if (!traineeFoundMod) throw new Error('Trainee modules do not contain the new module!');
  console.log(`✅ Trainee View Verified: Trainee sees the same module "${traineeFoundMod.title}" with lesson: ${traineeFoundMod.lessons[0]?.title}`);

  // 8. TRAINEE COMPLETES LESSON
  console.log('\n--- Step 8: Trainee Completes the Lesson ---');
  const completionResult = await learningService.completeLesson(traineeUser.id, createdLesson.id);
  console.log(`✅ Trainee completed lesson! Progress percent: ${completionResult.progressPercent}%`);

  const dbProgress = await prisma.lessonProgress.findFirst({
    where: { userId: traineeUser.id, lessonId: createdLesson.id },
  });
  if (!dbProgress || !dbProgress.completed) {
    throw new Error('LessonProgress was not recorded as completed in DB!');
  }
  console.log(`✅ Verified LessonProgress record in PostgreSQL: ID ${dbProgress.id}, completed: ${dbProgress.completed}`);

  // 9. FACULTY COURSES VIEW MODULE & LESSON COUNT REFLECTION
  console.log('\n--- Step 9: Faculty Courses View Stats Verification ---');
  const facultyCourses = await facultyService.getCourses(facultyUser.id);
  const targetFacultyCourse = facultyCourses.find(c => c.id === courseId);
  const modCount = targetFacultyCourse?.modules?.length || 0;
  const lessonCount = targetFacultyCourse?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
  console.log(`✅ Faculty Course "${targetFacultyCourse?.title}": ${modCount} Modules • ${lessonCount} Lessons from PostgreSQL`);

  // 10. CLEAN UP TEST MODULE
  console.log('\n--- Step 10: Delete Test Module & Verify Deletion ---');
  await curriculumService.deleteModule(createdMod.id, facultyAuth);
  console.log(`✅ Deleted module ${createdMod.id}`);

  const postDeleteCheck = await prisma.module.findUnique({ where: { id: createdMod.id } });
  if (postDeleteCheck) throw new Error('Module was not deleted from DB!');
  console.log(`✅ Verified module no longer exists in PostgreSQL.`);

  console.log('\n🎉 ========================================================');
  console.log('🎉 ALL PERSISTENCE AND DATA FLOW TESTS PASSED 100%!');
  console.log('🎉 ========================================================\n');

  process.exit(0);
}

runDatabasePersistenceTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
