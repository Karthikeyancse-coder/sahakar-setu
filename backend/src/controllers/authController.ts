import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) { next(err); }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.json(user);
    } catch (err) { next(err); }
  },

  // JWT is stateless — client clears token. Endpoint exists for symmetry / future token blacklisting.
  logout: (_req: Request, res: Response) => {
    res.json({ message: 'Logged out' });
  },
};
