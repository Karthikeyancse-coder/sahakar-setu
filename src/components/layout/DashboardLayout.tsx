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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-govBg text-govText-primary flex flex-col antialiased">
      {/* 1. Main Shell Wrapper (Sidebar + Main Column) */}
      <div className="flex flex-1 min-w-0 w-full lg:h-screen lg:overflow-hidden">
        {/* Left Persistent Desktop Sidebar - ONLY on Desktop (>= 1024px) */}
        <Sidebar />

        {/* Right Content Area: Header + Banner + Page Content (starts after 265px fixed sidebar on desktop) */}
        <div className="flex min-w-0 flex-1 flex-col w-full lg:pl-[265px] lg:h-screen lg:overflow-hidden">
          <DashboardHeader onOpenMobileDrawer={() => setIsMoreOpen(prev => !prev)} />
          <OfflineBanner />

          {/* Main Content Area: 100% width on mobile/tablet with safe area bottom padding, scrollable independently on desktop */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden lg:overflow-y-auto pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* 2. Floating Career Sahayak AI Chatbot Button & Panel (z-[950] / z-[1001]) */}
      <FloatingCareerChatbot />

      {/* 3. Mobile More Bottom Sheet (z-[920]) */}
      <MoreBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />

      {/* 4. Mobile Bottom Navigation for Trainees (z-[900]) */}
      <MobileBottomNav
        onOpenMore={() => setIsMoreOpen(prev => !prev)}
        isMoreOpen={isMoreOpen}
      />
    </div>
  );
};
