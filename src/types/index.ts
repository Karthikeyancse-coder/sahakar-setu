export type UserRole = 'trainee' | 'institute_admin' | 'super_admin' | 'faculty' | 'employer' | 'device_operator' | 'hostel_admin';
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
  employeeId?: string;
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
  status?: 'active' | 'deactivated' | 'pending';
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

export interface QuizOption {
  id: string;
  text: string;
  textHi?: string;
  textMr?: string;
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
  optionList?: QuizOption[];
  correctOptionIndex: number;
  correctOptionId?: string;
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

export interface LessonAttachment {
  id: string;
  name: string;
  size?: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'link';
  url?: string;
}

export interface LessonLanguageContent {
  text: string;
  overview?: string;
  richContent?: string;
  learningObjectives?: string[];
  keyTakeaways: string[];
  videoUrl?: string;
  transcript?: string;
}

export type ContentBlockType = 'text' | 'video' | 'attachment' | 'image' | 'link' | 'activity';

export interface TextBlockData {
  heading?: string;
  body: string;
}

export interface VideoBlockData {
  title: string;
  videoUrl: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
}

export interface AttachmentBlockData {
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
}

export interface ImageBlockData {
  imageUrl: string;
  caption?: string;
  altText?: string;
}

export interface LinkBlockData {
  title: string;
  url: string;
  description?: string;
  openInNewTab?: boolean;
}

export interface ActivityBlockData {
  title: string;
  instructions: string;
  expectedOutcome: string;
  resourceName?: string;
  resourceUrl?: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text?: { en: TextBlockData; hi: TextBlockData; mr: TextBlockData };
  video?: { en: VideoBlockData; hi: VideoBlockData; mr: VideoBlockData };
  attachment?: AttachmentBlockData;
  image?: { en: ImageBlockData; hi: ImageBlockData; mr: ImageBlockData };
  link?: { en: LinkBlockData; hi: LinkBlockData; mr: LinkBlockData };
  activity?: { en: ActivityBlockData; hi: ActivityBlockData; mr: ActivityBlockData };
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  titleHi: string;
  titleMr: string;
  durationMinutes: number;
  contentType: 'text' | 'video' | 'interactive' | 'pdf' | 'presentation' | 'resource' | 'document' | 'practical' | 'mixed' | string;
  status?: 'Draft' | 'Ready' | 'Published';
  overview?: string;
  overviewHi?: string;
  overviewMr?: string;
  blocks?: ContentBlock[];
  videoUrl?: string;
  documentName?: string;
  documentUrl?: string;
  presentationName?: string;
  presentationUrl?: string;
  externalUrl?: string;
  attachments?: LessonAttachment[];
  contentByLanguage: {
    en: LessonLanguageContent;
    hi: LessonLanguageContent;
    mr: LessonLanguageContent;
  };
}

export interface CourseModule {
  id: string;
  courseId: string;
  order: number;
  title: string;
  titleHi: string;
  titleMr: string;
  description?: string;
  descriptionHi?: string;
  descriptionMr?: string;
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
  grade: 'Distinction' | 'First Class' | 'Passed' | string;
  certificateNumber?: string;
  verificationToken?: string;
  qrCodeData?: string;
  status?: string;
  candidateName?: string;
  issueDate?: string;
  completionDate?: string;
  score?: number;
  cooperative?: string;
}

export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  requiredQualification?: string;
  minimumExperience?: number;
  requiredCertificates?: string[];
  location: string;
  salaryRange: string;
  type: 'Full-time' | 'Apprenticeship' | 'Contract' | string;
  postedDate: string;
  openingsCount: number;
  status?: string;

  // Dynamic Trainee Match properties
  matchScore?: number | null;
  matchLabel?: 'Excellent Match' | 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Low Match' | string | null;
  eligibilityStatus?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | string | null;
  ineligibilityReasons?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  hasRequiredCertificate?: boolean;
  hasApplied?: boolean;
  applicationStatus?: string | null;
  applicationId?: string | null;
}

export interface JobInterest {
  id: string;
  jobPostingId: string;
  userId: string;
  traineeName: string;
  traineeEmail: string;
  traineeSkills: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  matchScore?: number;
  eligibilityStatus?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | string;
  ineligibilityReasons?: string[];
  timestamp: string;
  appliedAt?: string;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'submitted' | 'reviewed' | 'shortlisted' | string;
  job?: JobPosting;
  user?: User;
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

// ─── HOSTEL MODULE ENTERPRISE MODELS (Document Specification) ─────────────────

export interface Hostel {
  id: string;
  institutionId: string;
  name: string;
  address?: string;
  status: 'active' | 'inactive';
  contactPerson?: string;
  contactPhone?: string;
  totalBlocks?: number;
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
}

export interface HostelBlock {
  id: string;
  hostelId: string;
  name: string; // e.g. "Block A (Men)", "Block B (Women)", "Executive Guest Block"
  code?: string;
  floorCount?: number;
  totalFloors?: number;
  category?: 'Men' | 'Women' | 'Co-ed' | 'Executive' | 'VIP';
  genderPolicy?: 'boys' | 'girls' | 'co-ed' | string;
  status: 'active' | 'inactive' | 'maintenance';
  wardenName?: string;
  wardenPhone?: string;
  caretakerName?: string;
  caretakerPhone?: string;
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
}

export interface HostelRoom {
  id: string;
  blockId: string;
  blockName?: string;
  roomNumber: string;
  floor: number;
  roomType: 'Single' | 'Double' | 'Triple' | 'Dormitory' | string;
  capacity: number;
  status: 'AVAILABLE' | 'FULL' | 'PARTIALLY_OCCUPIED' | 'MAINTENANCE' | 'BLOCKED' | string;
  occupiedBeds?: number;
  availableBeds?: number;
  beds?: HostelBedRecord[];
}

export interface HostelBedRecord {
  id: string;
  roomId: string;
  roomNumber?: string;
  blockId?: string;
  blockName?: string;
  bedNumber: string; // e.g. "Bed 1", "Bed 2"
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | string;
  currentOccupantId?: string;
  currentOccupantName?: string;
  occupantName?: string;
  currentProgrammeTitle?: string;
}

export type HostelRequestStatus =
  | 'NOT_REQUESTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ALLOCATED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'pending'
  | 'approved'
  | 'allocated'
  | 'rejected'
  | string;

export interface HostelRequest {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeEmail?: string;
  traineePhone?: string;
  traineeCity?: string;
  traineeState?: string;
  state?: string;
  district?: string;
  isOutstation?: boolean;
  programmeId: string;
  programmeTitle?: string;
  programmeName?: string;
  institutionId?: string;
  required?: boolean;
  requestedFrom?: string;
  requestedTo?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: HostelRequestStatus;
  priority?: number; // calculated score (0-100)
  priorityScore?: number;
  priorityReason?: string;
  specialRequirements?: string;
  specialRequests?: string;
  roomTypePreference?: string;
  foodPreference?: 'Veg' | 'Non-Veg' | 'Jain' | 'Standard' | string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt?: string;
  allocatedRoom?: string;
  allocatedBed?: string;
  allocatedBlock?: string;
}

export type HostelAllocationStatus =
  | 'RESERVED'
  | 'ALLOCATED'
  | 'CHECKED_IN'
  | 'TRANSFERRED'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'allocated'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | string;

export interface HostelAllocation {
  id: string;
  requestId?: string;
  passNumber?: string;
  traineeId: string;
  traineeName: string;
  traineeEmail?: string;
  traineePhone?: string;
  traineeCoop?: string;
  programmeId: string;
  programmeTitle?: string;
  programmeName?: string;
  blockId: string;
  blockName: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  allocatedFrom: string;
  allocatedTo?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: HostelAllocationStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
  identityVerifiedBy?: string;
  verificationMethod?: 'NFC' | 'Aadhaar' | 'Photo' | 'ID_Card' | string;
  notes?: string;
  createdAt: string;
}

export type HostelComplaintCategory =
  | 'Electrical'
  | 'Water'
  | 'Cleaning'
  | 'Food'
  | 'Room'
  | 'Safety'
  | 'Internet'
  | 'Other'
  | string;

export type HostelComplaintStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REOPENED'
  | 'CLOSED'
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | string;

export interface HostelComplaint {
  id: string;
  traineeId: string;
  traineeName: string;
  hostelId?: string;
  blockName?: string;
  roomId?: string;
  roomNumber?: string;
  category: HostelComplaintCategory;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | string;
  status: HostelComplaintStatus;
  assignedTo?: string;
  assignedStaffName?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  photoUrl?: string;
}

export interface HostelOccupancyMetrics {
  totalBlocks: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
  pendingRequests: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  openComplaints: number;
  checkedInCount?: number;
  activeComplaints?: number;
}

