import React, { useEffect } from 'react';
import { useApp, getRoleFromPrefix, getRolePrefix } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth & Public Views (Self-contained outside DashboardLayout)
import { LoginView } from './views/Auth/LoginView';
import { SignupView } from './views/Auth/SignupView';
import { ForgotPasswordView } from './views/Auth/ForgotPasswordView';
import { CertificateVerify } from './views/Public/CertificateVerify';
import { SkillCardPublic } from './views/Public/SkillCardPublic';

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
import { FacultyAttendanceView } from './views/Faculty/FacultyAttendanceView';
import { TraineeScanAttendanceView } from './views/Trainee/TraineeScanAttendanceView';
import { HostelTimetable } from './views/InstituteAdmin/HostelTimetable';
import { AcademicTimetable } from './views/InstituteAdmin/AcademicTimetable';
import { AdminProfileView } from './views/InstituteAdmin/AdminProfileView';
import { InstituteAnalytics } from './views/InstituteAdmin/InstituteAnalytics';

import { SuperAdminDashboard } from './views/SuperAdmin/SuperAdminDashboard';
import { SuperAdminAnalytics } from './views/SuperAdmin/SuperAdminAnalytics';
import { InstituteDetailView } from './views/SuperAdmin/InstituteDetailView';
import { UserManagementView } from './views/SuperAdmin/UserManagementView';
import { SuperAdminProfileView } from './views/SuperAdmin/SuperAdminProfileView';
import { FacultyDashboard } from './views/Faculty/FacultyDashboard';
import { FacultyCoursesView } from './views/Faculty/FacultyCoursesView';
import { CreateCourseView } from './views/Faculty/CreateCourseView';
import { CourseBuilder } from './views/Faculty/CourseBuilder';
import { FacultyProfileView } from './views/Faculty/FacultyProfileView';
import { EmployerDashboardView } from './views/Employer/EmployerDashboardView';
import { EmployerCandidatesView } from './views/Employer/EmployerCandidatesView';
import { EmployerJobsView } from './views/Employer/EmployerJobsView';
import { InstitutesDirectory } from './views/Common/InstitutesDirectory';
import { TraineeDirectory } from './views/Common/TraineeDirectory';
import { DeviceOperatorDashboard } from './views/DeviceOperator/DeviceOperatorDashboard';
import {
  HostelProvider,
  HostelAdminLayout,
  HostelOperationsHub,
  HostelBlocksPage,
  HostelRoomsPage,
  HostelRequestsPage,
  HostelAllocationsPage,
  HostelGatePage,
  HostelComplaintsPage,
  HostelMessPage
} from './views/HostelAdmin';
import { TraineeHostelView } from './views/Trainee/TraineeHostelView';

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

  // 1. Standalone Public Verification Routes (No dashboard shell)
  if (activeView === 'skill_card_public') {
    return <SkillCardPublic />;
  }

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
      case 'attendance_devices':
      case 'attendance_kiosk':
      case 'attendance':
        return <AttendanceKiosk />;
      case 'sessions':
        return <FacultyAttendanceView />;
      case 'hostel_timetable':
      case 'hostel':
        return <HostelTimetable />;
      case 'timetable':
        return <AcademicTimetable />;
      case 'analytics':
        return <InstituteAnalytics />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <AdminProfileView />;
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
      case 'attendance_history':
      case 'scan_attendance':
      case 'attendance':
        return <TraineeScanAttendanceView />;
      case 'attendance_kiosk':
        return <TraineeHome />;
      case 'trainee_hostel':
      case 'hostel':
      case 'hostel_pass':
        return <TraineeHostelView />;
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
        return <SuperAdminDashboard />;
      case 'analytics':
        return <SuperAdminAnalytics />;
      case 'institutes_directory':
        return <InstitutesDirectory />;
      case 'institute_detail':
        return <InstituteDetailView />;
      case 'users':
        return <UserManagementView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <SuperAdminProfileView />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  const renderFacultyView = () => {
    switch (activeView) {
      case 'home':
        return <FacultyDashboard />;
      case 'courses':
        return <FacultyCoursesView />;
      case 'course_new':
        return <CreateCourseView />;
      case 'course_builder':
        return <CourseBuilder />;
      case 'attendance':
      case 'faculty_attendance':
      case 'sessions':
        return <FacultyAttendanceView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <FacultyProfileView />;
      default:
        return <FacultyDashboard />;
    }
  };

  const renderEmployerView = () => {
    switch (activeView) {
      case 'home':
        return <EmployerDashboardView />;
      case 'trainee_directory':
        return <EmployerCandidatesView />;
      case 'jobs':
        return <EmployerJobsView />;
      case 'jobs_new':
        return <EmployerJobsView initialOpenNewModal={true} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <EmployerDashboardView />;
    }
  };

  const renderDeviceOperatorView = () => {
    switch (activeView) {
      case 'home':
        return <DeviceOperatorDashboard initialTab="dashboard" />;
      case 'device_monitoring':
        return <DeviceOperatorDashboard initialTab="monitoring" />;
      case 'device_fleet':
        return <DeviceOperatorDashboard initialTab="devices" />;
      case 'device_test':
        return <DeviceOperatorDashboard initialTab="test" />;
      case 'device_sync_queue':
        return <DeviceOperatorDashboard initialTab="sync" />;
      case 'device_incidents':
        return <DeviceOperatorDashboard initialTab="incidents" />;
      case 'device_maintenance':
        return <DeviceOperatorDashboard initialTab="incidents" />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DeviceOperatorDashboard initialTab="dashboard" />;
    }
  };

  const renderHostelAdminView = () => {
    let PageComponent: React.ReactNode;
    switch (activeView) {
      case 'home':
      case 'hostel_operations':
      case 'operations':
        PageComponent = <HostelOperationsHub />;
        break;
      case 'hostel_blocks':
      case 'blocks':
        PageComponent = <HostelBlocksPage />;
        break;
      case 'hostel_rooms':
      case 'rooms':
        PageComponent = <HostelRoomsPage />;
        break;
      case 'hostel_requests':
      case 'requests':
        PageComponent = <HostelRequestsPage />;
        break;
      case 'hostel_allocations':
      case 'allocations':
        PageComponent = <HostelAllocationsPage />;
        break;
      case 'hostel_checkin':
      case 'checkin':
      case 'gate':
        PageComponent = <HostelGatePage />;
        break;
      case 'hostel_complaints':
      case 'complaints':
      case 'maintenance':
        PageComponent = <HostelComplaintsPage />;
        break;
      case 'hostel_reports':
      case 'reports':
      case 'mess':
        PageComponent = <HostelMessPage />;
        break;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <AdminProfileView />;
      default:
        PageComponent = <HostelOperationsHub />;
        break;
    }

    return (
      <HostelProvider>
        <HostelAdminLayout>
          {PageComponent}
        </HostelAdminLayout>
      </HostelProvider>
    );
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
      case 'device_operator':
        return renderDeviceOperatorView();
      case 'hostel_admin':
        return renderHostelAdminView();
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
