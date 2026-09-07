import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', jobController.getAll);
router.get('/applications/me', requireAuth, jobController.getMyApplications);
router.get('/:id', jobController.getById);
router.post('/:id/apply', requireAuth, jobController.apply);

export default router;
