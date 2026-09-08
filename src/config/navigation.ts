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
        { id: 'attendance_history', label: 'Attendance History', route: '/trainee/attendance', icon: ShieldCheck, badge: 'Biometric' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/trainee/settings', icon: Settings },
        { id: 'help', label: 'Help & Support', route: '/trainee/help', icon: HelpCircle },
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
        { id: 'attendance', label: 'Attendance Devices', route: '/institute-admin/attendance', icon: Cpu },
      ],
    },
    {
      title: 'CAMPUS & LOGISTICS',
      items: [
        { id: 'hostel', label: 'Hostel & Rooms', route: '/institute-admin/hostel', icon: BedDouble },
        { id: 'timetable', label: 'Academic Timetable', route: '/institute-admin/timetable', icon: CalendarDays },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'reports', label: 'Analytics', route: '/institute-admin/analytics', icon: BarChart3 },
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
      title: 'MAIN',
      items: [
        { id: 'home', label: 'National Dashboard', route: '/super-admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'FEDERATION & GOVERNANCE',
      items: [
        { id: 'institutes', label: '20 NCCT Institutes', route: '/super-admin/institutes', icon: Building2 },
        { id: 'user_management', label: 'User & Role Management', route: '/super-admin/users', icon: UserCheck },
        { id: 'national_curriculum', label: 'National Curriculum Hub', route: '/super-admin/curriculum', icon: BookOpen },
        { id: 'national_certificates', label: 'National Certificate Registry', route: '/super-admin/certificates', icon: Award },
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
        { id: 'home', label: 'Dashboard', route: '/faculty/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TEACHING & CURRICULUM',
      items: [
        { id: 'courses', label: 'Courses', route: '/faculty/courses', icon: BookOpen },
        { id: 'course_builder', label: 'Course Studio', route: '/faculty/courses/crs-pacs-erp-101/edit', icon: Edit3, badge: 'Studio' },
        { id: 'attendance', label: 'Classroom Attendance', route: '/faculty/attendance', icon: Users },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/faculty/settings', icon: Settings },
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
