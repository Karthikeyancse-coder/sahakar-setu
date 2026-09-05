import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Language,
  Institute,
  Programme,
  Course,
  Enrollment,
  Session,
  AttendanceRecord,
  Certificate,
  JobPosting,
  JobInterest,
  HostelBed,
  TimetableEntry,
  Nomination,
  AppNotification,
} from '../types';
import {
  SEED_INSTITUTES,
  SEED_USERS,
  SEED_COURSES,
  SEED_PROGRAMMES,
  SEED_ENROLLMENTS,
  SEED_CERTIFICATES,
  SEED_SESSIONS,
  SEED_ATTENDANCE,
  SEED_NOMINATIONS,
  SEED_JOBS,
  SEED_HOSTEL_BEDS,
  SEED_TIMETABLE,
  SEED_NOTIFICATIONS,
} from '../data/seedData';
import { getTranslation } from '../locales';

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  currentLanguage: Language;
  t: ReturnType<typeof getTranslation>;
  institutes: Institute[];
  programmes: Programme[];
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  nominations: Nomination[];
  jobs: JobPosting[];
  jobInterests: JobInterest[];
  hostelBeds: HostelBed[];
  timetable: TimetableEntry[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  isOffline: boolean;
  offlineQueueCount: number;
  activeView: string;
  activeViewParams: any;

  // Actions
  switchUser: (userId: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  navigate: (view: string, params?: any) => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  submitQuiz: (courseId: string, quizId: string, scorePercent: number) => { passed: boolean; certId?: string };
  markAttendance: (sessionId: string, method: 'qr' | 'face', targetUserId?: string, confidence?: number) => { success: boolean; message: string };
  updateNominationStatus: (nominationId: string, status: 'approved' | 'rejected') => void;
  bulkUpdateNominationStatus: (nominationIds: string[], status: 'approved' | 'rejected') => void;
  bulkImportNominations: (programmeId: string, records: Array<{ name: string; email: string; coop: string }>) => number;
  applyForJob: (jobId: string) => boolean;
  createJobPosting: (job: Omit<JobPosting, 'id' | 'postedDate'>) => void;
  updateHostelBed: (bedId: string, updates: Partial<HostelBed>) => void;
  verifyEkyc: (aadhaarNumber: string) => void;
  toggleOfflineMode: () => void;
  addNewCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  clearReadNotifications: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => User;
  toggleUserStatus: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ROLE_PREFIXES: Record<UserRole, string> = {
  trainee: '/trainee',
  institute_admin: '/institute-admin',
  super_admin: '/super-admin',
  faculty: '/faculty',
  employer: '/employer',
};

export const getRolePrefix = (role?: UserRole): string => {
  if (!role) return '/trainee';
  return ROLE_PREFIXES[role] || '/trainee';
};

export const getRoleFromPrefix = (path: string): UserRole | null => {
  if (path.startsWith('/trainee')) return 'trainee';
  if (path.startsWith('/institute-admin')) return 'institute_admin';
  if (path.startsWith('/super-admin')) return 'super_admin';
  if (path.startsWith('/faculty')) return 'faculty';
  if (path.startsWith('/employer')) return 'employer';
  return null;
};

// Clean path resolution without hash routing + Role-based namespaced route guarding
const resolveRoute = (isAuth: boolean, userRole?: UserRole): { view: string; params: any } => {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // Immediately clean up any legacy hash in URL
  if (hash) {
    const lowerHash = hash.toLowerCase();
    if (lowerHash.startsWith('#/verify/')) {
      const certId = hash.replace(/^#\/verify\//i, '');
      window.history.replaceState({}, '', `/verify/${certId}`);
      return { view: 'verify_public', params: { certId } };
    }
    if (lowerHash === '#/signup' || lowerHash === '#/register' || lowerHash === '#signup' || lowerHash === '#register') {
      window.history.replaceState({}, '', '/register');
      return { view: 'signup', params: null };
    }
    if (lowerHash === '#/forgot-password' || lowerHash === '#forgot-password') {
      window.history.replaceState({}, '', '/forgot-password');
      return { view: 'forgot_password', params: null };
    }
    if (lowerHash === '#/dashboard' || lowerHash === '#dashboard' || lowerHash === '#/home' || lowerHash === '#home') {
      if (isAuth) {
        const dest = `${getRolePrefix(userRole)}/dashboard`;
        window.history.replaceState({}, '', dest);
        return { view: 'home', params: null };
      } else {
        window.history.replaceState({}, '', '/');
        return { view: 'login', params: null };
      }
    }
    // Clean up any other hash to root '/'
    window.history.replaceState({}, '', '/');
    return { view: 'login', params: null };
  }

  // Pure HTML5 pathname routing - Public unauthenticated routes
  if (path.startsWith('/verify/')) {
    const certId = path.replace(/^\/verify\//, '');
    return { view: 'verify_public', params: { certId } };
  }
  if (path === '/register' || path === '/signup') {
    if (path !== '/register') {
      window.history.replaceState({}, '', '/register');
    }
    return { view: 'signup', params: null };
  }
  if (path === '/forgot-password') {
    return { view: 'forgot_password', params: null };
  }

  // Protected route gate
  if (!isAuth) {
    if (path !== '/' && path !== '/login') {
      window.history.replaceState({}, '', '/');
    }
    return { view: 'login', params: null };
  }

  const role = userRole || 'trainee';
  const rolePrefix = getRolePrefix(role);

  // ROUTE GUARD: Check if user is attempting to access a role namespace outside their role
  const pathRole = getRoleFromPrefix(path);
  if (pathRole && pathRole !== role) {
    const fallbackPath = `${rolePrefix}/dashboard`;
    window.history.replaceState({}, '', fallbackPath);
    return { view: 'home', params: null };
  }

  // Root or generic dashboard redirects for authenticated users
  if (path === '/' || path === '/dashboard' || path === '/home') {
    const target = `${rolePrefix}/dashboard`;
    window.history.replaceState({}, '', target);
    return { view: 'home', params: null };
  }

  // Legacy flat routes redirection into user's role namespace
  if (path === '/settings' || path === '/dashboard/settings') {
    window.history.replaceState({}, '', `${rolePrefix}/settings`);
    return { view: 'settings', params: null };
  }

  // 1. TRAINEE ROUTES (/trainee/...)
  if (path === '/trainee/dashboard' || path === '/trainee') {
    return { view: 'home', params: null };
  }
  if (path === '/trainee/courses' || path === '/courses') {
    if (path !== '/trainee/courses') window.history.replaceState({}, '', '/trainee/courses');
    return { view: 'courses', params: null };
  }
  const courseLearnMatch = path.match(/^\/(?:trainee\/)?courses\/([^/]+)\/learn/);
  if (courseLearnMatch) {
    return { view: 'course_player', params: { courseId: courseLearnMatch[1] } };
  }
  const courseQuizMatch = path.match(/^\/(?:trainee\/)?courses\/([^/]+)\/quiz(?:\/([^/]+))?/);
  if (courseQuizMatch) {
    return { view: 'quiz', params: { courseId: courseQuizMatch[1], moduleId: courseQuizMatch[2] } };
  }
  const courseDetailMatch = path.match(/^\/(?:trainee\/)?courses\/([^/]+)$/);
  if (courseDetailMatch) {
    return { view: 'course_detail', params: { courseId: courseDetailMatch[1] } };
  }
  if (path === '/trainee/my-courses' || path === '/my-courses') {
    if (path !== '/trainee/my-courses') window.history.replaceState({}, '', '/trainee/my-courses');
    return { view: 'my_courses', params: null };
  }
  const certDetailMatch = path.match(/^\/trainee\/certificates\/([^/]+)$/);
  if (certDetailMatch) {
    return { view: 'certificates', params: { certId: certDetailMatch[1] } };
  }
  if (path === '/trainee/certificates' || path === '/certificates') {
    if (path !== '/trainee/certificates') window.history.replaceState({}, '', '/trainee/certificates');
    return { view: 'certificates', params: null };
  }
  const jobDetailMatch = path.match(/^\/(?:trainee\/)?jobs\/([^/]+)$/);
  if (jobDetailMatch) {
    return { view: 'job_detail', params: { jobId: jobDetailMatch[1] } };
  }
  if (path === '/trainee/jobs' || path === '/jobs') {
    if (path !== '/trainee/jobs') window.history.replaceState({}, '', '/trainee/jobs');
    return { view: 'jobs', params: null };
  }
  if (path === '/trainee/my-applications' || path === '/my-applications') {
    if (path !== '/trainee/my-applications') window.history.replaceState({}, '', '/trainee/my-applications');
    return { view: 'my_applications', params: null };
  }
  if (path === '/trainee/career-chat' || path === '/career-chat') {
    if (path !== '/trainee/career-chat') window.history.replaceState({}, '', '/trainee/career-chat');
    return { view: 'career_chat', params: null };
  }
  if (path === '/trainee/attendance' || path === '/attendance') {
    if (path !== '/trainee/attendance') window.history.replaceState({}, '', '/trainee/attendance');
    return { view: 'attendance_kiosk', params: null };
  }
  if (path === '/trainee/profile' || path === '/profile') {
    if (path !== '/trainee/profile') window.history.replaceState({}, '', '/trainee/profile');
    return { view: 'profile', params: null };
  }
  if (path === '/trainee/settings') {
    return { view: 'settings', params: null };
  }
  if (path === '/trainee/help' || path === '/help') {
    if (path !== '/trainee/help') window.history.replaceState({}, '', '/trainee/help');
    return { view: 'help', params: null };
  }

  // 2. INSTITUTE ADMIN ROUTES (/institute-admin/...)
  if (path === '/institute-admin/dashboard' || path === '/institute-admin' || path === '/dashboard/admin') {
    if (path !== '/institute-admin/dashboard') window.history.replaceState({}, '', '/institute-admin/dashboard');
    return { view: 'home', params: null };
  }
  if (path === '/institute-admin/programmes' || path === '/dashboard/admin/programmes') {
    if (path !== '/institute-admin/programmes') window.history.replaceState({}, '', '/institute-admin/programmes');
    return { view: 'programmes_erp', params: null };
  }
  if (path === '/institute-admin/nominations' || path === '/dashboard/admin/nominations') {
    if (path !== '/institute-admin/nominations') window.history.replaceState({}, '', '/institute-admin/nominations');
    return { view: 'nominations', params: null };
  }
  if (path === '/institute-admin/trainees' || path === '/dashboard/admin/trainees') {
    if (path !== '/institute-admin/trainees') window.history.replaceState({}, '', '/institute-admin/trainees');
    return { view: 'trainee_directory', params: null };
  }
  if (path === '/institute-admin/sessions' || path === '/institute-admin/attendance' || path === '/dashboard/admin/attendance') {
    if (path !== '/institute-admin/sessions') window.history.replaceState({}, '', '/institute-admin/sessions');
    return { view: 'attendance_kiosk', params: null };
  }
  if (path === '/institute-admin/hostel' || path === '/dashboard/admin/hostel') {
    if (path !== '/institute-admin/hostel') window.history.replaceState({}, '', '/institute-admin/hostel');
    return { view: 'hostel_timetable', params: null };
  }
  if (path === '/institute-admin/timetable' || path === '/dashboard/admin/timetable') {
    if (path !== '/institute-admin/timetable') window.history.replaceState({}, '', '/institute-admin/timetable');
    return { view: 'timetable', params: null };
  }
  if (path === '/institute-admin/analytics' || path === '/dashboard/admin/analytics') {
    if (path !== '/institute-admin/analytics') window.history.replaceState({}, '', '/institute-admin/analytics');
    return { view: 'analytics', params: null };
  }
  if (path === '/institute-admin/settings') {
    return { view: 'settings', params: null };
  }
  if (path === '/institute-admin/profile' || path === '/dashboard/admin/profile') {
    if (path !== '/institute-admin/profile') window.history.replaceState({}, '', '/institute-admin/profile');
    return { view: 'profile', params: null };
  }

  // 3. SUPER ADMIN ROUTES (/super-admin/...)
  if (path === '/super-admin/dashboard' || path === '/super-admin' || path === '/dashboard/super-admin') {
    if (path !== '/super-admin/dashboard') window.history.replaceState({}, '', '/super-admin/dashboard');
    return { view: 'home', params: null };
  }
  if (path === '/super-admin/analytics' || path === '/dashboard/super-admin/analytics') {
    if (path !== '/super-admin/analytics') window.history.replaceState({}, '', '/super-admin/analytics');
    return { view: 'analytics', params: null };
  }
  const instituteDetailMatch = path.match(/^\/super-admin\/institutes\/([^/]+)$/);
  if (instituteDetailMatch) {
    return { view: 'institute_detail', params: { instituteId: instituteDetailMatch[1] } };
  }
  if (path === '/super-admin/institutes' || path === '/dashboard/super-admin/institutes') {
    if (path !== '/super-admin/institutes') window.history.replaceState({}, '', '/super-admin/institutes');
    return { view: 'institutes_directory', params: null };
  }
  if (path === '/super-admin/users' || path === '/dashboard/super-admin/users') {
    if (path !== '/super-admin/users') window.history.replaceState({}, '', '/super-admin/users');
    return { view: 'users', params: null };
  }
  if (path === '/super-admin/settings') {
    return { view: 'settings', params: null };
  }
  if (path === '/super-admin/profile' || path === '/dashboard/super-admin/profile') {
    if (path !== '/super-admin/profile') window.history.replaceState({}, '', '/super-admin/profile');
    return { view: 'profile', params: null };
  }

  // 4. FACULTY ROUTES (/faculty/...)
  if (path === '/faculty/dashboard' || path === '/faculty' || path === '/dashboard/faculty') {
    if (path !== '/faculty/dashboard') window.history.replaceState({}, '', '/faculty/dashboard');
    return { view: 'home', params: null };
  }
  if (path === '/faculty/courses/new') {
    return { view: 'course_new', params: null };
  }
  if (path === '/faculty/courses' || path === '/dashboard/faculty/courses') {
    if (path !== '/faculty/courses') window.history.replaceState({}, '', '/faculty/courses');
    return { view: 'courses', params: null };
  }
  const facultyEditCourseMatch = path.match(/^\/faculty\/courses\/([^/]+)\/edit-course/);
  if (facultyEditCourseMatch) {
    return { view: 'course_new', params: { editCourseId: facultyEditCourseMatch[1] } };
  }
  const facultyEditMatch = path.match(/^\/faculty\/courses\/([^/]+)\/edit/);
  if (facultyEditMatch) {
    return { view: 'course_builder', params: { courseId: facultyEditMatch[1] } };
  }
  if (path === '/faculty/settings') {
    return { view: 'settings', params: null };
  }
  if (path === '/faculty/profile') {
    return { view: 'profile', params: null };
  }

  // 5. EMPLOYER ROUTES (/employer/...)
  if (path === '/employer/dashboard' || path === '/employer' || path === '/dashboard/employer') {
    if (path !== '/employer/dashboard') window.history.replaceState({}, '', '/employer/dashboard');
    return { view: 'home', params: null };
  }
  if (path === '/employer/candidates' || path === '/dashboard/employer/candidates') {
    if (path !== '/employer/candidates') window.history.replaceState({}, '', '/employer/candidates');
    return { view: 'trainee_directory', params: null };
  }
  if (path === '/employer/jobs/new') {
    return { view: 'jobs_new', params: null };
  }
  if (path === '/employer/jobs' || path === '/dashboard/employer/jobs') {
    if (path !== '/employer/jobs') window.history.replaceState({}, '', '/employer/jobs');
    return { view: 'jobs', params: null };
  }

  // Fallback to role dashboard
  const fallback = `${rolePrefix}/dashboard`;
  window.history.replaceState({}, '', fallback);
  return { view: 'home', params: null };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence / Initial State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ss_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return SEED_USERS[0]; // Rameshwar Patil (Trainee)
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ss_auth') === 'true';
  });

  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ss_lang');
    return (saved as Language) || 'en';
  });

  // Resolve initial view based on current browser URL and authenticated user role
  const initialRoute = resolveRoute(localStorage.getItem('ss_auth') === 'true', currentUser.role);
  const [activeView, setActiveView] = useState<string>(initialRoute.view);
  const [activeViewParams, setActiveViewParams] = useState<any>(initialRoute.params);

  const [institutes] = useState<Institute[]>(SEED_INSTITUTES);
  const [programmes, setProgrammes] = useState<Programme[]>(SEED_PROGRAMMES);
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ss_courses_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_COURSES;
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>(SEED_ENROLLMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(SEED_CERTIFICATES);
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [nominations, setNominations] = useState<Nomination[]>(SEED_NOMINATIONS);
  const [jobs, setJobs] = useState<JobPosting[]>(SEED_JOBS);
  const [jobInterests, setJobInterests] = useState<JobInterest[]>([]);
  const [hostelBeds, setHostelBeds] = useState<HostelBed[]>(SEED_HOSTEL_BEDS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(SEED_TIMETABLE);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ss_users_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return SEED_USERS.map(u => ({ ...u, status: u.status || 'active' }));
  });

  const addUser = (newUser: Omit<User, 'id'>) => {
    const created: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      status: newUser.status || 'active',
      isKycVerified: true,
      avatarUrl: newUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers(prev => {
      const next = [created, ...prev];
      localStorage.setItem('ss_users_list', JSON.stringify(next));
      return next;
    });
    return created;
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          const currentStatus = u.status || 'active';
          return { ...u, status: (currentStatus === 'active' ? 'deactivated' : 'active') as 'active' | 'deactivated' };
        }
        return u;
      });
      localStorage.setItem('ss_users_list', JSON.stringify(next));
      return next;
    });
  };
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ss_notifs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return SEED_NOTIFICATIONS;
  });

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('ss_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('ss_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const clearReadNotifications = () => {
    setNotifications(prev => {
      const updated = prev.filter(n => !n.isRead);
      localStorage.setItem('ss_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserProfile = (updates: Partial<User>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('ss_user', JSON.stringify(updated));
    if (updates.languagePreference && updates.languagePreference !== currentLanguage) {
      setLanguage(updates.languagePreference);
    }
  };

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Online / offline detector
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        setOfflineQueueCount(0);
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueueCount]);

  // Handle URL navigation for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const isAuth = localStorage.getItem('ss_auth') === 'true';
      const route = resolveRoute(isAuth, currentUser.role);
      setActiveView(route.view);
      setActiveViewParams(route.params);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser.role]);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ss_auth');
    setActiveView('login');
    setActiveViewParams(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchUser = (userId: string) => {
    const target = SEED_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      localStorage.setItem('ss_auth', 'true');
      localStorage.setItem('ss_user', JSON.stringify(target));
      if (target.languagePreference) {
        setCurrentLanguageState(target.languagePreference);
        localStorage.setItem('ss_lang', target.languagePreference);
      }
      setActiveView('home');
      setActiveViewParams(null);
      const targetPath = `${getRolePrefix(target.role)}/dashboard`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('ss_lang', lang);
  };

  const navigate = (destination: string, params?: any) => {
    if (destination === 'login' || destination === '/' || destination === 'logout') {
      logout();
      return;
    }

    if (destination === 'signup' || destination === 'register' || destination === '/register') {
      setActiveView('signup');
      setActiveViewParams(null);
      window.history.pushState({}, '', '/register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'forgot_password' || destination === '/forgot-password') {
      setActiveView('forgot_password');
      setActiveViewParams(null);
      window.history.pushState({}, '', '/forgot-password');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'verify_public' || destination.startsWith('/verify/')) {
      const certId = params?.certId || (destination.startsWith('/verify/') ? destination.replace(/^\/verify\//, '') : 'NCCT-CERT-2026-VAM-0089');
      setActiveView('verify_public');
      setActiveViewParams({ certId });
      window.history.pushState({}, '', `/verify/${certId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isAuth = localStorage.getItem('ss_auth') === 'true' || isAuthenticated;
    if (!isAuth) {
      logout();
      return;
    }

    // Direct path support (e.g. '/institute-admin/nominations', '/trainee/courses')
    if (destination.startsWith('/')) {
      const targetRole = getRoleFromPrefix(destination);
      if (targetRole && targetRole !== currentUser.role) {
        // Guard check: mismatch between target path and current role
        const guardedPath = `${getRolePrefix(currentUser.role)}/dashboard`;
        window.history.pushState({}, '', guardedPath);
        const resolved = resolveRoute(true, currentUser.role);
        setActiveView(resolved.view);
        setActiveViewParams(resolved.params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      window.history.pushState({}, '', destination);
      const resolved = resolveRoute(true, currentUser.role);
      setActiveView(resolved.view);
      setActiveViewParams(params || resolved.params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Destination is a canonical view ID: map to role-namespaced URL
    let targetPath = `${getRolePrefix(currentUser.role)}/dashboard`;
    let targetView = destination;

    if (currentUser.role === 'institute_admin') {
      if (destination === 'home' || destination === 'dashboard') {
        targetPath = '/institute-admin/dashboard';
        targetView = 'home';
      } else if (destination === 'programmes_erp' || destination === 'programmes') {
        targetPath = '/institute-admin/programmes';
        targetView = 'programmes_erp';
      } else if (destination === 'nominations') {
        targetPath = '/institute-admin/nominations';
        targetView = 'nominations';
      } else if (destination === 'trainee_directory' || destination === 'trainees') {
        targetPath = '/institute-admin/trainees';
        targetView = 'trainee_directory';
      } else if (destination === 'attendance_kiosk' || destination === 'attendance' || destination === 'sessions') {
        targetPath = '/institute-admin/sessions';
        targetView = 'attendance_kiosk';
      } else if (destination === 'hostel_timetable' || destination === 'hostel') {
        targetPath = '/institute-admin/hostel';
        targetView = 'hostel_timetable';
      } else if (destination === 'timetable') {
        targetPath = '/institute-admin/timetable';
        targetView = 'timetable';
      } else if (destination === 'analytics') {
        targetPath = '/institute-admin/analytics';
        targetView = 'analytics';
      } else if (destination === 'settings') {
        targetPath = '/institute-admin/settings';
        targetView = 'settings';
      } else if (destination === 'profile') {
        targetPath = '/institute-admin/profile';
        targetView = 'profile';
      } else {
        targetPath = '/institute-admin/dashboard';
        targetView = 'home';
      }
    } else if (currentUser.role === 'trainee') {
      if (destination === 'home' || destination === 'dashboard') {
        targetPath = '/trainee/dashboard';
        targetView = 'home';
      } else if (destination === 'courses') {
        targetPath = '/trainee/courses';
        targetView = 'courses';
      } else if (destination === 'course_detail') {
        targetPath = `/trainee/courses/${params?.courseId || ''}`;
        targetView = 'course_detail';
      } else if (destination === 'course_player' || destination === 'course_view') {
        targetPath = `/trainee/courses/${params?.courseId || ''}/learn`;
        targetView = 'course_player';
      } else if (destination === 'quiz') {
        targetPath = `/trainee/courses/${params?.courseId || ''}/quiz/${params?.moduleId || ''}`;
        targetView = 'quiz';
      } else if (destination === 'my_courses') {
        targetPath = '/trainee/my-courses';
        targetView = 'my_courses';
      } else if (destination === 'certificates') {
        targetPath = `/trainee/certificates${params?.certId ? `/${params.certId}` : ''}`;
        targetView = 'certificates';
      } else if (destination === 'jobs') {
        targetPath = '/trainee/jobs';
        targetView = 'jobs';
      } else if (destination === 'job_detail') {
        targetPath = `/trainee/jobs/${params?.jobId || ''}`;
        targetView = 'job_detail';
      } else if (destination === 'my_applications') {
        targetPath = '/trainee/my-applications';
        targetView = 'my_applications';
      } else if (destination === 'career_chat' || destination === 'career_bot') {
        targetPath = '/trainee/career-chat';
        targetView = 'career_chat';
      } else if (destination === 'attendance' || destination === 'attendance_kiosk') {
        targetPath = '/trainee/attendance';
        targetView = 'attendance_kiosk';
      } else if (destination === 'profile') {
        targetPath = '/trainee/profile';
        targetView = 'profile';
      } else if (destination === 'settings') {
        targetPath = '/trainee/settings';
        targetView = 'settings';
      } else if (destination === 'help') {
        targetPath = '/trainee/help';
        targetView = 'help';
      } else {
        targetPath = '/trainee/dashboard';
        targetView = 'home';
      }
    } else if (currentUser.role === 'super_admin') {
      if (destination === 'home' || destination === 'dashboard') {
        targetPath = '/super-admin/dashboard';
        targetView = 'home';
      } else if (destination === 'analytics') {
        targetPath = '/super-admin/analytics';
        targetView = 'analytics';
      } else if (destination === 'institutes_directory' || destination === 'institutes') {
        targetPath = '/super-admin/institutes';
        targetView = 'institutes_directory';
      } else if (destination === 'institute_detail') {
        targetPath = `/super-admin/institutes/${params?.instituteId || ''}`;
        targetView = 'institute_detail';
      } else if (destination === 'users') {
        targetPath = '/super-admin/users';
        targetView = 'users';
      } else if (destination === 'settings') {
        targetPath = '/super-admin/settings';
        targetView = 'settings';
      } else if (destination === 'profile') {
        targetPath = '/super-admin/profile';
        targetView = 'profile';
      } else {
        targetPath = '/super-admin/dashboard';
        targetView = 'home';
      }
    } else if (currentUser.role === 'faculty') {
      if (destination === 'home' || destination === 'dashboard') {
        targetPath = '/faculty/dashboard';
        targetView = 'home';
      } else if (destination === 'courses/new' || destination === 'course_new' || destination === '/faculty/courses/new') {
        targetPath = '/faculty/courses/new';
        targetView = 'course_new';
      } else if (destination === 'courses') {
        targetPath = '/faculty/courses';
        targetView = 'courses';
      } else if (destination === 'course_builder' || destination === 'edit') {
        targetPath = `/faculty/courses/${params?.courseId || 'crs-pacs-erp-101'}/edit`;
        targetView = 'course_builder';
      } else if (destination === 'settings') {
        targetPath = '/faculty/settings';
        targetView = 'settings';
      } else {
        targetPath = '/faculty/dashboard';
        targetView = 'home';
      }
    } else if (currentUser.role === 'employer') {
      if (destination === 'home' || destination === 'dashboard') {
        targetPath = '/employer/dashboard';
        targetView = 'home';
      } else if (destination === 'trainee_directory' || destination === 'candidates') {
        targetPath = '/employer/candidates';
        targetView = 'trainee_directory';
      } else if (destination === 'jobs_new') {
        targetPath = '/employer/jobs/new';
        targetView = 'jobs_new';
      } else if (destination === 'jobs') {
        targetPath = '/employer/jobs';
        targetView = 'jobs';
      } else {
        targetPath = '/employer/dashboard';
        targetView = 'home';
      }
    }

    setActiveView(targetView);
    setActiveViewParams(params || null);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enrollInCourse = (courseId: string) => {
    const existing = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!existing) {
      const newEnrollment: Enrollment = {
        id: `enr-${Date.now()}`,
        userId: currentUser.id,
        courseId,
        progressPercent: 0,
        completedLessonIds: [],
        completedQuizIds: [],
        status: 'in_progress',
        enrolledDate: new Date().toISOString().split('T')[0],
      };
      setEnrollments(prev => [newEnrollment, ...prev]);
    }
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setEnrollments(prev => {
      return prev.map(e => {
        if (e.userId === currentUser.id && e.courseId === courseId) {
          if (!e.completedLessonIds.includes(lessonId)) {
            const updatedLessons = [...e.completedLessonIds, lessonId];
            const course = courses.find(c => c.id === courseId);
            const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
            const progress = Math.min(100, Math.round((updatedLessons.length / totalLessons) * 100));

            return {
              ...e,
              completedLessonIds: updatedLessons,
              progressPercent: progress,
              lastAccessedLessonId: lessonId,
            };
          }
        }
        return e;
      });
    });

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }
  };

  const submitQuiz = (courseId: string, quizId: string, scorePercent: number) => {
    const course = courses.find(c => c.id === courseId);
    const module = course?.modules.find(m => m.quiz?.id === quizId);
    const passThreshold = module?.quiz?.passThreshold || 70;
    const passed = scorePercent >= passThreshold;

    if (passed) {
      let newlyCompleted = false;
      setEnrollments(prev => {
        return prev.map(e => {
          if (e.userId === currentUser.id && e.courseId === courseId) {
            const updatedQuizIds = Array.from(new Set([...e.completedQuizIds, quizId]));
            const totalQuizzes = course?.modules.filter(m => m.quiz).length || 1;
            const isAllCompleted = updatedQuizIds.length >= totalQuizzes;
            if (isAllCompleted && e.status !== 'completed') {
              newlyCompleted = true;
            }
            return {
              ...e,
              completedQuizIds: updatedQuizIds,
              progressPercent: isAllCompleted ? 100 : e.progressPercent,
              status: isAllCompleted ? 'completed' : e.status,
              completionDate: isAllCompleted ? new Date().toISOString().split('T')[0] : e.completionDate,
            };
          }
          return e;
        });
      });

      // Issue Certificate if not already present
      const existingCert = certificates.find(c => c.userId === currentUser.id && c.courseId === courseId);
      if (!existingCert && course) {
        const inst = institutes.find(i => i.id === course.instituteId) || institutes[0];
        const newCertId = `NCCT-CERT-${new Date().getFullYear()}-${inst.type}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newCert: Certificate = {
          id: newCertId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAadhaarMock: currentUser.aadhaarMock || 'XXXX-XXXX-8821',
          courseId,
          courseTitle: course.title,
          courseTitleHi: course.titleHi,
          instituteId: inst.id,
          instituteName: inst.name,
          issuedDate: new Date().toISOString().split('T')[0],
          certificateHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          qrCodeUrl: `/verify/${newCertId}`,
          grade: scorePercent >= 90 ? 'Distinction' : scorePercent >= 75 ? 'First Class' : 'Passed',
        };
        setCertificates(prev => [newCert, ...prev]);
        return { passed: true, certId: newCertId };
      }
      return { passed: true, certId: existingCert?.id };
    }

    return { passed: false };
  };

  const markAttendance = (
    sessionId: string,
    method: 'qr' | 'face',
    targetUserId?: string,
    confidence?: number
  ) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Session not found' };

    const uid = targetUserId || currentUser.id;
    const userObj = SEED_USERS.find(u => u.id === uid) || currentUser;

    const alreadyMarked = attendance.find(a => a.sessionId === sessionId && a.userId === uid);
    if (alreadyMarked) {
      return { success: true, message: `Attendance already recorded for ${userObj.name}` };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      sessionId,
      userId: uid,
      traineeName: userObj.name,
      traineeCoop: userObj.cooperativeAffiliation || 'NCCT Enrolled Trainee',
      method,
      timestamp: new Date().toLocaleString(),
      confidenceScore: confidence || (method === 'qr' ? 99.8 : 96.5),
      deviceLocation: method === 'face'
        ? 'Raspberry Pi Kiosk Node-01 (Camera & Bounding Box Match)'
        : 'Mobile Geotagged Check-in (VAMNICOM Campus, Pune)',
    };

    setAttendance(prev => [newRecord, ...prev]);

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }

    return { success: true, message: `Attendance logged successfully for ${userObj.name} (${method.toUpperCase()})` };
  };

  const updateNominationStatus = (nominationId: string, status: 'approved' | 'rejected') => {
    setNominations(prev => prev.map(n => n.id === nominationId ? { ...n, status } : n));
  };

  const bulkUpdateNominationStatus = (nominationIds: string[], status: 'approved' | 'rejected') => {
    const idSet = new Set(nominationIds);
    setNominations(prev => prev.map(n => idSet.has(n.id) ? { ...n, status } : n));
  };

  const bulkImportNominations = (programmeId: string, records: Array<{ name: string; email: string; coop: string }>) => {
    const newItems: Nomination[] = records.map((r, i) => ({
      id: `nom-${Date.now()}-${i}`,
      programmeId,
      userId: `usr-imported-${Date.now()}-${i}`,
      traineeName: r.name,
      traineeEmail: r.email,
      cooperativeName: r.coop,
      status: 'approved',
      nominatedDate: new Date().toISOString().split('T')[0],
    }));
    setNominations(prev => [...newItems, ...prev]);
    return newItems.length;
  };

  const applyForJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return false;

    const existing = jobInterests.find(ji => ji.jobPostingId === jobId && ji.userId === currentUser.id);
    if (existing) return true;

    const newInterest: JobInterest = {
      id: `ji-${Date.now()}`,
      jobPostingId: jobId,
      userId: currentUser.id,
      traineeName: currentUser.name,
      traineeEmail: currentUser.email,
      traineeSkills: ['PACS Digitalization', 'KCC Management', 'AMCS Operations'],
      timestamp: new Date().toLocaleString(),
      status: 'submitted',
    };
    setJobInterests(prev => [newInterest, ...prev]);
    return true;
  };

  const createJobPosting = (jobData: Omit<JobPosting, 'id' | 'postedDate'>) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateHostelBed = (bedId: string, updates: Partial<HostelBed>) => {
    setHostelBeds(prev => prev.map(b => b.id === bedId ? { ...b, ...updates } : b));
  };

  const verifyEkyc = (aadhaarNumber: string) => {
    const formatted = `XXXX-XXXX-${aadhaarNumber.slice(-4) || '8842'}`;
    const updated = {
      ...currentUser,
      aadhaarMock: formatted,
      isKycVerified: true,
    };
    setCurrentUser(updated);
    localStorage.setItem('ss_user', JSON.stringify(updated));
  };

  const toggleOfflineMode = () => {
    setIsOffline(prev => !prev);
  };

  const addNewCourse = (course: Course) => {
    setCourses(prev => {
      const existingIdx = prev.findIndex(c => c.id === course.id);
      let next: Course[];
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = course;
      } else {
        next = [course, ...prev];
      }
      try {
        localStorage.setItem('ss_courses_list', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => {
      const next = prev.filter(c => c.id !== courseId);
      try {
        localStorage.setItem('ss_courses_list', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const t = getTranslation(currentLanguage);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        currentLanguage,
        t,
        institutes,
        programmes,
        courses,
        enrollments,
        certificates,
        sessions,
        attendance,
        nominations,
        jobs,
        jobInterests,
        hostelBeds,
        timetable,
        notifications,
        unreadNotificationsCount,
        isOffline,
        offlineQueueCount,
        activeView,
        activeViewParams,
        switchUser,
        logout,
        setLanguage,
        navigate,
        enrollInCourse,
        markLessonComplete,
        submitQuiz,
        markAttendance,
        updateNominationStatus,
        bulkUpdateNominationStatus,
        bulkImportNominations,
        applyForJob,
        createJobPosting,
        updateHostelBed,
        verifyEkyc,
        toggleOfflineMode,
        addNewCourse,
        deleteCourse,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        clearReadNotifications,
        updateUserProfile,
        users,
        addUser,
        toggleUserStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
