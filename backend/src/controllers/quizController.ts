import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quizService';

export const quizController = {
  submit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await quizService.submitQuiz(
        req.user!.userId,
        req.body.courseId,
        req.params.quizId,
        req.body.answers
      );
      res.json(result);
    } catch (err) { next(err); }
  },
};
