import React, { useEffect } from 'react';
import { useApp, getRoleFromPrefix, getRolePrefix } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth & Public Views (Self-contained outside DashboardLayout)
import { LoginView } from './views/Auth/LoginView';
import { SignupView } from './views/Auth/SignupView';
import { ForgotPasswordView } from './views/Auth/ForgotPasswordView';
import { CertificateVerify } from './views/Public/CertificateVerify';

// Authenticated Views (Rendered inside DashboardLayout)
import { TraineeHome } from './views/Trainee/TraineeHome';
import { CourseViewer } from './views/Trainee/CourseViewer';
import { CourseCatalog } from './views/Trainee/CourseCatalog';
import { CourseDetail } from './views/Trainee/CourseDetail';
import { MyCourses } from './views/Trainee/MyCourses';
import { CoursePlayer } from './views/Trainee/CoursePlayer';
import { QuizView } from './views/Trainee/QuizView';
import { MyCertificates } from './views/Trainee/MyCertificates';
import { JobOpportunities } from './views/Trainee/JobOpportunities';
import { JobDetail } from './views/Trainee/JobDetail';
import { MyApplications } from './views/Trainee/MyApplications';
import { CareerChatbot } from './views/Trainee/CareerChatbot';
import { CareerChatView } from './views/Trainee/CareerChatView';
import { ProfileView } from './views/Trainee/ProfileView';
import { SettingsView } from './views/Trainee/SettingsView';
import { HelpSupportView } from './views/Trainee/HelpSupportView';

import { AdminDashboard } from './views/InstituteAdmin/AdminDashboard';
import { ProgrammesManagement } from './views/InstituteAdmin/ProgrammesManagement';
import { NominationsManagement } from './views/InstituteAdmin/NominationsManagement';
import { AttendanceKiosk } from './views/InstituteAdmin/AttendanceKiosk';
import { HostelTimetable } from './views/InstituteAdmin/HostelTimetable';
import { AcademicTimetable } from './views/InstituteAdmin/AcademicTimetable';

import { SuperAdminDashboard } from './views/SuperAdmin/SuperAdminDashboard';
import { CourseBuilder } from './views/Faculty/CourseBuilder';
import { EmployerPortal } from './views/Employer/EmployerPortal';
import { InstitutesDirectory } from './views/Common/InstitutesDirectory';
import { TraineeDirectory } from './views/Common/TraineeDirectory';

export const AppContent: React.FC = () => {
  const { currentUser, activeView, isAuthenticated, navigate } = useApp();

  // Route Guard: Ensure current pathname matches logged-in user's role prefix
  useEffect(() => {
    if (!isAuthenticated) return;
    const currentPath = window.location.pathname;
    const pathRole = getRoleFromPrefix(currentPath);
    if (pathRole && pathRole !== currentUser.role) {
      navigate(`/${getRolePrefix(currentUser.role)}/dashboard`);
    }
  }, [currentUser.role, isAuthenticated, activeView, navigate]);

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

  // 4. Role-isolated view renderers (strictly isolates components across roles)
  const renderInstituteAdminView = () => {
    switch (activeView) {
      case 'home':
        return <AdminDashboard />;
      case 'programmes_erp':
        return <ProgrammesManagement />;
      case 'nominations':
        return <NominationsManagement />;
      case 'trainee_directory':
        return <TraineeDirectory />;
      case 'attendance_kiosk':
      case 'attendance':
      case 'sessions':
        return <AttendanceKiosk />;
      case 'hostel_timetable':
      case 'hostel':
        return <HostelTimetable />;
      case 'timetable':
        return <AcademicTimetable />;
      case 'analytics':
        return <AdminDashboard />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderTraineeView = () => {
    switch (activeView) {
      case 'home':
        return <TraineeHome />;
      case 'courses':
        return <CourseCatalog />;
      case 'course_detail':
        return <CourseDetail />;
      case 'my_courses':
        return <MyCourses />;
      case 'course_player':
      case 'course_view':
        return <CoursePlayer />;
      case 'quiz':
        return <QuizView />;
      case 'certificates':
        return <MyCertificates />;
      case 'jobs':
        return <JobOpportunities />;
      case 'job_detail':
        return <JobDetail />;
      case 'my_applications':
        return <MyApplications />;
      case 'career_chat':
      case 'career_bot':
        return <CareerChatView />;
      case 'attendance':
      case 'attendance_kiosk':
        return <AttendanceKiosk />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpSupportView />;
      default:
        return <TraineeHome />;
    }
  };

  const renderSuperAdminView = () => {
    switch (activeView) {
      case 'home':
      case 'analytics':
        return <SuperAdminDashboard />;
      case 'institutes_directory':
        return <InstitutesDirectory />;
      case 'settings':
        return <SettingsView />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  const renderFacultyView = () => {
    switch (activeView) {
      case 'home':
      case 'course_builder':
        return <CourseBuilder />;
      case 'courses':
        return <CourseCatalog />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CourseBuilder />;
    }
  };

  const renderEmployerView = () => {
    switch (activeView) {
      case 'home':
      case 'jobs':
      case 'jobs_new':
        return <EmployerPortal />;
      case 'trainee_directory':
        return <TraineeDirectory />;
      case 'settings':
        return <SettingsView />;
      default:
        return <EmployerPortal />;
    }
  };

  const renderMainView = () => {
    switch (currentUser.role) {
      case 'institute_admin':
        return renderInstituteAdminView();
      case 'super_admin':
        return renderSuperAdminView();
      case 'faculty':
        return renderFacultyView();
      case 'employer':
        return renderEmployerView();
      case 'trainee':
      default:
        return renderTraineeView();
    }
  };

  // 5. Authenticated Application Shell (Fixed sidebar, sticky header, responsive main content)
  return (
    <DashboardLayout>
      {renderMainView()}
    </DashboardLayout>
  );
};

export default AppContent;
