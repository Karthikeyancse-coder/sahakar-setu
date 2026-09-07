import prisma from '../config/prisma';

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  updateById: (id: string, data: Record<string, any>) =>
    prisma.user.update({ where: { id }, data }),
};
