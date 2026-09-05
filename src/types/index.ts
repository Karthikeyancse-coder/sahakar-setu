export type UserRole = 'trainee' | 'institute_admin' | 'super_admin' | 'faculty' | 'employer';
export type Language = 'en' | 'hi' | 'mr';

export interface Institute {
  id: string;
  name: string;
  nameHi: string;
  type: 'VAMNICOM' | 'RICM' | 'ICM';
  city: string;
  state: string;
  director: string;
  capacity: number;
  contactEmail: string;
  contactPhone: string;
  activeCount: number;
}

export interface User {
  id: string;
  name: string;
  nameHi?: string;
  email: string;
  phone: string;
  role: UserRole;
  languagePreference: Language;
  instituteId?: string;
  cooperativeAffiliation?: string; // e.g. "Primary Agricultural Credit Society (PACS), Nashik"
  avatarUrl?: string;
  demoPhotoHash?: string;
  aadhaarMock?: string;
  isKycVerified?: boolean;
}

export interface Programme {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  instituteId: string;
  startDate: string;
  endDate: string;
  mode: 'residential' | 'online' | 'hybrid';
  capacity: number;
  enrolledCount: number;
  category: string;
  description: string;
}

export interface Nomination {
  id: string;
  programmeId: string;
  userId: string;
  traineeName: string;
  traineeEmail: string;
  cooperativeName: string;
  status: 'pending' | 'approved' | 'rejected';
  nominatedDate: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionHi: string;
  questionMr: string;
  options: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  correctOptionIndex: number;
  explanation: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  titleHi: string;
  titleMr: string;
  passThreshold: number; // percentage, e.g. 70
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  titleHi: string;
  titleMr: string;
  durationMinutes: number;
  contentType: 'text' | 'video' | 'interactive';
  contentByLanguage: {
    en: {
      text: string;
      videoUrl?: string;
      keyTakeaways: string[];
    };
    hi: {
      text: string;
      videoUrl?: string;
      keyTakeaways: string[];
    };
    mr: {
      text: string;
      videoUrl?: string;
      keyTakeaways: string[];
    };
  };
}

export interface CourseModule {
  id: string;
  courseId: string;
  order: number;
  title: string;
  titleHi: string;
  titleMr: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  programmeId?: string;
  title: string;
  titleHi: string;
  titleMr: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  thumbnail: string;
  instituteId: string;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'PACS Digitalization' | 'Dairy & Livestock' | 'SHG Governance' | 'Agri-Credit' | 'Auditing & Compliance';
  modules: CourseModule[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  completedLessonIds: string[];
  completedQuizIds: string[];
  lastAccessedLessonId?: string;
  status: 'in_progress' | 'completed';
  enrolledDate: string;
  completionDate?: string;
}

export interface Session {
  id: string;
  programmeId: string;
  title: string;
  instructor: string;
  date: string;
  timeSlot: string;
  room: string;
  qrToken: string;
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  traineeName: string;
  traineeCoop: string;
  method: 'qr' | 'face' | 'manual';
  timestamp: string;
  confidenceScore?: number;
  deviceLocation?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userAadhaarMock?: string;
  courseId: string;
  courseTitle: string;
  courseTitleHi?: string;
  instituteId: string;
  instituteName: string;
  issuedDate: string;
  certificateHash: string;
  qrCodeUrl: string;
  grade: 'Distinction' | 'First Class' | 'Passed';
}

export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  salaryRange: string;
  type: 'Full-time' | 'Apprenticeship' | 'Contract';
  postedDate: string;
  openingsCount: number;
}

export interface JobInterest {
  id: string;
  jobPostingId: string;
  userId: string;
  traineeName: string;
  traineeEmail: string;
  traineeSkills: string[];
  timestamp: string;
  status: 'submitted' | 'reviewed' | 'shortlisted';
}

export interface HostelBed {
  id: string;
  roomNumber: string;
  bedNumber: string;
  block: 'Block A (Men)' | 'Block B (Women)' | 'Executive Guest Block';
  programmeId: string;
  traineeId?: string;
  traineeName?: string;
  status: 'occupied' | 'vacant' | 'maintenance';
}

export interface TimetableEntry {
  id: string;
  programmeId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subject: string;
  facultyName: string;
  venue: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'certificate' | 'job' | 'course' | 'attendance' | 'system';
  linkView?: string;
  linkParams?: any;
}

