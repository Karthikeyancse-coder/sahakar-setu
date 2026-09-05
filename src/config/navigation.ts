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
  UserCheck
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
        { id: 'home', label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'My Courses', route: '/dashboard/courses', icon: BookOpen },
        { id: 'certificates', label: 'Certificates', route: '/dashboard/certificates', icon: Award },
        { id: 'jobs', label: 'Job Opportunities', route: '/dashboard/jobs', icon: Briefcase },
        { id: 'attendance_kiosk', label: 'Attendance', route: '/dashboard/attendance', icon: QrCode },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'help', label: 'Help & Support', route: '/dashboard/help', icon: HelpCircle },
        { id: 'settings', label: 'Settings', route: '/dashboard/settings', icon: Settings },
      ],
    },
  ],

  institute_admin: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Dashboard', route: '/dashboard/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TRAINING OPERATIONS',
      items: [
        { id: 'programmes_erp', label: 'Programmes', route: '/dashboard/admin/programmes', icon: Layers },
        { id: 'nominations', label: 'Nominations', route: '/dashboard/admin/nominations', icon: FileCheck },
        { id: 'trainee_directory', label: 'Trainees', route: '/dashboard/admin/trainees', icon: Users },
        { id: 'attendance_kiosk', label: 'Sessions & Kiosk', route: '/dashboard/admin/attendance', icon: QrCode, badge: 'Hardware' },
      ],
    },
    {
      title: 'CAMPUS & LOGISTICS',
      items: [
        { id: 'hostel_timetable', label: 'Hostel & Rooms', route: '/dashboard/admin/hostel', icon: BedDouble },
        { id: 'timetable', label: 'Academic Timetable', route: '/dashboard/admin/timetable', icon: CalendarDays },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'Institute Analytics', route: '/dashboard/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/dashboard/settings', icon: Settings },
      ],
    },
  ],

  super_admin: [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'home', label: 'National Dashboard', route: '/dashboard/super-admin', icon: BarChart3 },
      ],
    },
    {
      title: 'NETWORK MANAGEMENT',
      items: [
        { id: 'institutes_directory', label: '20 NCCT Institutes', route: '/dashboard/super-admin/institutes', icon: Building2 },
        { id: 'programmes_erp', label: 'National Programmes', route: '/dashboard/super-admin/programmes', icon: Layers },
        { id: 'trainee_directory', label: 'Certified Trainees', route: '/dashboard/super-admin/trainees', icon: Users },
        { id: 'attendance_kiosk', label: 'Kiosk Monitoring', route: '/dashboard/super-admin/kiosks', icon: Cpu, badge: 'Live Nodes' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'National Analytics', route: '/dashboard/super-admin/analytics', icon: TrendingUp },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Audit Logs & Settings', route: '/dashboard/settings', icon: Settings },
      ],
    },
  ],

  faculty: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Faculty Dashboard', route: '/dashboard/faculty', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TEACHING & CURRICULUM',
      items: [
        { id: 'course_builder', label: 'Course Studio', route: '/dashboard/faculty/content', icon: Edit3, badge: 'Studio' },
        { id: 'courses', label: 'Curriculum Catalog', route: '/dashboard/faculty/courses', icon: BookOpen },
        { id: 'trainee_directory', label: 'Enrolled Learners', route: '/dashboard/faculty/learners', icon: Users },
        { id: 'attendance_kiosk', label: 'Class Attendance', route: '/dashboard/faculty/attendance', icon: QrCode },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', route: '/dashboard/settings', icon: Settings },
      ],
    },
  ],

  employer: [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Recruiter Dashboard', route: '/dashboard/employer', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TALENT ACQUISITION',
      items: [
        { id: 'trainee_directory', label: 'Find Candidates', route: '/dashboard/employer/candidates', icon: Users, badge: 'Verified' },
        { id: 'jobs', label: 'Job Postings', route: '/dashboard/employer/jobs', icon: Briefcase },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'Skill Demand Insights', route: '/dashboard/employer/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Company Profile', route: '/dashboard/settings', icon: Settings },
      ],
    },
  ],
};
