import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import enrollmentRoutes from './routes/enrollments';
import quizRoutes from './routes/quizzes';
import attendanceRoutes from './routes/attendance';
import certificateRoutes from './routes/certificates';
import jobRoutes from './routes/jobs';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';
import chatRoutes from './routes/chat';
import learningRoutes from './routes/learning';
import skillCardRoutes from './routes/skillCard';
import traineeRoutes from './routes/trainee';

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',   // vite dev
    'http://localhost:4173',   // vite preview
    'http://localhost:5173',   // vite alt port
  ],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Sahakar Setu API', ts: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/trainee', traineeRoutes);
app.use('/api', skillCardRoutes);

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 Sahakar Setu API running → http://localhost:${PORT}\n`);
});
