import { Router, Request, Response, NextFunction } from 'express';
import { traineeService } from '../services/traineeService';
import { requireAuth } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

router.get('/dashboard', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = (req.user!.role || '').toLowerCase();
    if (role !== 'trainee') {
      throw createError(403, 'Forbidden: Trainee portal dashboard requires trainee role');
    }

    const data = await traineeService.getDashboard(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
