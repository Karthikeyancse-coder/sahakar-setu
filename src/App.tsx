import React from 'react';
import { useApp } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth & Public Views (Self-contained outside DashboardLayout)
import { LoginView } from './views/Auth/LoginView';
import { SignupView } from './views/Auth/SignupView';
import { ForgotPasswordView } from './views/Auth/ForgotPasswordView';
import { CertificateVerify } from './views/Public/CertificateVerify';

// Authenticated Views (Rendered inside DashboardLayout)
import { TraineeHome } from './views/Trainee/TraineeHome';
import { CourseViewer } from './views/Trainee/CourseViewer';
import { MyCertificates } from './views/Trainee/MyCertificates';
import { JobOpportunities } from './views/Trainee/JobOpportunities';
import { CareerChatbot } from './views/Trainee/CareerChatbot';

import { AdminDashboard } from './views/InstituteAdmin/AdminDashboard';
import { ProgrammesManagement } from './views/InstituteAdmin/ProgrammesManagement';
import { AttendanceKiosk } from './views/InstituteAdmin/AttendanceKiosk';
import { HostelTimetable } from './views/InstituteAdmin/HostelTimetable';

import { SuperAdminDashboard } from './views/SuperAdmin/SuperAdminDashboard';
import { CourseBuilder } from './views/Faculty/CourseBuilder';
import { EmployerPortal } from './views/Employer/EmployerPortal';
import { InstitutesDirectory } from './views/Common/InstitutesDirectory';
import { TraineeDirectory } from './views/Common/TraineeDirectory';

export const AppContent: React.FC = () => {
  const { currentUser, activeView, isAuthenticated } = useApp();

  // 1. Standalone Public Verification Route (No dashboard shell)
  if (activeView === 'verify_public') {
    return <CertificateVerify />;
  }

  // 2. Dedicated Authentication Routes (No dashboard shell)
  if (activeView === 'login') {
    return <LoginView />;
  }

  if (activeView === 'signup') {
    return <SignupView />;
  }

  if (activeView === 'forgot_password') {
    return <ForgotPasswordView />;
  }

  // 3. Protected Dashboard Gate: If not authenticated, render Login at root '/'
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 4. Render authenticated view content based on role & active view ID
  const renderMainView = () => {
    switch (activeView) {
      case 'home':
        if (currentUser.role === 'trainee') return <TraineeHome />;
        if (currentUser.role === 'institute_admin') return <AdminDashboard />;
        if (currentUser.role === 'super_admin') return <SuperAdminDashboard />;
        if (currentUser.role === 'faculty') return <CourseBuilder />;
        if (currentUser.role === 'employer') return <EmployerPortal />;
        return <TraineeHome />;

      case 'courses':
        return <TraineeHome />;

      case 'course_view':
        return <CourseViewer />;

      case 'certificates':
        return <MyCertificates />;

      case 'jobs':
        return currentUser.role === 'employer' ? <EmployerPortal /> : <JobOpportunities />;

      case 'career_bot':
        return <CareerChatbot />;

      case 'attendance_kiosk':
        return <AttendanceKiosk />;

      case 'programmes_erp':
        return <ProgrammesManagement />;

      case 'hostel_timetable':
        return <HostelTimetable />;

      case 'institutes_directory':
        return <InstitutesDirectory />;

      case 'trainee_directory':
        return <TraineeDirectory />;

      case 'course_builder':
        return <CourseBuilder />;

      case 'analytics':
        return <SuperAdminDashboard />;

      default:
        return <TraineeHome />;
    }
  };

  // 4. Authenticated Application Shell (Fixed 272px sidebar, stable header, responsive main content)
  return (
    <DashboardLayout>
      {renderMainView()}
    </DashboardLayout>
  );
};

export default AppContent;
