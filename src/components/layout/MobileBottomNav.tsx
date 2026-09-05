import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Bot,
  Award,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { currentUser, activeView, navigate } = useApp();

  // Bottom navigation is tailored specifically for Trainees on mobile (max 5 items)
  if (currentUser.role !== 'trainee') return null;

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'attendance_kiosk', label: 'Attendance', icon: QrCode },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-govText-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1 flex items-center justify-around select-none pb-[calc(0.25rem+env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-govTeal-700 font-bold'
                : 'text-govText-secondary font-medium hover:text-govTeal-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
