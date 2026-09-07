import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', requireAuth, authController.logout);

export default router;
