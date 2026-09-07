import { Request, Response, NextFunction } from 'express';
import { attendanceService } from '../services/attendanceService';

export const attendanceController = {
  getSessions: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await attendanceService.getActiveSessions()); }
    catch (err) { next(err); }
  },

  mark: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await attendanceService.markAttendance(
        req.user!.userId,
        req.body.sessionId,
        req.body.method,
        req.body.qrToken
      );
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  createSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await attendanceService.createSession(req.body);
      res.status(201).json(session);
    } catch (err) { next(err); }
  },

  activateSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await attendanceService.activateSession(req.params.id, req.body.active);
      res.json(session);
    } catch (err) { next(err); }
  },
};
