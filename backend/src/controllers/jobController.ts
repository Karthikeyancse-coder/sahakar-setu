import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/jobService';

export const jobController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await jobService.getAllJobs()); }
    catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await jobService.getJobById(req.params.id)); }
    catch (err) { next(err); }
  },

  apply: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await jobService.applyForJob(req.user!.userId, req.params.id);
      res.status(result.alreadyApplied ? 200 : 201).json(result);
    } catch (err) { next(err); }
  },

  getMyApplications: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await jobService.getMyApplications(req.user!.userId)); }
    catch (err) { next(err); }
  },
};
