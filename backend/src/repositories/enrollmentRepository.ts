import prisma from '../config/prisma';

export const enrollmentRepository = {
  findByUser: (userId: string) =>
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    }),

  findByUserAndCourse: async (userId: string, courseId: string) => {
    let enr = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true },
    });
    if (!enr) {
      const aliasMap: Record<string, string> = {
        'crs-dairy-mgmt-201': 'crs-dairy-101',
        'crs-dairy-101': 'crs-dairy-mgmt-201',
        'crs-pacs-101': 'crs-pacs-erp-101',
        'crs-pacs-erp-101': 'crs-pacs-101',
        'crs-shg-gov-301': 'crs-shg-101',
        'crs-shg-101': 'crs-shg-gov-301',
      };
      const alias = aliasMap[courseId];
      if (alias) {
        enr = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: alias } },
          include: { course: true },
        });
      }
    }
    return enr;
  },

  create: (data: {
    id: string;
    userId: string;
    courseId: string;
    enrolledDate: string;
    status?: string;
    progressPercent?: number;
    completedLessonIds?: any;
    completedQuizIds?: any;
  }) =>
    prisma.enrollment.create({
      data: {
        id: data.id,
        userId: data.userId,
        courseId: data.courseId,
        enrolledDate: data.enrolledDate,
        status: data.status || 'IN_PROGRESS',
        progressPercent: data.progressPercent || 0,
        completedLessonIds: data.completedLessonIds || [],
        completedQuizIds: data.completedQuizIds || [],
      },
      include: { course: true },
    }),

  update: (id: string, data: Record<string, any>) =>
    prisma.enrollment.update({
      where: { id },
      data,
      include: { course: true },
    }),
};
