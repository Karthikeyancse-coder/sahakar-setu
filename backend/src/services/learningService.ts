import crypto from 'crypto';
import { learningRepository } from '../repositories/learningRepository';
import { courseRepository } from '../repositories/courseRepository';
import { userRepository } from '../repositories/userRepository';
import { certificateRepository } from '../repositories/certificateRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { createError } from '../middleware/errorHandler';
import { generateCertId, generateCertHash } from '../utils/generateCertId';

const COURSE_ALIASES: Record<string, string[]> = {
  'crs-shg-101': ['crs-shg-101', 'crs-shg-gov-301'],
  'crs-shg-gov-301': ['crs-shg-gov-301', 'crs-shg-101'],
  'crs-dairy-101': ['crs-dairy-101', 'crs-dairy-mgmt-201'],
  'crs-dairy-mgmt-201': ['crs-dairy-mgmt-201', 'crs-dairy-101'],
  'crs-pacs-101': ['crs-pacs-101', 'crs-pacs-erp-101'],
  'crs-pacs-erp-101': ['crs-pacs-erp-101', 'crs-pacs-101'],
};

export const learningService = {
  /**
   * Enroll a learner in a course
   */
  enroll: async (userId: string, courseId: string) => {
    // 1. Resolve course
    let course = await courseRepository.findById(courseId);
    if (!course && COURSE_ALIASES[courseId]) {
      for (const alias of COURSE_ALIASES[courseId]) {
        course = await courseRepository.findById(alias);
        if (course) break;
      }
    }
    if (!course) throw createError(404, `Course ${courseId} not found`);

    // 2. Check existing enrollment under primary or alias ID
    let existingEnrollment = await learningRepository.findEnrollment(userId, course.id);
    if (!existingEnrollment && courseId !== course.id) {
      existingEnrollment = await learningRepository.findEnrollment(userId, courseId);
    }
    if (existingEnrollment) {
      return {
        alreadyEnrolled: true,
        enrollment: existingEnrollment,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const enrollmentId = `enr-${userId}-${course.id}`;

    const newEnrollment = await learningRepository.createEnrollment({
      id: enrollmentId,
      userId,
      courseId: course.id,
      enrolledDate: today,
      status: 'ENROLLED',
    });

    // Notify learner
    await notificationRepository.create({
      id: `notif-enr-${Date.now()}`,
      userId,
      title: 'Enrolled in Course! 📚',
      message: `You have successfully enrolled in "${course.title}". Start learning now!`,
      timestamp: new Date().toISOString(),
      type: 'course',
      linkView: 'course-detail',
    }).catch(() => {});

    return {
      alreadyEnrolled: false,
      enrollment: newEnrollment,
    };
  },

  /**
   * Get learning status, curriculum, lessons, quiz status, and progress for a course
   */
  getCourseLearning: async (userId: string, courseId: string) => {
    let course = await courseRepository.findById(courseId);
    if (!course && COURSE_ALIASES[courseId]) {
      for (const alias of COURSE_ALIASES[courseId]) {
        course = await courseRepository.findById(alias);
        if (course) {
          courseId = course.id;
          break;
        }
      }
    }
    if (!course) throw createError(404, `Course ${courseId} not found`);

    const targetCourseIds = Array.from(new Set([course.id, ...(COURSE_ALIASES[course.id] || []), ...(COURSE_ALIASES[courseId] || [])]));
    const curriculum = await learningRepository.getCourseCurriculum(targetCourseIds);
    let enrollment = await learningRepository.findEnrollment(userId, course.id);
    if (!enrollment && courseId !== course.id) {
      enrollment = await learningRepository.findEnrollment(userId, courseId);
    }

    // Build completed map
    const completedLessonSet = new Set<string>();
    if (enrollment?.lessonProgress) {
      enrollment.lessonProgress.forEach((lp) => {
        if (lp.status === 'COMPLETED') completedLessonSet.add(lp.lessonId);
      });
    }
    if (Array.isArray(enrollment?.completedLessonIds)) {
      (enrollment?.completedLessonIds as string[]).forEach((id) => completedLessonSet.add(id));
    }

    // Build quiz attempts map & passed status
    const quizPassedMap = new Map<string, { passed: boolean; bestScore: number; attempts: number }>();
    if (enrollment?.quizAttempts) {
      enrollment.quizAttempts.forEach((attempt) => {
        const current = quizPassedMap.get(attempt.quizId) || { passed: false, bestScore: 0, attempts: 0 };
        current.attempts += 1;
        if (attempt.passed) current.passed = true;
        if (attempt.percentage > current.bestScore) current.bestScore = attempt.percentage;
        quizPassedMap.set(attempt.quizId, current);
      });
    }
    if (Array.isArray(enrollment?.completedQuizIds)) {
      (enrollment?.completedQuizIds as string[]).forEach((qid) => {
        const current = quizPassedMap.get(qid) || { passed: true, bestScore: 100, attempts: 1 };
        current.passed = true;
        quizPassedMap.set(qid, current);
      });
    }

    // Process modules and strip sensitive quiz answers from this overview
    const processedModules = curriculum.map((mod) => {
      const moduleLessonIds = mod.lessons.map((l) => l.id);
      const allLessonsCompleted =
        moduleLessonIds.length > 0 &&
        moduleLessonIds.every((id) => completedLessonSet.has(id));

      const moduleQuizzes = mod.quizzes.map((q) => {
        const quizStat = quizPassedMap.get(q.id) || { passed: false, bestScore: 0, attempts: 0 };
        return {
          id: q.id,
          title: q.title,
          titleHi: q.titleHi,
          titleMr: q.titleMr,
          passThreshold: q.passThreshold,
          questionCount: q.questions.length,
          passed: quizStat.passed,
          bestScore: quizStat.bestScore,
          attemptsCount: quizStat.attempts,
        };
      });

      const allQuizzesPassed =
        moduleQuizzes.length === 0 || moduleQuizzes.every((q) => q.passed);

      return {
        id: mod.id,
        orderIndex: mod.orderIndex,
        title: mod.title,
        titleHi: mod.titleHi,
        titleMr: mod.titleMr,
        description: mod.description,
        isCompleted: allLessonsCompleted && allQuizzesPassed,
        lessons: mod.lessons.map((l) => ({
          ...l,
          isCompleted: completedLessonSet.has(l.id),
        })),
        quizzes: moduleQuizzes,
      };
    });

    const certificate = await certificateRepository.findByUserAndCourse(userId, course.id);

    return {
      course: {
        id: course.id,
        title: course.title,
        titleHi: course.titleHi,
        titleMr: course.titleMr,
        description: course.description,
        thumbnail: course.thumbnail,
        durationHours: course.durationHours,
        category: course.category,
        level: course.level,
      },
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            progressPercent: enrollment.progressPercent,
            enrolledDate: enrollment.enrolledDate,
            completedAt: enrollment.completedAt,
            completionDate: enrollment.completionDate,
            lastAccessedLessonId: enrollment.lastAccessedLessonId,
          }
        : null,
      modules: processedModules,
      certificate: certificate
        ? {
            id: certificate.id,
            certificateNumber: certificate.certificateNumber || certificate.id,
            verificationToken: certificate.verificationToken,
            issuedDate: certificate.issueDate || certificate.issuedDate,
            grade: certificate.grade,
          }
        : null,
    };
  },

  /**
   * Complete a lesson and update course progress
   */
  completeLesson: async (userId: string, lessonId: string) => {
    const lesson = await learningRepository.findLesson(lessonId);
    if (!lesson) throw createError(404, `Lesson ${lessonId} not found`);

    const courseId = lesson.courseId;
    let enrollment = await learningRepository.findEnrollment(userId, courseId);
    if (!enrollment) {
      const today = new Date().toISOString().split('T')[0];
      enrollment = await learningRepository.createEnrollment({
        id: `enr-${userId}-${courseId}`,
        userId,
        courseId,
        enrolledDate: today,
        status: 'IN_PROGRESS',
      });
    }

    // Upsert LessonProgress
    const progressId = `lp-${enrollment.id}-${lessonId}`;
    await learningRepository.upsertLessonProgress({
      id: progressId,
      enrollmentId: enrollment.id,
      courseId,
      moduleId: lesson.moduleId,
      lessonId,
      userId,
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    // Update completedLessonIds list
    const currentCompleted = new Set<string>(
      Array.isArray(enrollment.completedLessonIds)
        ? (enrollment.completedLessonIds as string[])
        : []
    );
    currentCompleted.add(lessonId);
    const updatedLessonIds = Array.from(currentCompleted);

    // Calculate overall course progress
    const targetCourseIds = Array.from(new Set([courseId, ...(COURSE_ALIASES[courseId] || [])]));
    const curriculum = await learningRepository.getCourseCurriculum(targetCourseIds);
    let totalLessons = 0;
    let totalQuizzes = 0;
    curriculum.forEach((mod) => {
      totalLessons += mod.lessons.length;
      totalQuizzes += mod.quizzes.length;
    });

    const passedQuizzes = new Set<string>(
      Array.isArray(enrollment.completedQuizIds)
        ? (enrollment.completedQuizIds as string[])
        : []
    );

    const totalTrackableItems = totalLessons + totalQuizzes;
    const completedItems = updatedLessonIds.length + passedQuizzes.size;
    const progressPercent = totalTrackableItems > 0
      ? Math.min(100, Math.round((completedItems / totalTrackableItems) * 100))
      : 100;

    const allCompleted =
      updatedLessonIds.length >= totalLessons &&
      passedQuizzes.size >= totalQuizzes &&
      totalTrackableItems > 0;

    const newStatus = allCompleted
      ? 'COMPLETED'
      : progressPercent > 0
      ? 'IN_PROGRESS'
      : enrollment.status;

    await learningRepository.updateEnrollment(enrollment.id, {
      completedLessonIds: updatedLessonIds,
      progressPercent,
      lastAccessedLessonId: lessonId,
      status: newStatus,
      ...(allCompleted && !enrollment.completedAt
        ? {
            completedAt: new Date(),
            completionDate: new Date().toISOString().split('T')[0],
          }
        : {}),
    });

    return {
      success: true,
      lessonId,
      progressPercent,
      status: newStatus,
      allCompleted,
    };
  },

  /**
   * Get quiz for learner — SERVER-SIDE SECURITY: strip isCorrect from options!
   */
  getModuleQuiz: async (userId: string, quizOrModuleId: string) => {
    let quiz = await learningRepository.findQuizById(quizOrModuleId);
    if (!quiz) {
      quiz = await learningRepository.findQuizByModuleId(quizOrModuleId);
    }
    if (!quiz) throw createError(404, `Quiz not found for identifier ${quizOrModuleId}`);

    const attemptsCount = await learningRepository.getQuizAttemptsCount(userId, quiz.id);

    // Filter sensitive fields: NEVER send isCorrect to client
    const safeQuestions = quiz.questions.map((q) => ({
      id: q.id,
      orderIndex: q.orderIndex,
      questionText: q.questionText,
      questionTextHi: q.questionTextHi,
      questionTextMr: q.questionTextMr,
      explanationEn: q.explanationEn,
      explanationHi: q.explanationHi,
      explanationMr: q.explanationMr,
      options: q.options.map((opt) => ({
        id: opt.id,
        optionIndex: opt.optionIndex,
        optionText: opt.optionText,
        optionTextHi: opt.optionTextHi,
        optionTextMr: opt.optionTextMr,
      })),
    }));

    return {
      id: quiz.id,
      moduleId: quiz.moduleId,
      courseId: quiz.courseId,
      title: quiz.title,
      titleHi: quiz.titleHi,
      titleMr: quiz.titleMr,
      description: quiz.description,
      passThreshold: quiz.passThreshold,
      totalQuestions: safeQuestions.length,
      attemptsCount,
      questions: safeQuestions,
    };
  },

  /**
   * Submit quiz, grade against DB, record attempt, update progress, and issue certificate if course complete
   */
  submitQuiz: async (
    userId: string,
    quizId: string,
    submittedAnswers: Record<string, string> | Array<{ questionId: string; selectedOptionId: string }>
  ) => {
    // 1. Fetch full quiz from DB (including isCorrect)
    const quiz = await learningRepository.findQuizById(quizId);
    if (!quiz) throw createError(404, `Quiz ${quizId} not found`);

    const course = await courseRepository.findById(quiz.courseId);
    if (!course) throw createError(404, `Course ${quiz.courseId} not found`);

    let enrollment = await learningRepository.findEnrollment(userId, quiz.courseId);
    if (!enrollment) {
      const today = new Date().toISOString().split('T')[0];
      enrollment = await learningRepository.createEnrollment({
        id: `enr-${userId}-${quiz.courseId}`,
        userId,
        courseId: quiz.courseId,
        enrolledDate: today,
        status: 'IN_PROGRESS',
      });
    }

    // Standardize answers format: questionId -> selectedOptionId
    const answerMap: Record<string, string> = {};
    if (Array.isArray(submittedAnswers)) {
      submittedAnswers.forEach((item: any, idx: number) => {
        if (typeof item === 'object' && item !== null && item.questionId && item.selectedOptionId) {
          answerMap[item.questionId] = item.selectedOptionId;
        } else if (typeof item === 'number' && quiz.questions[idx]) {
          const q = quiz.questions[idx];
          const opt = q.options[item] || q.options.find((o) => o.optionIndex === item);
          if (opt) answerMap[q.id] = opt.id;
        }
      });
    } else if (typeof submittedAnswers === 'object' && submittedAnswers !== null) {
      Object.entries(submittedAnswers).forEach(([qId, optId]) => {
        if (typeof optId === 'string') {
          answerMap[qId] = optId;
        }
      });
    }

    // 2. Grade each question
    let correctCount = 0;
    const attemptAnswersData: Array<{
      id: string;
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      correctOptionId: string;
    }> = [];

    quiz.questions.forEach((q) => {
      const selectedOptionId = answerMap[q.id] || '';
      const correctOption = q.options.find((opt) => opt.isCorrect);
      const matchingSelected = q.options.find((opt) => opt.id === selectedOptionId);
      const isCorrect = !!correctOption && selectedOptionId === correctOption.id;

      if (isCorrect) correctCount++;

      attemptAnswersData.push({
        id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        questionId: q.id,
        selectedOptionId: matchingSelected ? matchingSelected.id : (q.options[0]?.id || ''),
        isCorrect,
        correctOptionId: correctOption ? correctOption.id : '',
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= quiz.passThreshold;

    const previousAttempts = await learningRepository.getQuizAttemptsCount(userId, quiz.id);
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 3. Record attempt in Supabase
    await learningRepository.createQuizAttempt({
      id: attemptId,
      quizId: quiz.id,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      userId,
      enrollmentId: enrollment.id,
      score: percentage,
      totalQuestions,
      correctAnswers: correctCount,
      percentage,
      passed,
      attemptNumber: previousAttempts + 1,
      answers: attemptAnswersData,
    });

    // 4. Update enrollment progress
    const currentPassedQuizzes = new Set<string>(
      Array.isArray(enrollment.completedQuizIds)
        ? (enrollment.completedQuizIds as string[])
        : []
    );
    if (passed) {
      currentPassedQuizzes.add(quiz.id);
    }
    const updatedCompletedQuizIds = Array.from(currentPassedQuizzes);

    const targetCourseIds = Array.from(new Set([quiz.courseId, ...(COURSE_ALIASES[quiz.courseId] || [])]));
    const curriculum = await learningRepository.getCourseCurriculum(targetCourseIds);
    let totalLessons = 0;
    let totalQuizzes = 0;
    curriculum.forEach((mod) => {
      totalLessons += mod.lessons.length;
      totalQuizzes += mod.quizzes.length;
    });

    const completedLessonIds = Array.isArray(enrollment.completedLessonIds)
      ? (enrollment.completedLessonIds as string[])
      : [];

    const totalTrackableItems = totalLessons + totalQuizzes;
    const completedItems = completedLessonIds.length + updatedCompletedQuizIds.length;
    const progressPercent = totalTrackableItems > 0
      ? Math.min(100, Math.round((completedItems / totalTrackableItems) * 100))
      : 100;

    const allCurriculumCompleted =
      completedLessonIds.length >= totalLessons &&
      updatedCompletedQuizIds.length >= totalQuizzes &&
      totalTrackableItems > 0;

    const newStatus = allCurriculumCompleted
      ? 'COMPLETED'
      : progressPercent > 0
      ? 'IN_PROGRESS'
      : enrollment.status;

    await learningRepository.updateEnrollment(enrollment.id, {
      completedQuizIds: updatedCompletedQuizIds,
      progressPercent: allCurriculumCompleted ? 100 : progressPercent,
      status: newStatus,
      ...(allCurriculumCompleted && !enrollment.completedAt
        ? {
            completedAt: new Date(),
            completionDate: new Date().toISOString().split('T')[0],
          }
        : {}),
    });

    // 5. If Course Fully Completed, Issue Certificate
    let certificate = await certificateRepository.findByUserAndCourse(userId, quiz.courseId);
    if (allCurriculumCompleted && !certificate) {
      const user = await userRepository.findById(userId);
      const grade =
        percentage >= 90 ? 'Distinction' : percentage >= 75 ? 'First Class' : 'Passed';
      const instTag = (course.category || 'NCCT').replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() || 'NCT';
      const certId = generateCertId(instTag);
      const certNum = `NCCT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const verificationToken = crypto.randomBytes(24).toString('hex');
      const today = new Date().toISOString().split('T')[0];

      certificate = await certificateRepository.create({
        id: certId,
        certificateNumber: certNum,
        userId,
        userName: user ? user.name : 'Trainee',
        userAadhaarMock: user?.aadhaarMock || undefined,
        courseId: quiz.courseId,
        enrollmentId: enrollment.id,
        courseTitle: course.title,
        courseTitleHi: course.titleHi,
        instituteId: course.instituteId,
        instituteName: 'NCCT National Institute of Cooperative Management',
        issuedDate: today,
        issueDate: today,
        completionDate: today,
        certificateHash: generateCertHash(),
        verificationToken,
        qrCodeData: `/verify/certificate/${verificationToken}`,
        grade,
        status: 'ISSUED',
      });

      // Send Certificate Notification
      await notificationRepository.create({
        id: `notif-cert-${certId}`,
        userId,
        title: 'Course Completed & Certificate Issued! 🎓',
        message: `Congratulations! You successfully completed "${course.title}". Your official NCCT certificate is ready.`,
        timestamp: new Date().toISOString(),
        type: 'certificate',
        linkView: 'certificates',
      }).catch(() => {});
    }

    return {
      passed,
      score: percentage,
      scorePercent: percentage,
      correctAnswers: correctCount,
      totalQuestions,
      passThreshold: quiz.passThreshold,
      courseCompleted: allCurriculumCompleted,
      progressPercent: allCurriculumCompleted ? 100 : progressPercent,
      attemptNumber: previousAttempts + 1,
      certificate: certificate
        ? {
            id: certificate.id,
            certificateNumber: certificate.certificateNumber || certificate.id,
            verificationToken: certificate.verificationToken,
            issuedDate: certificate.issueDate || certificate.issuedDate,
            grade: certificate.grade,
          }
        : null,
      questionResults: attemptAnswersData.map((a) => ({
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
        correctOptionId: a.correctOptionId,
      })),
    };
  },

  /**
   * Verify certificate by token (Public endpoint)
   */
  verifyCertificate: async (token: string) => {
    let cert = await learningRepository.findCertificateByToken(token);
    if (!cert) {
      // Try by ID as fallback
      cert = await learningRepository.findCertificateById(token);
    }
    if (!cert) throw createError(404, 'Certificate not found or invalid token');

    return {
      valid: cert.status !== 'REVOKED',
      status: cert.status,
      certificateNumber: cert.certificateNumber || cert.id,
      candidateName: cert.userName,
      courseTitle: cert.courseTitle,
      courseTitleHi: cert.courseTitleHi,
      instituteName: cert.instituteName,
      issuedDate: cert.issueDate || cert.issuedDate,
      completionDate: cert.completionDate,
      grade: cert.grade,
      verificationToken: cert.verificationToken,
      qrCodeData: cert.qrCodeData || `/verify/certificate/${cert.verificationToken || cert.id}`,
      certificateHash: cert.certificateHash,
      cooperative: cert.user?.cooperativeAffiliation || 'Indian Cooperative Movement',
      state: 'India',
    };
  },
};
