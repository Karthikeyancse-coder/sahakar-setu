import { Request, Response, NextFunction } from 'express';
import { chatRepository } from '../repositories/chatRepository';

// Minimal rule-based Career Sahayak responses (mirrors current frontend logic)
const getRuleBasedResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('certificate') || lower.includes('cert')) {
    return 'Your certificates are listed under the "My Certificates" section. Each has a QR code for public verification. Complete all course quizzes to earn new certificates.';
  }
  if (lower.includes('job') || lower.includes('career') || lower.includes('employ')) {
    return 'Check the "Job Opportunities" section for positions from cooperative sector employers. Express interest in roles that match your skills to notify the employer.';
  }
  if (lower.includes('course') || lower.includes('learn') || lower.includes('module')) {
    return 'Your active courses are under "My Courses". Complete lessons in order, then take the module quiz. Passing all module quizzes earns a course certificate.';
  }
  if (lower.includes('attendance') || lower.includes('qr') || lower.includes('kiosk')) {
    return 'Use the QR scanner or Face Check-in kiosk to mark your session attendance. Make sure you are physically present at the institute for the check-in to succeed.';
  }
  if (lower.includes('pacs') || lower.includes('kcc') || lower.includes('cooperative')) {
    return 'PACS (Primary Agricultural Credit Societies) are the backbone of rural cooperative credit. The PACS Computerization course covers ERP operations, KCC management, and AMCS workflows.';
  }
  return 'I\'m Sahayak, your career and learning assistant for NCCT. Ask me about your courses, certificates, job opportunities, or attendance. How can I help you today?';
};

export const chatController = {
  send: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const userMsg = req.body.message as string;

      // Save user message to DB
      await chatRepository.saveMessage({ userId, role: 'user', content: userMsg });

      // Generate rule-based response
      const responseText = getRuleBasedResponse(userMsg);

      // Save assistant response to DB
      const saved = await chatRepository.saveMessage({ userId, role: 'assistant', content: responseText });

      res.json({ message: responseText, timestamp: saved.timestamp });
    } catch (err) { next(err); }
  },

  history: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await chatRepository.getHistory(req.user!.userId);
      res.json(messages);
    } catch (err) { next(err); }
  },
};
