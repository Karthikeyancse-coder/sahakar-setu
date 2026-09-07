import { Router } from 'express';
import { userController } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  languagePreference: z.enum(['en', 'hi', 'mr']).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  cooperativeAffiliation: z.string().optional(),
}).strict();

const kycSchema = z.object({
  aadhaarNumber: z.string().min(4, 'At least 4 digits required'),
});

router.patch('/me', requireAuth, validate(updateSchema), userController.updateMe);
router.post('/me/kyc', requireAuth, validate(kycSchema), userController.verifyKyc);

export default router;
