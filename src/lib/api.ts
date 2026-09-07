/**
 * src/lib/api.ts
 * Lightweight fetch wrapper for the Sahakar Setu Express backend (http://localhost:5000).
 * Automatically attaches the stored JWT Bearer token to every request.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('ss_jwt') || sessionStorage.getItem('ss_jwt');

const setToken = (token: string, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('ss_jwt', token);
    sessionStorage.removeItem('ss_jwt');
  } else {
    sessionStorage.setItem('ss_jwt', token);
    localStorage.removeItem('ss_jwt');
  }
};

export const clearToken = () => {
  localStorage.removeItem('ss_jwt');
  sessionStorage.removeItem('ss_jwt');
};

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T = any>(
  method: string,
  path: string,
  body?: unknown,
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

const get = <T>(path: string, auth = true) => request<T>('GET', path, undefined, auth);
const post = <T>(path: string, body?: unknown, auth = true) => request<T>('POST', path, body, auth);
const patch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body);

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: async (payload: {
      fullName: string;
      email: string;
      password: string;
      role: string;
      phone?: string;
      profileDetails?: Record<string, any>;
      eKycStatus?: string;
    }) => {
      return post<{ user: any; registrationId: string; message: string }>('/api/auth/register', payload, false);
    },
    login: async (identifier: string, password: string, rememberMe = true) => {
      const result = await post<{ token: string; user: any }>(
        '/api/auth/login',
        { identifier, password, rememberMe },
        false
      );
      setToken(result.token, rememberMe);
      return result;
    },
    me: () => get<any>('/api/auth/me'),
    logout: async () => {
      try { await post('/api/auth/logout'); } catch { /* ignore */ }
      clearToken();
    },
  },

  // ─── Courses / Enrollment ──────────────────────────────────────────────────

  courses: {
    list: () => get<any[]>('/api/courses', false),
    get: (id: string) => get<any>(`/api/courses/${id}`),
  },

  trainee: {
    getDashboard: () => get<any>('/api/trainee/dashboard'),
  },

  enrollments: {
    mine: () => get<any[]>('/api/enrollments/my'),
    enroll: (courseId: string) => post<any>('/api/enrollments', { courseId }),
    get: (id: string) => get<any>(`/api/enrollments/${id}`),
    updateProgress: (enrollmentId: string, lessonId: string) =>
      patch<any>(`/api/enrollments/${enrollmentId}/progress`, { lessonId }),
    markLesson: (enrollmentId: string, lessonId: string) =>
      patch<any>(`/api/enrollments/${enrollmentId}/lesson`, { lessonId }),
  },

  // ─── Learning Lifecycle (Normalized Database) ───────────────────────────
  learning: {
    enroll: (courseId: string) => post<any>(`/api/learning/courses/${courseId}/enroll`),
    getCourse: (courseId: string) => get<any>(`/api/learning/courses/${courseId}`),
    completeLesson: (lessonId: string) => post<any>(`/api/learning/lessons/${lessonId}/complete`),
    getQuiz: (quizOrModuleId: string) => get<any>(`/api/learning/quizzes/${quizOrModuleId}`),
    getModuleQuiz: (moduleId: string) => get<any>(`/api/learning/modules/${moduleId}/quiz`),
    submitQuiz: (
      quizId: string,
      answers: Record<string, string> | Array<{ questionId: string; selectedOptionId: string }>
    ) => post<any>(`/api/learning/quizzes/${quizId}/submit`, { answers }),
    verifyCertificate: (token: string) => get<any>(`/api/certificates/verify/${token}`, false),
  },

  // ─── Quizzes ───────────────────────────────────────────────────────────────

  quizzes: {
    get: (quizId: string) => get<any>(`/api/learning/quizzes/${quizId}`),
    submit: (
      quizId: string,
      answers: Record<string, string> | Array<{ questionId: string; selectedOptionId: string }> | number[],
      courseId?: string
    ) =>
      post<any>(`/api/learning/quizzes/${quizId}/submit`, { answers, courseId }),
  },

  // ─── Attendance ────────────────────────────────────────────────────────────

  attendance: {
    sessions: () => get<any[]>('/api/attendance/sessions'),
    mark: (sessionId: string, method: 'qr' | 'face', qrToken?: string) =>
      post<{ success: boolean; message: string; record: any }>(
        '/api/attendance',
        { sessionId, method, qrToken }
      ),
  },

  // ─── Certificates ──────────────────────────────────────────────────────────

  certificates: {
    mine: () => get<any[]>('/api/certificates/me'),
    get: (id: string) => get<any>(`/api/certificates/${id}`, false), // Public — no auth
    verify: (token: string) => get<any>(`/api/certificates/verify/${token}`, false),
  },

  // ─── Jobs ──────────────────────────────────────────────────────────────────

  jobs: {
    list: () => get<any[]>('/api/jobs', false),
    get: (id: string) => get<any>(`/api/jobs/${id}`, false),
    apply: (jobId: string) => post<any>(`/api/jobs/${jobId}/apply`),
    myApplications: () => get<any[]>('/api/jobs/applications/me'),
  },

  // ─── Notifications ─────────────────────────────────────────────────────────

  notifications: {
    mine: () => get<any[]>('/api/notifications/me'),
    markRead: (id: string) => patch(`/api/notifications/${id}/read`),
    markAllRead: () => post('/api/notifications/read-all'),
  },

  // ─── User / Profile ────────────────────────────────────────────────────────

  users: {
    updateMe: (data: Record<string, any>) => patch<any>('/api/users/me', data),
    verifyKyc: (aadhaarNumber: string) => post<any>('/api/users/me/kyc', { aadhaarNumber }),
  },

  // ─── Career Chat ───────────────────────────────────────────────────────────

  chat: {
    send: (message: string) =>
      post<{ message: string; timestamp: string }>('/api/chat', { message }),
    history: () => get<any[]>('/api/chat/history'),
  },

  // ─── NCCT Digital Skill Card ───────────────────────────────────────────────

  skillCard: {
    getMyCard: () => get<any>('/api/trainees/me/skill-card'),
    regenerateToken: () => post<any>('/api/trainees/me/skill-card/regenerate'),
    getPublicCard: (token: string) => get<any>(`/api/public/skill-card/${token}`, false),
    contactTrainee: (token: string, data: any) =>
      post<any>(`/api/public/skill-card/${token}/contact`, data, false),
  },
};

export default api;
