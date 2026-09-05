import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
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
  bulkImportNominations: (programmeId: string, records: Array<{ name: string; email: string; coop: string }>) => number;
  applyForJob: (jobId: string) => boolean;
  createJobPosting: (job: Omit<JobPosting, 'id' | 'postedDate'>) => void;
  updateHostelBed: (bedId: string, updates: Partial<HostelBed>) => void;
  verifyEkyc: (aadhaarNumber: string) => void;
  toggleOfflineMode: () => void;
  addNewCourse: (course: Course) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  clearReadNotifications: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Clean path resolution without hash routing
const resolveRoute = (isAuth: boolean) => {
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
        window.history.replaceState({}, '', '/dashboard');
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

  // Pure HTML5 pathname routing
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

  // Authenticated routes
  if (path === '/dashboard' || path === '/home' || path === '/') {
    return { view: 'home', params: null };
  }
  if (path === '/courses' || path === '/catalog' || path === '/dashboard/courses') {
    return { view: 'courses', params: null };
  }
  if (path === '/my-courses' || path === '/dashboard/my-courses') {
    return { view: 'my_courses', params: null };
  }

  const courseLearnMatch = path.match(/^\/courses\/([^/]+)\/learn/);
  if (courseLearnMatch) {
    return { view: 'course_player', params: { courseId: courseLearnMatch[1] } };
  }
  const courseQuizMatch = path.match(/^\/courses\/([^/]+)\/quiz(?:\/([^/]+))?/);
  if (courseQuizMatch) {
    return { view: 'quiz', params: { courseId: courseQuizMatch[1], moduleId: courseQuizMatch[2] } };
  }
  const courseDetailMatch = path.match(/^\/courses\/([^/]+)$/);
  if (courseDetailMatch) {
    return { view: 'course_detail', params: { courseId: courseDetailMatch[1] } };
  }

  if (path === '/certificates' || path === '/dashboard/certificates') {
    return { view: 'certificates', params: null };
  }
  if (path === '/jobs' || path === '/dashboard/jobs') {
    return { view: 'jobs', params: null };
  }
  const jobDetailMatch = path.match(/^\/jobs\/([^/]+)$/);
  if (jobDetailMatch) {
    return { view: 'job_detail', params: { jobId: jobDetailMatch[1] } };
  }
  if (path === '/my-applications' || path === '/dashboard/my-applications') {
    return { view: 'my_applications', params: null };
  }
  if (path === '/career-chat' || path === '/dashboard/career-chat') {
    return { view: 'career_chat', params: null };
  }
  if (path === '/attendance' || path === '/dashboard/attendance') {
    return { view: 'attendance_kiosk', params: null };
  }
  if (path === '/profile' || path === '/dashboard/profile') {
    return { view: 'profile', params: null };
  }
  if (path === '/settings' || path === '/dashboard/settings') {
    return { view: 'settings', params: null };
  }
  if (path === '/help' || path === '/dashboard/help') {
    return { view: 'help', params: null };
  }

  // Root '/' and default fallback
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

  // Resolve initial view based on current browser URL
  const initialRoute = resolveRoute(localStorage.getItem('ss_auth') === 'true');
  const [activeView, setActiveView] = useState<string>(initialRoute.view);
  const [activeViewParams, setActiveViewParams] = useState<any>(initialRoute.params);

  const [institutes] = useState<Institute[]>(SEED_INSTITUTES);
  const [programmes, setProgrammes] = useState<Programme[]>(SEED_PROGRAMMES);
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(SEED_ENROLLMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(SEED_CERTIFICATES);
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [nominations, setNominations] = useState<Nomination[]>(SEED_NOMINATIONS);
  const [jobs, setJobs] = useState<JobPosting[]>(SEED_JOBS);
  const [jobInterests, setJobInterests] = useState<JobInterest[]>([]);
  const [hostelBeds, setHostelBeds] = useState<HostelBed[]>(SEED_HOSTEL_BEDS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(SEED_TIMETABLE);
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
      const route = resolveRoute(isAuth);
      setActiveView(route.view);
      setActiveViewParams(route.params);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({}, '', '/dashboard');
      }
    }
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('ss_lang', lang);
  };

  const navigate = (view: string, params?: any) => {
    if (view === 'login' || view === '/' || view === 'logout') {
      logout();
      return;
    }

    let targetPath = '/dashboard';
    if (view === 'signup' || view === 'register') {
      targetPath = '/register';
    } else if (view === 'forgot_password') {
      targetPath = '/forgot-password';
    } else if (view === 'verify_public') {
      const certId = params?.certId || 'NCCT-CERT-2026-VAM-0089';
      targetPath = `/verify/${certId}`;
    } else if (view === 'home' || view === 'dashboard') {
      targetPath = '/dashboard';
    } else if (view === 'courses') {
      targetPath = '/courses';
    } else if (view === 'course_detail') {
      targetPath = `/courses/${params?.courseId || ''}`;
    } else if (view === 'course_player' || view === 'course_view') {
      targetPath = `/courses/${params?.courseId || ''}/learn`;
    } else if (view === 'quiz') {
      targetPath = `/courses/${params?.courseId || ''}/quiz/${params?.moduleId || ''}`;
    } else if (view === 'my_courses') {
      targetPath = '/my-courses';
    } else if (view === 'certificates') {
      targetPath = '/certificates';
    } else if (view === 'jobs') {
      targetPath = '/jobs';
    } else if (view === 'job_detail') {
      targetPath = `/jobs/${params?.jobId || ''}`;
    } else if (view === 'my_applications') {
      targetPath = '/my-applications';
    } else if (view === 'career_chat' || view === 'career_bot') {
      targetPath = '/career-chat';
    } else if (view === 'attendance_kiosk') {
      targetPath = '/attendance';
    } else if (view === 'profile') {
      targetPath = '/profile';
    } else if (view === 'settings') {
      targetPath = '/settings';
    } else if (view === 'help') {
      targetPath = '/help';
    } else {
      targetPath = `/dashboard`;
    }

    const isAuth = localStorage.getItem('ss_auth') === 'true' || isAuthenticated;
    if (!isAuth && view !== 'signup' && view !== 'forgot_password' && view !== 'verify_public') {
      logout();
      return;
    }

    setActiveView(view);
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
    setCourses(prev => [course, ...prev]);
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
        bulkImportNominations,
        applyForJob,
        createJobPosting,
        updateHostelBed,
        verifyEkyc,
        toggleOfflineMode,
        addNewCourse,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        clearReadNotifications,
        updateUserProfile,
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
