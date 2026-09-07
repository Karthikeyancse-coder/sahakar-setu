import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const markSchema = z.object({
  sessionId: z.string().min(1, 'sessionId required'),
  method: z.enum(['qr', 'face']),
  qrToken: z.string().optional(),
});

router.get('/sessions', requireAuth, attendanceController.getSessions);
router.post('/sessions', requireAuth, attendanceController.createSession);
router.patch('/sessions/:id/activate', requireAuth, attendanceController.activateSession);
router.post('/', requireAuth, validate(markSchema), attendanceController.mark);

export default router;
