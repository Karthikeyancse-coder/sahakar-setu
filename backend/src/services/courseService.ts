import { enrollmentRepository } from '../repositories/enrollmentRepository';
import { courseRepository } from '../repositories/courseRepository';
import { createError } from '../middleware/errorHandler';

// Helper to calculate progress given completed lesson IDs vs total lessons in course
const calcProgress = (completedLessonIds: string[], modulesJson: any[]): number => {
  const totalLessons = (modulesJson as any[]).reduce(
    (acc: number, m: any) => acc + (m.lessons?.length || 0),
    0
  );
  if (totalLessons === 0) return 0;
  return Math.min(100, Math.round((completedLessonIds.length / totalLessons) * 100));
};

export const courseService = {
  getAllCourses: () => courseRepository.findAll(),

  getCourseById: async (id: string) => {
    const course = await courseRepository.findById(id);
    if (!course) throw createError(404, 'Course not found');
    return course;
  },

  getEnrollments: (userId: string) => enrollmentRepository.findByUser(userId),

  enrollInCourse: async (userId: string, courseId: string) => {
    const course = await courseRepository.findById(courseId);
    if (!course) throw createError(404, 'Course not found');

    const existing = await enrollmentRepository.findByUserAndCourse(userId, courseId);
    if (existing) return existing; // idempotent

    return enrollmentRepository.create({
      id: `enr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      courseId,
      enrolledDate: new Date().toISOString().split('T')[0],
    });
  },

  markLessonComplete: async (userId: string, enrollmentId: string, lessonId: string) => {
    const enrollment = await enrollmentRepository.findByUser(userId)
      .then(list => list.find(e => e.id === enrollmentId));

    if (!enrollment) throw createError(404, 'Enrollment not found');
    if (enrollment.userId !== userId) throw createError(403, 'Forbidden');

    const completed = enrollment.completedLessonIds as string[];
    if (completed.includes(lessonId)) return enrollment; // already done

    const updatedCompleted = [...completed, lessonId];
    const modules = enrollment.course?.modulesJson as any[] || [];
    const progress = calcProgress(updatedCompleted, modules);
    const isFullyDone =
      progress === 100 &&
      (enrollment.completedQuizIds as string[]).length >=
        modules.filter((m: any) => m.quiz).length;

    return enrollmentRepository.update(enrollmentId, {
      completedLessonIds: updatedCompleted,
      progressPercent: progress,
      lastAccessedLessonId: lessonId,
      ...(isFullyDone && enrollment.status !== 'completed'
        ? { status: 'completed', completionDate: new Date().toISOString().split('T')[0] }
        : {}),
    });
  },
};
