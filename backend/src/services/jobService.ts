import { jobRepository } from '../repositories/jobRepository';
import { userRepository } from '../repositories/userRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { createError } from '../middleware/errorHandler';

export const jobService = {
  getAllJobs: () => jobRepository.findAll(),

  getJobById: async (id: string) => {
    const job = await jobRepository.findById(id);
    if (!job) throw createError(404, 'Job posting not found');
    return job;
  },

  applyForJob: async (userId: string, jobPostingId: string) => {
    const job = await jobRepository.findById(jobPostingId);
    if (!job) throw createError(404, 'Job posting not found');

    // Idempotent — return existing interest if already applied
    const existing = await jobRepository.findInterestByUserAndJob(userId, jobPostingId);
    if (existing) return { alreadyApplied: true, interest: existing };

    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, 'User not found');

    const interest = await jobRepository.createInterest({
      id: `ji-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobPostingId,
      userId,
      traineeName: user.name,
      traineeEmail: user.email,
      traineeSkills: ['PACS Digitalization', 'KCC Management', 'AMCS Operations'],
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });

    // In-app notification
    await notificationRepository.create({
      id: `notif-job-${interest.id}`,
      userId,
      title: 'Application Submitted 📋',
      message: `Your interest in "${job.title}" at ${job.employerName} has been recorded.`,
      timestamp: new Date().toISOString(),
      type: 'job',
      linkView: 'my_applications',
    });

    return { alreadyApplied: false, interest };
  },

  getMyApplications: (userId: string) => jobRepository.findInterestsByUser(userId),
};
