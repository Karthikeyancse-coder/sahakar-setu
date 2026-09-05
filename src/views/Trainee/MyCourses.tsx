import React, { useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const MyCourses: React.FC = () => {
  const { courses, enrollments, currentUser, currentLanguage, navigate, t } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Trainee enrollments
  const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);

  const enrolledCourseData = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const totalLessons = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 0;
    const completedCount = enrollment.completedLessonIds.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCompleted = progress >= 100;

    return {
      enrollment,
      course,
      totalLessons,
      completedCount,
      progress,
      isCompleted
    };
  }).filter(item => item.course !== undefined);

  const filteredData = enrolledCourseData.filter(item => {
    if (activeTab === 'in_progress') return !item.isCompleted;
    if (activeTab === 'completed') return item.isCompleted;
    return true;
  });

  return (
    <PageContainer>
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Trainee Learning Desk
            </span>
            <SimulatedBadge text="Progress Synchronized" />
          </div>
          <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
            {t.myCourses?.title || 'My Enrolled Courses'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1">
            {t.myCourses?.subtitle || 'Track your modular progress and resume your ongoing training sessions.'}
          </p>
        </div>

        <button
          onClick={() => navigate('courses')}
          className="px-4 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Compass className="w-4 h-4 text-saffron-300" />
          <span>{t.catalog?.title || 'Explore Catalog'}</span>
        </button>
      </div>

      {/* 2. Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-govTeal-700 text-white shadow-xs'
              : 'text-govText-secondary hover:bg-govBg'
          }`}
        >
          {t.myCourses?.tabs?.all || 'All Courses'} ({enrolledCourseData.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'in_progress'
              ? 'bg-govTeal-700 text-white shadow-xs'
              : 'text-govText-secondary hover:bg-govBg'
          }`}
        >
          {t.myCourses?.tabs?.inProgress || 'In Progress'} ({enrolledCourseData.filter(i => !i.isCompleted).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'completed'
              ? 'bg-govTeal-700 text-white shadow-xs'
              : 'text-govText-secondary hover:bg-govBg'
          }`}
        >
          {t.myCourses?.tabs?.completed || 'Completed'} ({enrolledCourseData.filter(i => i.isCompleted).length})
        </button>
      </div>

      {/* 3. Course Cards Grid */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-govText-border space-y-4">
          <BookOpen className="w-12 h-12 text-govTeal-400 mx-auto" />
          <h3 className="text-base font-bold text-govText-primary">
            {t.myCourses?.emptyTitle || 'No courses enrolled in this tab'}
          </h3>
          <p className="text-xs text-govText-secondary max-w-sm mx-auto">
            Explore national curriculum courses designed for Primary Agricultural Credit Societies and Dairy cooperatives.
          </p>
          <button
            onClick={() => navigate('courses')}
            className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse National Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map(({ course, completedCount, totalLessons, progress, isCompleted }) => {
            if (!course) return null;
            const title = currentLanguage === 'hi' ? course.titleHi : currentLanguage === 'mr' ? course.titleMr : course.title;
            const description = currentLanguage === 'hi' ? course.descriptionHi : currentLanguage === 'mr' ? course.descriptionMr : course.description;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-govText-border shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                        {course.level}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-govText-muted">
                      <span className="font-bold text-govTeal-700 uppercase">{course.category}</span>
                      <span>{course.durationHours} Hours</span>
                    </div>

                    <h3 className="font-bold text-sm text-govText-primary line-clamp-1">
                      {title}
                    </h3>

                    <p className="text-xs text-govText-secondary line-clamp-2 leading-relaxed">
                      {description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-govText-secondary font-medium">
                          {completedCount} of {totalLessons} lessons
                        </span>
                        <span className="font-bold text-govTeal-800">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-600' : 'bg-govTeal-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 border-t border-gray-100 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => navigate('course_player', { courseId: course.id })}
                    className="flex-1 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{isCompleted ? 'Review Content' : (t.myCourses?.resume || 'Resume Learning')}</span>
                  </button>

                  {isCompleted && (
                    <button
                      onClick={() => navigate('certificates')}
                      className="px-3 py-2.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      title="View Certificate"
                    >
                      <Award className="w-4 h-4 text-saffron-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};
