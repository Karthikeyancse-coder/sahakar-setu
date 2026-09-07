/**
 * src/lib/api.ts
 * Lightweight fetch wrapper for the Sahakar Setu Express backend.
 * Automatically attaches the stored JWT Bearer token to every request.
 * Environment-aware API client:
 *  - In Localhost / LAN: Uses relative '/api/...' routed through Vite's dev server proxy to localhost:5000.
 *  - In Production (Vercel): Uses VITE_API_URL pointing to the deployed backend.
 */

function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl || envUrl === '/api') {
    // Relative path routed through Vite dev proxy (Localhost & LAN)
    return '';
  }
  // Production / external backend URL: strip trailing '/api' or '/'
  // because endpoint paths below explicitly start with '/api/...'
  return envUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
}

const BASE_URL = getApiBaseUrl();

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
const put = <T>(path: string, body?: unknown) => request<T>('PUT', path, body);
const del = <T>(path: string) => request<T>('DELETE', path);

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
    saveLessonProgress: (
      lessonId: string,
      data: { progressSeconds: number; progressPercent: number; completed?: boolean }
    ) => post<any>(`/api/learning/lessons/${lessonId}/progress`, data),
    getLessonProgress: (lessonId: string) =>
      get<any>(`/api/learning/lessons/${lessonId}/progress`),
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
    createSession: (data: {
      title: string;
      programmeId?: string;
      courseId?: string;
      instructor?: string;
      date?: string;
      timeSlot?: string;
      room?: string;
    }) => post<any>('/api/attendance/sessions', data),
    activateSession: (sessionId: string, active?: boolean) =>
      patch<any>(`/api/attendance/sessions/${sessionId}/activate`, { active }),
  },

  // ─── Certificates ──────────────────────────────────────────────────────────

  certificates: {
    mine: () => get<any[]>('/api/certificates/me'),
    get: (id: string) => get<any>(`/api/certificates/${id}`, false), // Public — no auth
    verify: (token: string) => get<any>(`/api/certificates/verify/${token}`, false),
  },

  // ─── Jobs ──────────────────────────────────────────────────────────────────

  jobs: {
    list: () => get<any[]>('/api/jobs'),
    get: (id: string) => get<any>(`/api/jobs/${id}`),
    getMatch: (jobId: string) => get<any>(`/api/jobs/${jobId}/match`),
    apply: (jobId: string) => post<any>(`/api/jobs/${jobId}/apply`),
    myApplications: () => get<any[]>('/api/jobs/applications/me'),
    recruiterCandidates: () => get<any[]>('/api/jobs/recruiter/candidates'),
    updateStatus: (id: string, status: string) =>
      patch<any>(`/api/jobs/applications/${id}/status`, { status }),
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

  // ─── Faculty ───────────────────────────────────────────────────────────────

  faculty: {
    getDashboard: () => get<any>('/api/faculty/dashboard'),
    getCourses: () => get<any[]>('/api/faculty/courses'),
    getCourseRoster: (courseId: string) => get<any[]>(`/api/faculty/courses/${courseId}/roster`),
  },

  // ─── Curriculum Management (Persistent Database) ───────────────────────────

  curriculum: {
    getCurriculum: (courseId: string) => get<any>(`/api/courses/${courseId}/curriculum`),
    createModule: (courseId: string, data: any) => post<any>(`/api/courses/${courseId}/modules`, data),
    updateModule: (moduleId: string, data: any, courseId?: string) =>
      patch<any>(courseId ? `/api/courses/${courseId}/modules/${moduleId}` : `/api/modules/${moduleId}`, data),
    deleteModule: (moduleId: string, courseId?: string) =>
      del<any>(courseId ? `/api/courses/${courseId}/modules/${moduleId}` : `/api/modules/${moduleId}`),
    reorderModules: (courseId: string, moduleIds: string[]) =>
      put<any>(`/api/courses/${courseId}/modules/reorder`, { moduleIds }),
    getLesson: async (lessonId: string, moduleId?: string) => {
      const res = await get<any>(moduleId ? `/api/modules/${moduleId}/lessons/${lessonId}` : `/api/lessons/${lessonId}`);
      return res.lesson || res;
    },
    createLesson: async (moduleId: string, data: any) => {
      const res = await post<any>(`/api/modules/${moduleId}/lessons`, data);
      return res.lesson || res;
    },
    updateLesson: async (lessonId: string, data: any, moduleId?: string) => {
      const res = await patch<any>(moduleId ? `/api/modules/${moduleId}/lessons/${lessonId}` : `/api/lessons/${lessonId}`, data);
      return res.lesson || res;
    },
    deleteLesson: (lessonId: string, moduleId?: string) =>
      del<any>(moduleId ? `/api/modules/${moduleId}/lessons/${lessonId}` : `/api/lessons/${lessonId}`),
    reorderLessons: (moduleId: string, lessonIds: string[]) =>
      put<any>(`/api/modules/${moduleId}/lessons/reorder`, { lessonIds }),
    saveQuiz: (moduleId: string, quizData: any) =>
      post<any>(`/api/modules/${moduleId}/quiz`, quizData),
    deleteQuiz: (quizId: string, moduleId?: string) =>
      del<any>(moduleId ? `/api/modules/${moduleId}/quiz/${quizId}` : `/api/quizzes/${quizId}`),
    createCourse: (data: any) => post<any>('/api/courses', data),
    updateCourse: (courseId: string, data: any) => put<any>(`/api/courses/${courseId}`, data),
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
