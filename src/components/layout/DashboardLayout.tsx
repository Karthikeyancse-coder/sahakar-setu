import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineBanner } from '../common/OfflineBanner';
import { FloatingCareerChatbot } from '../common/FloatingCareerChatbot';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-govBg text-govText-primary flex flex-col antialiased">
      {/* 1. Main Shell Wrapper (Sidebar + Main Column) */}
      <div className="flex flex-1 min-w-0 w-full">
        {/* Left Persistent Desktop Sidebar */}
        <Sidebar />

        {/* Right Content Area: Header + Banner + Page Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />
          <OfflineBanner />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden pb-24 lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* 2. Floating Career Sahayak AI Chatbot Button & Panel */}
      <FloatingCareerChatbot />

      {/* 3. Mobile Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* 4. Mobile Bottom Navigation for Trainees */}
      <MobileBottomNav />
    </div>
  );
};
