import React from 'react';
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
  Sparkles,
  BedDouble,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentUser, activeView, navigate, t } = useApp();

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'trainee':
        return [
          { id: 'home', label: t.nav.home, icon: LayoutDashboard },
          { id: 'courses', label: t.nav.courses, icon: BookOpen },
          { id: 'certificates', label: t.nav.certificates, icon: Award },
          { id: 'jobs', label: t.nav.jobs, icon: Briefcase },
          { id: 'career_bot', label: t.nav.careerBot, icon: Bot, highlight: true },
          { id: 'attendance_kiosk', label: 'Attendance Check-in', icon: QrCode },
        ];

      case 'institute_admin':
        return [
          { id: 'home', label: 'Institute Overview', icon: LayoutDashboard },
          { id: 'programmes_erp', label: t.nav.programmes, icon: Layers },
          { id: 'attendance_kiosk', label: t.nav.attendance, icon: QrCode, badge: 'Hardware Kiosk' },
          { id: 'hostel_timetable', label: t.nav.hostel, icon: BedDouble },
          { id: 'trainee_directory', label: t.nav.trainees, icon: Users },
          { id: 'analytics', label: 'Local Analytics', icon: BarChart3 },
        ];

      case 'super_admin':
        return [
          { id: 'home', label: 'National Dashboard', icon: BarChart3 },
          { id: 'institutes_directory', label: '20 NCCT Institutes', icon: Building2 },
          { id: 'programmes_erp', label: 'National Programmes', icon: Layers },
          { id: 'trainee_directory', label: 'All Certified Trainees', icon: Users },
          { id: 'attendance_kiosk', label: 'Kiosk Monitoring', icon: QrCode },
        ];

      case 'faculty':
        return [
          { id: 'home', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'course_builder', label: t.nav.courseBuilder, icon: Edit3, badge: 'LMS Studio' },
          { id: 'courses', label: 'View Curriculum', icon: BookOpen },
          { id: 'attendance_kiosk', label: 'Session QR & Attendance', icon: QrCode },
          { id: 'trainee_directory', label: 'Enrolled Trainees', icon: Users },
        ];

      case 'employer':
        return [
          { id: 'home', label: 'Recruiter Portal', icon: LayoutDashboard },
          { id: 'trainee_directory', label: 'Certified Candidate Search', icon: Users, badge: 'Verified' },
          { id: 'jobs', label: 'Manage Job Postings', icon: Briefcase },
          { id: 'analytics', label: 'Talent Market Insights', icon: BarChart3 },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-govText-border hidden lg:flex flex-col justify-between min-h-[calc(100vh-5rem)] p-4 shadow-sm flex-shrink-0">
      <div className="space-y-6">
        
        {/* Role Context Card */}
        <div className="bg-govBg rounded-xl p-3.5 border border-govTeal-100">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-govTeal-600" />
            <span className="text-[11px] font-bold text-govTeal-800 uppercase tracking-wider">
              {currentUser.role.replace('_', ' ')} Workspace
            </span>
          </div>
          <p className="text-xs font-semibold text-govText-primary truncate">
            {currentUser.name}
          </p>
          <p className="text-[11px] text-govText-secondary truncate">
            {currentUser.cooperativeAffiliation || (currentUser.instituteId ? 'VAMNICOM / NCCT' : 'NCCT National Portal')}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-govTeal-600 text-white shadow-md'
                    : 'text-govText-primary hover:bg-govTeal-50 hover:text-govTeal-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-saffron-300' : 'text-govTeal-600 group-hover:scale-110 transition-transform'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                
                {item.badge ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-saffron-400 text-govTeal-950' : 'bg-saffron-100 text-saffron-800'
                  }`}>
                    {item.badge}
                  </span>
                ) : item.highlight ? (
                  <Sparkles className="w-3.5 h-3.5 text-saffron-400 animate-spin" />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-white opacity-80' : ''}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-gray-100 text-[11px] text-govText-muted space-y-2">
        <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-200 text-emerald-900">
          <p className="font-bold text-[10px] text-emerald-800 uppercase">National NCCT Network</p>
          <p className="text-[11px]">1 VAMNICOM + 5 RICMs + 14 ICMs connected</p>
        </div>
        <p className="text-center text-[10px]">
          Sahakar Setu v1.0 • Hackathon Prototype
        </p>
      </div>
    </aside>
  );
};
