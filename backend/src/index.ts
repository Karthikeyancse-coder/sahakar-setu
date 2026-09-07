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
import facultyRoutes from './routes/faculty';
import { learningController } from './controllers/learningController';
import { requireAuth } from './middleware/auth';

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://10.186.186.107:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://10.186.186.107:4173',
  'http://localhost:5173',
  'https://sahakar-setu-self.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, curl, Postman, Vite proxy)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDeploy = origin.endsWith('.vercel.app');
    const isLanOrLocalhost = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}):\d+$/.test(origin);

    if (isExplicitlyAllowed || isVercelDeploy || isLanOrLocalhost) {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
app.post('/api/lessons/:lessonId/progress', requireAuth, learningController.saveProgress);
app.get('/api/lessons/:lessonId/progress', requireAuth, learningController.getProgress);
app.use('/api/trainee', traineeRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api', skillCardRoutes);

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`\n🌿 Sahakar Setu API running → http://${HOST}:${PORT}\n`);
});
