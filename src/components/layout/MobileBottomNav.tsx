import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Grid3X3,
  UserRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  isMoreOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMore, isMoreOpen = false }) => {
  const { currentUser, activeView, navigate } = useApp();

  // Bottom navigation is tailored specifically for Trainees on mobile and tablet (< 1024px)
  if (currentUser.role !== 'trainee') return null;

  const isMoreActive =
    isMoreOpen ||
    activeView === 'certificates' ||
    activeView === 'verify_public' ||
    activeView === 'attendance' ||
    activeView === 'attendance_kiosk' ||
    activeView === 'help' ||
    activeView === 'settings';

  const navItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activeView === 'home',
      action: () => navigate('home'),
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      isActive:
        activeView === 'courses' ||
        activeView === 'course_detail' ||
        activeView === 'my_courses' ||
        activeView === 'course_player' ||
        activeView === 'quiz',
      action: () => navigate('courses'),
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      isActive: activeView === 'jobs' || activeView === 'job_detail' || activeView === 'my_applications',
      action: () => navigate('jobs'),
    },
    {
      id: 'more',
      label: 'More',
      icon: Grid3X3,
      isActive: isMoreActive,
      action: onOpenMore,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserRound,
      isActive: activeView === 'profile',
      action: () => navigate('profile'),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white border-t border-govText-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none pb-[calc(0.5rem+env(safe-area-inset-bottom))] h-[68px]"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = item.isActive;

        return (
          <button
            key={item.id}
            onClick={item.action}
            aria-label={item.label}
            className={`relative flex flex-col items-center justify-center min-w-[58px] min-h-[44px] py-1 px-1 rounded-xl transition-colors cursor-pointer ${
              isActive
                ? 'text-[#0B6E4F] font-bold'
                : 'text-gray-500 font-medium hover:text-[#0B6E4F]'
            }`}
          >
            {/* Clear active indicator bar at top of button */}
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 bg-[#0B6E4F] rounded-full" />
            )}

            <Icon
              className={`w-5 h-5 transition-transform ${
                isActive ? 'text-[#0B6E4F] stroke-[2.3]' : 'text-gray-500 stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[10px] tracking-tight mt-1 leading-none ${
                isActive ? 'font-bold text-[#0B6E4F]' : 'font-medium text-gray-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
