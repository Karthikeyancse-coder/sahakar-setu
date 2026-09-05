import {
  LayoutDashboard,
  BookOpen,
  Award,
  Briefcase,
  Bot,
  QrCode,
  Users,
  Building2,
  CalendarDays,
  BarChart3,
  Edit3,
  Layers,
  BedDouble,
  ShieldCheck,
  GraduationCap,
  FileCheck,
  Settings,
  HelpCircle,
  LogOut,
  FolderKanban,
  FileSpreadsheet,
  Cpu,
  TrendingUp,
  UserCheck,
  User,
  Compass,
  Send,
} from 'lucide-react';
import { UserRole } from '../types';

export interface NavItem {
  id: string;
  labelKey?: string;
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAVIGATION_BY_ROLE: Record<UserRole, NavSection[]> = {
  trainee: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Dashboard', route: '/trainee/dashboard', icon: LayoutDashboard },
        { id: 'my_courses', label: 'My Courses', route: '/trainee/my-courses', icon: BookOpen },
        { id: 'certificates', label: 'Certificates', route: '/trainee/certificates', icon: Award },
        { id: 'jobs', label: 'Job Opportunities', route: '/trainee/jobs', icon: Briefcase },
        { id: 'attendance_kiosk', label: 'Attendance', route: '/trainee/attendance', icon: QrCode },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'help', label: 'Help & Support', route: '/trainee/help', icon: HelpCircle },
        { id: 'settings', label: 'Settings', route: '/trainee/settings', icon: Settings },
      ],
    },
  ],

  institute_admin: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Dashboard', route: '/institute-admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TRAINING OPERATIONS',
      items: [
        { id: 'programmes_erp', label: 'Programmes', route: '/institute-admin/programmes', icon: Layers },
        { id: 'nominations', label: 'Nominations', route: '/institute-admin/nominations', icon: FileCheck },
        { id: 'trainee_directory', label: 'Trainees', route: '/institute-admin/trainees', icon: Users },
        { id: 'attendance_kiosk', label: 'Sessions & Kiosk', route: '/institute-admin/sessions', icon: QrCode, badge: 'Hardware' },
      ],
    },
    {
      title: 'CAMPUS & LOGISTICS',
      items: [
        { id: 'hostel_timetable', label: 'Hostel & Rooms', route: '/institute-admin/hostel', icon: BedDouble },
        { id: 'timetable', label: 'Academic Timetable', route: '/institute-admin/timetable', icon: CalendarDays },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'Institute Analytics', route: '/institute-admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/institute-admin/settings', icon: Settings },
      ],
    },
  ],

  super_admin: [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'home', label: 'National Dashboard', route: '/super-admin/dashboard', icon: BarChart3 },
      ],
    },
    {
      title: 'NETWORK MANAGEMENT',
      items: [
        { id: 'institutes_directory', label: '20 NCCT Institutes', route: '/super-admin/institutes', icon: Building2 },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'National Analytics', route: '/super-admin/analytics', icon: TrendingUp },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/super-admin/settings', icon: Settings },
      ],
    },
  ],

  faculty: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Faculty Dashboard', route: '/faculty/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TEACHING & CURRICULUM',
      items: [
        { id: 'courses', label: 'Courses', route: '/faculty/courses', icon: BookOpen },
        { id: 'course_builder', label: 'Course Studio', route: '/faculty/courses/crs-pacs-erp-101/edit', icon: Edit3, badge: 'Studio' },
      ],
    },
  ],

  employer: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Recruiter Dashboard', route: '/employer/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TALENT ACQUISITION',
      items: [
        { id: 'trainee_directory', label: 'Candidates', route: '/employer/candidates', icon: Users, badge: 'Verified' },
        { id: 'jobs', label: 'Job Postings', route: '/employer/jobs', icon: Briefcase },
      ],
    },
  ],
};
