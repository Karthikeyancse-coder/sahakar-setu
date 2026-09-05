import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Briefcase,
  Bot,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentUser, activeView, navigate, t } = useApp();

  // Show only on mobile for all roles, especially tailored for trainees
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'attendance_kiosk', label: 'Check-in', icon: QrCode },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'career_bot', label: 'Sahayak AI', icon: Bot, isSpecial: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-govText-border shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
              item.isSpecial
                ? isActive
                  ? 'bg-govTeal-600 text-white font-bold'
                  : 'text-saffron-600 font-semibold'
                : isActive
                ? 'text-govTeal-700 font-bold'
                : 'text-govText-secondary font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${item.isSpecial && !isActive ? 'text-saffron-500 animate-bounce' : ''}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
