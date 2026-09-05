import React from 'react';
import {
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  LogOut,
  HelpCircle,
  Settings,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAVIGATION_BY_ROLE } from '../../config/navigation';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { currentUser, activeView, navigate, setLanguage, currentLanguage, logout } = useApp();

  const sections = NAVIGATION_BY_ROLE[currentUser.role] || NAVIGATION_BY_ROLE.trainee;

  const handleNavClick = (id: string) => {
    navigate(id);
  };

  const getWorkspaceSubtitle = () => {
    if (currentUser.cooperativeAffiliation) {
      return currentUser.cooperativeAffiliation;
    }
    if (currentUser.instituteId) {
      return 'VAMNICOM, Pune (Apex NCCT)';
    }
    return 'Ministry of Cooperation, New Delhi';
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-[272px] flex-shrink-0 h-[100dvh] sticky top-0 left-0 bg-white border-r border-govText-border z-30 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]"
      style={{ width: '272px' }}
    >
      {/* 1. Header: Brand Logo & Title */}
      <div
        onClick={() => navigate('home')}
        className="p-5 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-govBg/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-govTeal-600 to-govTeal-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
          <Building2 className="w-5 h-5 text-saffron-300" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-base text-govTeal-800 font-devanagari">
              सहकार सेतु
            </span>
            <span className="text-[10px] font-bold text-saffron-600 tracking-wider font-sans">
              SETU
            </span>
          </div>
          <p className="text-[10px] text-govText-secondary font-medium tracking-tight mt-1 truncate">
            NCCT Training & Employment
          </p>
        </div>
      </div>

      {/* 2. User Profile Card (Below Sahakar Setu logo) */}
      <div className="p-3 border-b border-gray-100 bg-[#FBFDFB]">
        <div className="bg-white rounded-xl p-2.5 border border-gray-200/80 shadow-xs flex items-center gap-2.5">
          {/* Profile Avatar */}
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-[#005B46] flex-shrink-0"
          />

          {/* Profile Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
              {currentUser.name}
            </h3>
            <p className="text-[10px] font-semibold text-emerald-800 capitalize leading-tight mt-0.5">
              {currentUser.role === 'trainee' ? 'Trainee' : currentUser.role.replace('_', ' ')}
            </p>
            <p className="text-[9.5px] text-gray-500 leading-tight mt-0.5 truncate">
              {currentUser.cooperativeAffiliation || 'Shri Datta PACS, Niphad, Nashik'}
            </p>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* 3. Navigation List (Independent Scroll) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <p className="px-3 text-[10px] font-bold text-govText-muted uppercase tracking-wider mb-1.5">
                {section.title}
              </p>
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive
                    ? 'bg-govTeal-600 text-white shadow-sm'
                    : 'text-govText-primary hover:bg-govTeal-50 hover:text-govTeal-800'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${isActive
                        ? 'text-saffron-300'
                        : 'text-govTeal-600 group-hover:scale-110 transition-transform'
                        }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${isActive
                        ? 'bg-saffron-400 text-govTeal-950'
                        : 'bg-saffron-100 text-saffron-800'
                        }`}
                    >
                      {item.badge}
                    </span>
                  ) : item.highlight ? (
                    <Sparkles className="w-3.5 h-3.5 text-saffron-400 animate-spin" />
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-30 ${isActive ? 'text-white opacity-80' : ''}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Cooperative Motto Watermark Area */}
        <div className="px-3 py-4 text-center select-none opacity-85 mt-auto border-t border-gray-100/80 pt-4">
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-emerald-50/80 border border-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#005B46]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <p className="text-[11px] font-bold text-[#005B46] font-devanagari">
            सहकार से समृद्धि
          </p>
          <p className="text-[9px] text-gray-500 leading-tight mt-0.5">
            Together for a stronger cooperative India
          </p>
        </div>
      </div>

      {/* 4. Bottom Footer: Help, Language & Logout */}
      <div className="p-3 border-t border-gray-100 bg-govBg/30 space-y-1">
        <button
          onClick={() => (onLogout ? onLogout() : logout())}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <div className="pt-1.5 flex items-center justify- between px-2 text-[10px] text-govText-muted">
          <span>Sahakar Setu v1.1</span>
          <span className="font-semibold text-govTeal-700">NCCT Central Hub</span>
        </div>
      </div>
    </aside>
  );
};
