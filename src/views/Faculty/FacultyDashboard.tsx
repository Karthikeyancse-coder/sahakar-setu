import React from 'react';
import {
  BookOpen,
  Edit3,
  Users,
  Award,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  QrCode,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const FacultyDashboard: React.FC = () => {
  const { currentUser, courses, sessions, timetable, navigate, currentLanguage } = useApp();

  // Instructor name to filter by
  const facultyName = currentUser?.name || 'Prof. Meenakshi Sundaram';

  // Seeded/Authored courses for faculty
  const facultyCourses = courses.slice(0, 3);

  // Filter sessions where instructor matches faculty
  const instructingSessions = sessions.filter(s =>
    s.instructor?.toLowerCase().includes('meenakshi') ||
    s.instructor?.toLowerCase() === facultyName.toLowerCase()
  );

  // Filter timetable slots where facultyName matches
  const instructingTimetable = timetable.filter(t =>
    t.facultyName?.toLowerCase().includes('meenakshi') ||
    t.facultyName?.toLowerCase() === facultyName.toLowerCase()
  );

  // Aggregated realistic metrics
  const totalCourses = facultyCourses.length;
  const totalTrainees = 1280;
  const avgCompletionRate = 88.5;
  const avgQuizPassRate = 94.2;

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
        {/* 1. Welcome Banner (Deep Teal Government Visual Language) */}
        <div className="bg-gradient-to-r from-govTeal-900 via-govTeal-800 to-govTeal-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-govTeal-600 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-md text-xs font-bold text-saffron-300">
                NCCT Faculty & Curriculum Directorate
              </span>
              <SimulatedBadge text="VAMNICOM Apex Academic Node" className="bg-white/10 text-amber-200 border-white/20" />
            </div>
            <span className="text-xs text-govTeal-100 font-mono">
              Academic Term 2025–26 • Semester II
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {facultyName}
              </h1>
              <p className="text-sm text-govTeal-100 flex items-center gap-2 flex-wrap">
                <GraduationCap className="w-4 h-4 text-saffron-300 flex-shrink-0" />
                <span>Senior Faculty, Dept. of Cooperative IT & Rural Management</span>
                <span className="text-govTeal-300 hidden sm:inline">•</span>
                <span className="text-amber-200 font-medium">VAMNICOM, Pune</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/faculty/courses/crs-pacs-erp-101/edit')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-govTeal-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Edit3 className="w-4 h-4 text-govTeal-950" />
                <span>Go to Course Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Headline Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Courses Authored */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Courses Authored</span>
              <div className="w-9 h-9 rounded-xl bg-govTeal-50 flex items-center justify-center text-govTeal-700">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {totalCourses}
            </p>
            <p className="text-[11px] text-govTeal-800 font-semibold flex items-center gap-1">
              <span>National Accredited Modules</span>
            </p>
          </div>

          {/* Card 2: Total Enrolled Trainees */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Trainees</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {totalTrainees.toLocaleString()}
            </p>
            <p className="text-[11px] text-blue-800 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Across all 20 NCCT Nodes</span>
            </p>
          </div>

          {/* Card 3: Average Completion Rate */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Avg. Completion Rate</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {avgCompletionRate}%
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>+4.2% MoM completion pace</span>
            </p>
          </div>

          {/* Card 4: Average Quiz Pass Rate */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Quiz Pass Rate</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {avgQuizPassRate}%
            </p>
            <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
              <span>75% Minimum Passing Benchmark</span>
            </p>
          </div>
        </div>

        {/* 3. Upcoming Sessions I'm Instructing */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-govText-primary flex items-center gap-2">
                <Clock className="w-5 h-5 text-govTeal-600" />
                Upcoming Sessions I'm Instructing
              </h2>
              <p className="text-xs text-govText-secondary mt-0.5">
                Live practical lab lectures and weekly scheduled timetable sessions assigned to {facultyName}.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-govTeal-50 text-govTeal-900 border border-govTeal-200 self-start sm:self-auto">
              {instructingSessions.length + instructingTimetable.length} Sessions Assigned
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary Live / Today Session from Sessions seed data */}
            {instructingSessions.map(session => (
              <div
                key={session.id}
                className="bg-[#FBFDFB] rounded-xl p-4 border border-emerald-300/80 shadow-2xs hover:border-govTeal-500 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-govTeal-600" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Live Laboratory Session
                    </span>
                    <span className="text-[11px] font-mono font-bold text-govTeal-800">
                      {session.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-govText-primary leading-snug">
                    {session.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-govText-secondary pt-1">
                    <div className="flex items-center gap-2 text-govTeal-900 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-govTeal-600 flex-shrink-0" />
                      <span>{session.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-govTeal-600 flex-shrink-0" />
                      <span className="truncate">{session.room}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-govText-muted">Instructor: <strong className="text-govText-primary">{session.instructor}</strong></span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <QrCode className="w-3.5 h-3.5" />
                    Kiosk Active
                  </span>
                </div>
              </div>
            ))}

            {/* Timetable scheduled sessions */}
            {instructingTimetable.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-govTeal-400 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                      {item.day} Schedule
                    </span>
                    <span className="text-[11px] font-bold text-govText-secondary">
                      {item.timeSlot}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-govText-primary leading-snug">
                    {item.subject}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-govText-secondary">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{item.venue}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-govText-muted">Programme: <strong className="text-govText-primary">PACS ERP Exec</strong></span>
                  <span className="text-[11px] font-semibold text-govTeal-700">Scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. "My Courses" Preview Section */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-govText-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-govTeal-600" />
                My Authored Courses Preview
              </h2>
              <p className="text-xs text-govText-secondary mt-0.5">
                Active modular LMS curriculum authored and maintained by your faculty account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/faculty/courses')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-govTeal-700 hover:text-govTeal-900 hover:underline cursor-pointer"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facultyCourses.map((course, idx) => {
              // Deterministic stats per course
              const enrolled = idx === 0 ? 540 : idx === 1 ? 460 : 280;
              const compRate = idx === 0 ? 92 : idx === 1 ? 86 : 87;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-govText-border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Course Thumbnail */}
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                          {course.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-govTeal-700 text-white">
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-govText-primary shadow-xs">
                        {course.durationHours} Hours
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-govText-primary leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-govText-secondary font-devanagari mt-1 line-clamp-1">
                          {course.titleHi}
                        </p>
                      </div>

                      {/* Enrolled and Completion Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-govBg p-2.5 rounded-lg border border-gray-100">
                        <div>
                          <span className="text-[10px] text-govText-muted block">Enrolled Trainees</span>
                          <span className="font-bold text-govText-primary">{enrolled}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-govText-muted block">Completion Rate</span>
                          <span className="font-bold text-emerald-700">{compRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/faculty/courses/${course.id}/edit`)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 transition-colors cursor-pointer active:scale-98 min-h-[40px]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Manage Course in Studio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
