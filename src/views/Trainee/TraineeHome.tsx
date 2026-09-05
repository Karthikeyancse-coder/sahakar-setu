import React from 'react';
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Briefcase,
  Download,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { CourseCard } from '../../components/common/CourseCard';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { downloadCertificatePdf } from '../../utils/certificateGenerator';

export const TraineeHome: React.FC = () => {
  const {
    currentUser,
    courses,
    enrollments,
    certificates,
    sessions,
    attendance,
    jobs,
    navigate,
    t,
    currentLanguage
  } = useApp();

  const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
  const userCertificates = certificates.filter(c => c.userId === currentUser.id);
  const nextSession = sessions[0];
  const isAttendedToday = attendance.some(a => a.userId === currentUser.id && a.sessionId === nextSession?.id);

  // Active in-progress course for quick continue
  const activeEnrollment = userEnrollments.find(e => e.status === 'in_progress') || userEnrollments[0];
  const activeCourse = courses.find(c => c.id === activeEnrollment?.courseId) || courses[0];

  return (
    <PageContainer>
      
      {/* 1. Hero Welcome Banner (Target height: ~220px desktop, clean and restrained) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-govTeal-700 via-govTeal-800 to-govTeal-900 text-white p-6 sm:p-7 shadow-md border border-govTeal-600/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md rounded-md text-[11px] font-bold text-saffron-300">
              NCCT Trainee Portal
            </span>
            <SimulatedBadge text="Federated ERP Active" className="bg-white/10 text-amber-200 border-white/20 text-[10px] py-0.5" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-devanagari">
              {currentLanguage === 'hi'
                ? `नमस्ते, ${currentUser.name}`
                : currentLanguage === 'mr'
                ? `नमस्कार, ${currentUser.name}`
                : `Welcome, ${currentUser.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-govTeal-100 mt-1 leading-relaxed">
              {currentUser.cooperativeAffiliation || 'Primary Agricultural Credit Society (PACS) Member'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-saffron-200 font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{userEnrollments.length} Active Courses</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-emerald-200 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{userCertificates.length} Verified Credentials</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={() => navigate('course_view', { courseId: activeCourse.id })}
                className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1.5"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-career-bot'))}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-saffron-300" />
                <span>Ask Career Sahayak</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Priority Action Grid: Upcoming Class Session & Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Scheduled Training Session (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-govTeal-600" />
              <h2 className="font-bold text-sm sm:text-base text-govText-primary">
                {t.attendance.activeSession}
              </h2>
            </div>
            {isAttendedToday ? (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Attendance Logged</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full animate-pulse">
                Check-in Open
              </span>
            )}
          </div>

          {nextSession ? (
            <div className="bg-govBg rounded-xl p-4 border border-govTeal-100 space-y-3">
              <h3 className="font-bold text-sm text-govText-primary leading-snug">
                {nextSession.title}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-govText-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-govTeal-600" />
                  <span>{nextSession.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-govTeal-600" />
                  <span className="truncate">{nextSession.room}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-govText-secondary">
                  Instructor: <strong className="text-govText-primary">{nextSession.instructor}</strong>
                </span>

                <button
                  onClick={() => navigate('attendance_kiosk')}
                  className="px-3.5 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-saffron-300" />
                  <span>Scan QR / Face Kiosk Check-in</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-govText-muted">No scheduled sessions today.</p>
          )}
        </div>

        {/* Verifiable Credentials Quick Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-govTeal-800 bg-govTeal-50 px-2 py-0.5 rounded border border-govTeal-200 font-mono">
                {userCertificates.length} Issued
              </span>
            </div>
            <h2 className="font-bold text-sm sm:text-base text-govText-primary">
              Verifiable Digital Credentials
            </h2>
            <p className="text-xs text-govText-secondary leading-relaxed">
              Your certificates are cryptographically signed and publicly verifiable via DigiLocker / NAD protocol prototypes.
            </p>
          </div>

          {userCertificates.length > 0 ? (
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-govText-primary truncate">
                {userCertificates[0].courseTitle}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadCertificatePdf(userCertificates[0])}
                  className="flex-1 py-2 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => navigate('verify_public', { certId: userCertificates[0].id })}
                  className="px-3 py-2 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 text-xs font-bold rounded-xl border border-saffron-200"
                >
                  Verify
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-govText-muted bg-govBg p-3 rounded-xl text-center">
              Complete a course assessment to earn your digital certificate.
            </div>
          )}
        </div>

      </div>

      {/* 3. Courses Grid (Using robust CourseCard with 16:9 media & fallback) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-govText-primary">
              {t.nav.courses}
            </h2>
            <p className="text-xs text-govText-secondary">
              National modular curriculum with instant multilingual assessment
            </p>
          </div>
          <button
            onClick={() => navigate('courses')}
            className="text-xs font-bold text-govTeal-700 hover:text-govTeal-900 flex items-center gap-1"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Cards per row desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => {
            const enrollment = enrollments.find(
              e => e.userId === currentUser.id && e.courseId === course.id
            );

            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollment}
                currentLanguage={currentLanguage}
                onSelect={(id) => navigate('course_view', { courseId: id })}
                continueLabel={t.lms.continueLesson}
                startLabel={t.lms.startLesson}
              />
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Row: Cooperative Job Opportunities & Career Sahayak Teasers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Job Opportunities Teaser */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-saffron-600" />
              <h3 className="font-bold text-sm sm:text-base text-govText-primary">
                Cooperative Recruiter Openings
              </h3>
            </div>
            <p className="text-xs text-govText-secondary leading-relaxed">
              Explore live hiring opportunities from AMUL, IFFCO, and State Cooperative Apex Banks for certified trainees.
            </p>
          </div>

          <div className="space-y-2">
            {jobs.slice(0, 2).map(job => (
              <div
                key={job.id}
                className="p-3 bg-govBg rounded-xl border border-gray-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-govText-primary">{job.title}</p>
                  <p className="text-[11px] text-govTeal-800">{job.employerName} • {job.location}</p>
                </div>
                <span className="font-bold text-govTeal-700">{job.salaryRange}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('jobs')}
            className="w-full py-2 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Browse All {jobs.length} Cooperative Openings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Career Sahayak Teaser */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-govTeal-600" />
              <h3 className="font-bold text-sm sm:text-base text-govText-primary">
                Sahakar Sahayak (AI Advisory)
              </h3>
            </div>
            <p className="text-xs text-govText-secondary leading-relaxed">
              Ask questions about PACS computerization roles, Dairy AMCS standards, or SHG credit linkage in English, Hindi, or Marathi.
            </p>
          </div>

          <div className="bg-govBg rounded-xl p-4 border border-govTeal-100 space-y-2">
            <p className="text-xs font-semibold text-govTeal-900">
              "How to qualify as an Automatic Milk Collection Station (AMCS) Officer?"
            </p>
            <p className="text-[11px] text-govText-secondary leading-relaxed">
              Complete the Dairy Cold Chain course and pass the module assessment with ≥80% score to receive verified certification.
            </p>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-career-bot'))}
            className="w-full py-2 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 text-xs font-bold rounded-xl border border-saffron-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Chat with AI Career Advisor</span>
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
          </button>
        </div>

      </div>

    </PageContainer>
  );
};
