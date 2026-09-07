import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { facultyService } from '../services/facultyService';
import { createError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/faculty/dashboard
 * Aggregates authenticated faculty stats, authored courses, enrolled trainees,
 * session schedules with QR tokens, at-risk trainee flags, quiz performance,
 * certificate pipeline, and employment readiness matching.
 */
router.get('/dashboard', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const role = (user.role || '').toLowerCase();

    // Faculty or higher academic administrator access
    if (role !== 'faculty' && role !== 'institute_admin' && role !== 'super_admin') {
      throw createError(403, 'Forbidden: Faculty Dashboard requires faculty or academic admin credentials');
    }

    const data = await facultyService.getDashboardData(user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
