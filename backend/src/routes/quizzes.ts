import { Router } from 'express';
import { quizController } from '../controllers/quizController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const submitSchema = z.object({
  courseId: z.string().min(1, 'courseId required'),
  answers: z.array(z.number().int().min(0)).min(1, 'answers array required'),
});

router.post('/:quizId/submit', requireAuth, validate(submitSchema), quizController.submit);

export default router;
