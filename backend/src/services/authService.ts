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
  login: async (identifier: string, password: string, rememberMe = false) => {
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw createError(401, 'Invalid email/employee ID or password.');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw createError(401, 'Invalid email/employee ID or password.');
    }

    // Account status validation
    const status = (user.status || 'active').toLowerCase().trim();
    if (status === 'suspended') {
      throw createError(403, 'Your account has been temporarily suspended. Please contact support.');
    }
    if (status === 'pending') {
      throw createError(403, 'Your account is pending verification.');
    }
    if (status === 'disabled' || status === 'deactivated') {
      throw createError(403, 'Your account is currently disabled.');
    }

    const expiresIn = rememberMe ? '30d' : '1d';

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET(),
      { expiresIn }
    );

    return { token, user: sanitizeUser(user) };
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, 'User not found');
    return sanitizeUser(user);
  },
};
