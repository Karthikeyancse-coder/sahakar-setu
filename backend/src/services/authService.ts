import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { comparePassword } from '../utils/hashPassword';
import { createError } from '../middleware/errorHandler';

const JWT_SECRET = () => process.env.JWT_SECRET!;
const JWT_EXPIRES = '7d';

/** Strip passwordHash before returning user to client */
const sanitizeUser = (user: any) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw createError(401, 'Invalid email or password');

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw createError(401, 'Invalid email or password');

    if (user.status === 'deactivated') {
      throw createError(403, 'Account is deactivated. Contact your institute administrator.');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET(),
      { expiresIn: JWT_EXPIRES }
    );

    return { token, user: sanitizeUser(user) };
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, 'User not found');
    return sanitizeUser(user);
  },
};
