import prisma from '../config/prisma';

export const enrollmentRepository = {
  findByUser: (userId: string) =>
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledDate: 'desc' },
    }),

  findByUserAndCourse: (userId: string, courseId: string) =>
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    }),

  create: (data: {
    id: string;
    userId: string;
    courseId: string;
    enrolledDate: string;
  }) =>
    prisma.enrollment.create({ data }),

  update: (id: string, data: Record<string, any>) =>
    prisma.enrollment.update({ where: { id }, data }),
};
