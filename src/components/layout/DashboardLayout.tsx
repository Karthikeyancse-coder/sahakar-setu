import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { MoreBottomSheet } from './MoreBottomSheet';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineBanner } from '../common/OfflineBanner';
import { FloatingCareerChatbot } from '../common/FloatingCareerChatbot';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-govBg text-govText-primary flex flex-col antialiased">
      {/* 1. Main Shell Wrapper (Sidebar + Main Column) */}
      <div className="flex flex-1 min-w-0 w-full">
        {/* Left Persistent Desktop Sidebar - ONLY on Desktop (>= 1024px) */}
        <Sidebar />

        {/* Right Content Area: Header + Banner + Page Content */}
        <div className="flex min-w-0 flex-1 flex-col w-full">
          <DashboardHeader onOpenMobileDrawer={() => setIsMoreOpen(prev => !prev)} />
          <OfflineBanner />

          {/* Main Content Area: 100% width on mobile/tablet with safe area bottom padding */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* 2. Floating Career Sahayak AI Chatbot Button & Panel (z-70 / z-80) */}
      <FloatingCareerChatbot />

      {/* 3. Mobile More Bottom Sheet (z-50) */}
      <MoreBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />

      {/* 4. Mobile Bottom Navigation for Trainees (z-60) */}
      <MobileBottomNav
        onOpenMore={() => setIsMoreOpen(prev => !prev)}
        isMoreOpen={isMoreOpen}
      />
    </div>
  );
};
