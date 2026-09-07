import prisma from '../config/prisma';

export const jobRepository = {
  findAll: () =>
    prisma.jobPosting.findMany({ orderBy: { postedDate: 'desc' } }),

  findById: (id: string) =>
    prisma.jobPosting.findUnique({ where: { id } }),

  findInterestByUserAndJob: (userId: string, jobPostingId: string) =>
    prisma.jobInterest.findUnique({
      where: { jobPostingId_userId: { jobPostingId, userId } },
    }),

  createInterest: (data: {
    id: string;
    jobPostingId: string;
    userId: string;
    traineeName: string;
    traineeEmail: string;
    traineeSkills: string[];
    timestamp: string;
  }) =>
    prisma.jobInterest.create({ data }),

  findInterestsByUser: (userId: string) =>
    prisma.jobInterest.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { timestamp: 'desc' },
    }),
};
