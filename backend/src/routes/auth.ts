import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Employee ID required').optional(),
  email: z.string().min(1, 'Email required').optional(),
  password: z.string().min(1, 'Password required'),
  rememberMe: z.boolean().optional(),
}).refine(data => Boolean(data.identifier || data.email), {
  message: 'Email address or Employee ID is required',
  path: ['identifier'],
});

router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', requireAuth, authController.logout);

export default router;
