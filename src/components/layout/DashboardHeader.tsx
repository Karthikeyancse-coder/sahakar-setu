import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { EkycModal } from '../common/EkycModal';

interface DashboardHeaderProps {
  onOpenMobileDrawer: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMobileDrawer }) => {
  const {
    currentUser,
    currentLanguage,
    setLanguage,
    navigate,
    isOffline,
    toggleOfflineMode,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isEkycOpen, setIsEkycOpen] = useState(false);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'National' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  ];

  return (
    <>
      {/* 1. Subtle Government Civic Top Bar */}
      <div className="bg-govTeal-950 text-govTeal-100 text-[11px] py-1 px-4 border-b border-govTeal-900 select-none">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-devanagari">भारत सरकार</span>
            <span className="opacity-40">|</span>
            <span>Government of India</span>
            <span className="text-govTeal-400 hidden sm:inline">•</span>
            <span className="text-saffron-300 hidden sm:inline">सहकारिता मंत्रालय (Ministry of Cooperation)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline opacity-75">राष्ट्रीय सहकारी प्रशिक्षण परिषद (NCCT)</span>
            <button
              onClick={() => navigate('verify_public', { certId: 'NCCT-CERT-2026-VAM-0089' })}
              className="hover:text-white underline flex items-center gap-1 text-saffron-300 font-semibold"
            >
              <QrCode className="w-3 h-3" />
              <span>Verify Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Application Header */}
      <header className="bg-white border-b border-govText-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Mobile Drawer Trigger & Quick Search */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger button */}
              <button
                onClick={onOpenMobileDrawer}
                className="lg:hidden p-2 rounded-xl text-govText-secondary hover:bg-govBg hover:text-govTeal-800 transition-colors"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Brand indicator (when sidebar is hidden) */}
              <div className="lg:hidden flex items-center gap-2" onClick={() => navigate('home')}>
                <div className="w-8 h-8 rounded-lg bg-govTeal-700 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4 text-saffron-300" />
                </div>
                <span className="font-extrabold text-sm text-govTeal-800 font-devanagari">
                  सहकार सेतु
                </span>
              </div>

              {/* Desktop Global Search Input */}
              <div className="hidden sm:flex items-center relative w-64 md:w-80">
                <input
                  type="text"
                  placeholder="Search programmes, courses, circulars..."
                  className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white transition-all"
                />
                <Search className="w-3.5 h-3.5 text-govText-muted absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Right: Actions, Language, Demo Account, User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Offline Status Toggle */}
              <button
                onClick={toggleOfflineMode}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isOffline
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Click to toggle offline mode simulation"
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span className="hidden sm:inline">Offline Mode</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Online Sync</span>
                  </>
                )}
              </button>

              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-govText-border bg-govBg hover:bg-white text-xs font-semibold text-govText-primary flex items-center gap-1.5 shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-govTeal-600" />
                  <span>{languages.find(l => l.code === currentLanguage)?.label}</span>
                  <ChevronDown className="w-3 h-3 text-govText-muted" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-40 bg-white border border-govTeal-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn">
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
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-govTeal-50 transition-colors ${
                          currentLanguage === lang.code ? 'font-bold text-govTeal-700 bg-govTeal-50/60' : 'text-govText-primary'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] text-govText-muted">{lang.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Trainee Simulated e-KYC Modal Trigger */}
              <button
                onClick={() => setIsEkycOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  currentUser.isKycVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title="Aadhaar e-KYC Verification Status"
              >
                <Fingerprint className="w-3.5 h-3.5 text-govTeal-600" />
                <span>{currentUser.isKycVerified ? 'e-KYC Verified' : 'Verify e-KYC'}</span>
              </button>

              {/* Notification Bell with Badge */}
              <button
                className="relative p-2 rounded-xl text-govTeal-900 hover:bg-govBg transition-colors flex items-center justify-center cursor-pointer"
                title="Notifications"
                aria-label="View 3 notifications"
              >
                <Bell className="w-4 h-4 text-govTeal-800" />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  3
                </span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Simulated e-KYC Modal */}
      <EkycModal isOpen={isEkycOpen} onClose={() => setIsEkycOpen(false)} />
    </>
  );
};
