import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ChevronDown,
  Wifi,
  WifiOff,
  Menu,
  QrCode,
  Fingerprint,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Award,
  Clock,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, AppNotification } from '../../types';
import { EkycModal } from '../common/EkycModal';

interface DashboardHeaderProps {
  onOpenMobileDrawer?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const {
    currentUser,
    currentLanguage,
    setLanguage,
    navigate,
    isOffline,
    toggleOfflineMode,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isEkycOpen, setIsEkycOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'National' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  ];

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setIsNotificationsOpen(false);
    if (notif.linkView) {
      navigate(notif.linkView, notif.linkParams);
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-govTeal-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-saffron-600" />;
      case 'certificate':
      case ('cert' as any):
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-govTeal-600" />;
    }
  };

  return (
    <>
      {/* Fixed / Sticky Header Container: Keeps Civic Top Bar + Main Header pinned at top */}
      <div className="sticky top-0 z-40 w-full bg-white shadow-xs flex-shrink-0">
        {/* 1. Subtle Government Civic Top Bar */}
        <div className="bg-govTeal-950 text-govTeal-100 text-[10px] sm:text-[11px] py-1 px-3 sm:px-4 border-b border-govTeal-900 select-none">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 font-medium truncate">
              {currentLanguage !== 'en' ? (
                <>
                  <span className="font-devanagari truncate">{currentLanguage === 'mr' ? 'महाराष्ट्र / भारत सरकार' : 'भारत सरकार'}</span>
                  <span className="opacity-40">|</span>
                  <span className="hidden min-[360px]:inline truncate">Govt. of India</span>
                  <span className="text-govTeal-400 hidden sm:inline">•</span>
                  <span className="text-saffron-300 hidden sm:inline truncate">
                    {currentLanguage === 'mr' ? 'सहकारिता मंत्रालय' : 'सहकारिता मंत्रालय (Ministry of Cooperation)'}
                  </span>
                </>
              ) : (
                <>
                  <span className="truncate">Government of India</span>
                  <span className="text-govTeal-400 hidden min-[400px]:inline">•</span>
                  <span className="text-saffron-300 hidden min-[400px]:inline truncate">Ministry of Cooperation</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] flex-shrink-0">
              <span className="hidden md:inline opacity-75">
                {currentLanguage === 'en'
                  ? 'National Council for Cooperative Training (NCCT)'
                  : 'राष्ट्रीय सहकारी प्रशिक्षण परिषद (NCCT)'}
              </span>
              <button
                onClick={() => navigate('verify_public', { certId: 'NCCT-CERT-2026-VAM-0089' })}
                className="hover:text-white underline flex items-center gap-1 text-saffron-300 font-semibold cursor-pointer"
              >
                <QrCode className="w-3 h-3 flex-shrink-0" />
                <span className="hidden min-[340px]:inline">Verify Certificate</span>
                <span className="min-[340px]:hidden">Verify</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Dashboard Application Header */}
        <header className="bg-white border-b border-govText-border">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

              {/* Left: Brand Logo & Title on mobile/tablet, Global Search on desktop */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile/Tablet Brand indicator (when sidebar is hidden on < 1024px) - No hamburger */}
                <div
                  className="lg:hidden flex items-center gap-2 cursor-pointer flex-shrink-0"
                  onClick={() => navigate('home')}
                  title="Sahakar Setu"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-govTeal-700 to-govTeal-900 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                    <Building2 className="w-4 h-4 text-saffron-300" />
                  </div>
                  <span className={`font-extrabold text-xs sm:text-sm text-govTeal-900 tracking-tight whitespace-nowrap ${currentLanguage !== 'en' ? 'font-devanagari' : ''}`}>
                    {currentLanguage === 'en' ? 'SAHAKAR SETU' : 'सहकार सेतु'}
                  </span>
                </div>

                {/* Desktop Global Search Input (>= 1024px) */}
                <div className="hidden lg:flex items-center relative w-72 lg:w-80">
                  <input
                    type="text"
                    placeholder="Search programmes, courses, circulars..."
                    className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-govText-muted absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Right: Actions, Language, e-KYC, Notifications */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">

                {/* Offline Status Toggle (Hidden on narrow mobile < 640px to preserve space) */}
                <button
                  onClick={toggleOfflineMode}
                  className={`hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] ${isOffline
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  title="Click to toggle offline mode simulation"
                >
                  {isOffline ? (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                      <span>Offline Mode</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Online Sync</span>
                    </>
                  )}
                </button>

                {/* Language Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-govText-border bg-govBg hover:bg-white text-xs font-semibold text-govText-primary flex items-center gap-1 shadow-sm cursor-pointer min-h-[36px]"
                  >
                    <Globe className="w-3.5 h-3.5 text-govTeal-600" />
                    <span className="text-[11px] sm:text-xs">{languages.find(l => l.code === currentLanguage)?.label}</span>
                    <ChevronDown className="w-3 h-3 text-govText-muted" />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-36 sm:w-40 bg-white border border-govTeal-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn">
                      <div className="px-3 py-1 text-[10px] font-bold text-govText-muted uppercase tracking-wider border-b border-gray-100">
                        Select Language
                      </div>
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-govTeal-50 transition-colors ${currentLanguage === lang.code ? 'font-bold text-govTeal-700 bg-govTeal-50/60' : 'text-govText-primary'
                            }`}
                        >
                          <span>{lang.label}</span>
                          <span className="text-[10px] text-govText-muted">{lang.sub}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trainee Simulated e-KYC Modal Trigger (Hidden on tiny mobile < 420px) */}
                <button
                  onClick={() => setIsEkycOpen(true)}
                  className={`hidden min-[420px]:flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all cursor-pointer min-h-[36px] ${currentUser.isKycVerified
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                  title="Aadhaar e-KYC Verification Status"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-govTeal-600" />
                  <span className="hidden min-[480px]:inline">{currentUser.isKycVerified ? 'e-KYC Verified' : 'Verify e-KYC'}</span>
                  <span className={`w-2 h-2 rounded-full min-[480px]:hidden ${currentUser.isKycVerified ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                </button>

                {/* Interactive Notification Bell with Dropdown Panel */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-xl text-govTeal-900 hover:bg-govBg transition-colors flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px]"
                    title="Notifications"
                    aria-label={`View ${unreadNotificationsCount} notifications`}
                  >
                    <Bell className="w-4 h-4 text-govTeal-800" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="fixed inset-x-3 top-24 sm:top-auto sm:inset-x-auto sm:right-0 sm:absolute sm:mt-2 w-[calc(100vw-24px)] sm:w-96 max-w-sm sm:max-w-none bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-govBg/50">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-govText-primary">
                            {currentLanguage === 'hi' ? 'सूचनाएं' : currentLanguage === 'mr' ? 'सूचना' : 'Notifications'}
                          </span>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-govTeal-100 text-govTeal-800">
                              {unreadNotificationsCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] font-bold text-govTeal-700 hover:text-govTeal-900 flex items-center gap-1 transition-colors"
                          >
                            <CheckCheck className="w-3 h-3" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-govText-muted">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-3.5 flex items-start gap-3 hover:bg-govTeal-50/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-govTeal-50/20' : ''
                                }`}
                            >
                              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {getNotifIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className={`text-xs truncate ${!notif.isRead ? 'font-bold text-govText-primary' : 'font-medium text-govText-secondary'}`}>
                                    {notif.title}
                                  </p>
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-govTeal-600 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-govText-muted mt-0.5 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-govText-muted/80 block mt-1">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </header>
      </div>

      {/* Simulated e-KYC Modal */}
      <EkycModal isOpen={isEkycOpen} onClose={() => setIsEkycOpen(false)} />
    </>
  );
};

