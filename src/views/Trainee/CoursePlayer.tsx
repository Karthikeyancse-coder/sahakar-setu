import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Globe,
  Sparkles,
  Download,
  FileText,
  Menu,
  X,
  Volume2,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, Lesson, CourseModule } from '../../types';

export const CoursePlayer: React.FC = () => {
  const {
    courses,
    enrollments,
    currentUser,
    activeViewParams,
    navigate,
    markLessonComplete,
    currentLanguage,
    t
  } = useApp();

  const courseId = activeViewParams?.courseId || courses[0]?.id;
  const course = courses.find(c => c.id === courseId) || courses[0];
  const enrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id);

  const [activeModIdx, setActiveModIdx] = useState(0);
  const [activeLesIdx, setActiveLesIdx] = useState(0);
  const [contentLang, setContentLang] = useState<Language>(currentLanguage);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setContentLang(currentLanguage);
  }, [currentLanguage]);

  const currentModule: CourseModule | undefined = course?.modules[activeModIdx] || course?.modules[0];
  const currentLesson: Lesson | undefined = currentModule?.lessons[activeLesIdx] || currentModule?.lessons[0];

  const totalLessons = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 0;
  const completedLessons = enrollment?.completedLessonIds || [];
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isCurrentCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

  const isFirstLesson = activeModIdx === 0 && activeLesIdx === 0;
  const isLastLessonInModule = currentModule ? activeLesIdx === currentModule.lessons.length - 1 : false;
  const isLastLessonInCourse = course ? activeModIdx === course.modules.length - 1 && isLastLessonInModule : false;

  const handleSelectLesson = (modIdx: number, lesIdx: number) => {
    setActiveModIdx(modIdx);
    setActiveLesIdx(lesIdx);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handlePreviousLesson = () => {
    if (activeLesIdx > 0) {
      setActiveLesIdx(prev => prev - 1);
    } else if (activeModIdx > 0) {
      const prevMod = course.modules[activeModIdx - 1];
      setActiveModIdx(prev => prev - 1);
      setActiveLesIdx(prevMod.lessons.length - 1);
    }
  };

  const handleCompleteAndNext = () => {
    if (currentLesson) {
      markLessonComplete(course.id, currentLesson.id);
    }

    if (!isLastLessonInModule) {
      setActiveLesIdx(prev => prev + 1);
    } else if (currentModule?.quiz) {
      navigate('quiz', { courseId: course.id, moduleId: currentModule.id });
    } else if (activeModIdx < course.modules.length - 1) {
      setActiveModIdx(prev => prev + 1);
      setActiveLesIdx(0);
    }
  };

  const lessonTitle = contentLang === 'hi' ? currentLesson?.titleHi : contentLang === 'mr' ? currentLesson?.titleMr : currentLesson?.title || '';
  const lessonContent = currentLesson?.contentByLanguage[contentLang]?.text || currentLesson?.contentByLanguage?.en?.text || '';
  const courseTitle = contentLang === 'hi' ? course?.titleHi : contentLang === 'mr' ? course?.titleMr : course?.title || '';
  const moduleTitle = contentLang === 'hi' ? currentModule?.titleHi : contentLang === 'mr' ? currentModule?.titleMr : currentModule?.title || '';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      
      {/* 1. LMS Top Navbar */}
      <div className="bg-govTeal-950 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-govTeal-900 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('course_detail', { courseId: course.id })}
            className="p-1.5 rounded-lg text-govTeal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Back to course overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
              {courseTitle}
            </p>
            <p className="text-[10px] text-saffron-300 truncate">
              Module {activeModIdx + 1}: {moduleTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Content Language Switcher */}
          <div className="flex items-center bg-govTeal-900/80 rounded-lg p-0.5 border border-govTeal-800 text-[11px]">
            <button
              onClick={() => setContentLang('en')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                contentLang === 'en' ? 'bg-govTeal-600 text-white shadow-xs' : 'text-govTeal-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setContentLang('hi')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                contentLang === 'hi' ? 'bg-govTeal-600 text-white shadow-xs' : 'text-govTeal-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setContentLang('mr')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                contentLang === 'mr' ? 'bg-govTeal-600 text-white shadow-xs' : 'text-govTeal-300 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-govTeal-300 font-semibold">{progressPercent}%</span>
            <div className="w-20 bg-govTeal-900 h-2 rounded-full overflow-hidden border border-govTeal-800">
              <div
                className="bg-saffron-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-govTeal-200 hover:text-white hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
            title="Toggle Curriculum Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Mobile Backdrop Overlay for Curriculum Drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs animate-fadeIn"
          />
        )}

        {/* Left Lesson Navigation Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-40 w-80 max-w-[85vw] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-7.5rem)] shadow-xl lg:shadow-none`}
        >
          <div className="p-4 border-b border-gray-100 bg-govBg/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-govTeal-700" />
              <span className="text-xs font-bold text-govText-primary uppercase tracking-wider">
                {t.courseDetail?.syllabus || 'Course Curriculum'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-govTeal-800 bg-govTeal-100 px-2 py-0.5 rounded-md">
              {completedCount}/{totalLessons} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {course.modules.map((module, mIdx) => {
              const mTitle = contentLang === 'hi' ? module.titleHi : contentLang === 'mr' ? module.titleMr : module.title;
              const isModActive = activeModIdx === mIdx;

              return (
                <div key={module.id} className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-govTeal-900 flex items-center justify-between">
                    <span className="truncate">Module {mIdx + 1}: {mTitle}</span>
                  </div>

                  <div className="space-y-0.5">
                    {module.lessons.map((lesson, lIdx) => {
                      const isLesActive = isModActive && activeLesIdx === lIdx;
                      const isDone = completedLessons.includes(lesson.id);
                      const lTitle = contentLang === 'hi' ? lesson.titleHi : contentLang === 'mr' ? lesson.titleMr : lesson.title;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(mIdx, lIdx)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isLesActive
                              ? 'bg-govTeal-700 text-white font-bold shadow-xs'
                              : isDone
                              ? 'text-govText-secondary hover:bg-gray-100 font-medium'
                              : 'text-govText-primary hover:bg-gray-100 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {isDone ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isLesActive ? 'text-white' : 'text-emerald-600'}`} />
                            ) : (
                              <PlayCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isLesActive ? 'text-saffron-300' : 'text-govText-muted'}`} />
                            )}
                            <span className="truncate">{mIdx + 1}.{lIdx + 1} {lTitle}</span>
                          </div>
                          <span className={`text-[10px] flex-shrink-0 ${isLesActive ? 'text-govTeal-100' : 'text-gray-400'}`}>
                            {lesson.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}

                    {/* Module Assessment Quiz Button */}
                    {module.quiz && (
                      <button
                        onClick={() => navigate('quiz', { courseId: course.id, moduleId: module.id })}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer mt-1 border ${
                          activeModIdx === mIdx && isLastLessonInModule
                            ? 'bg-saffron-50 border-saffron-300 text-saffron-900 font-bold'
                            : 'bg-gray-50 border-dashed border-gray-200 text-govText-secondary hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Sparkles className="w-3.5 h-3.5 text-saffron-600 flex-shrink-0" />
                          <span className="truncate">Module {mIdx + 1} Quiz</span>
                        </div>
                        <span className="text-[10px] bg-saffron-100 text-saffron-900 px-1.5 py-0.5 rounded font-bold">
                          {module.quiz.passThreshold}% Pass
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Lesson Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            
            {/* Mobile In-flow Module Selector */}
            <div className="lg:hidden flex items-center justify-between p-3 bg-govBg rounded-xl border border-gray-200 gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-govTeal-800 uppercase tracking-wider block">Module {activeModIdx + 1} of {course?.modules.length}</span>
                <p className="text-xs font-bold text-govText-primary truncate">{moduleTitle}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-3 py-1.5 bg-govTeal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs min-h-[36px]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum ({completedCount}/{totalLessons})</span>
              </button>
            </div>

            {/* Lesson Title Header */}
            <div className="border-b border-gray-200 pb-4">
              <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
                Module {activeModIdx + 1} • Lesson {activeLesIdx + 1}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1">
                {lessonTitle}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-govText-secondary">
                <span>Estimated duration: {currentLesson?.durationMinutes || 10} minutes</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-govTeal-600" />
                  <span>Instruction Language: {contentLang.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Multimedia Simulation Player */}
            <div className="relative aspect-video rounded-2xl bg-govTeal-950 overflow-hidden shadow-lg border border-govTeal-900 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between text-white/80 text-xs">
                <span className="bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm font-semibold">
                  National Cooperative Training Video Simulation
                </span>
                <span className="text-xs font-mono">1080p HD • Audio EN / HI</span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="flex flex-col items-center justify-center space-y-3 my-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
                >
                  <PlayCircle className="w-8 h-8" />
                </button>
                <p className="text-xs text-white/90 font-medium">
                  {isPlaying ? 'Playing lesson demonstration...' : 'Click to start interactive video walkthrough'}
                </p>
              </div>

              {/* Bottom Progress Bar & Controls */}
              <div className="space-y-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-saffron-400 h-full w-2/5 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>04:12 / {currentLesson?.durationMinutes || 10}:00</span>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>NCCT Standard LMS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Body Content */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-4">
              <h2 className="text-base font-bold text-govText-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-govTeal-600" />
                <span>Summary & Key Cooperative Takeaways</span>
              </h2>

              <div className="text-sm text-govText-secondary leading-relaxed space-y-3">
                <p>{lessonContent}</p>
              </div>

              {/* Practical Guidance Callout */}
              <div className="p-4 bg-govTeal-50/60 rounded-xl border border-govTeal-100 text-xs text-govTeal-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-govTeal-800">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                  <span>PACS Ground Application Note</span>
                </p>
                <p className="leading-relaxed">
                  Always ensure daily end-of-day register reconciliation matches the Central Federated ERP upload timestamp. Keep physical member receipts filed for statutory NCCT and District Cooperative Auditor inspection.
                </p>
              </div>
            </div>

          </div>

          {/* 3. Bottom Navigation Controls */}
          <div className="max-w-4xl mx-auto w-full pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handlePreviousLesson}
              disabled={isFirstLesson}
              className={`w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                isFirstLesson
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-govText-primary hover:bg-gray-100 border border-govText-border cursor-pointer shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.player?.previousLesson || 'Previous Lesson'}</span>
            </button>

            <button
              onClick={handleCompleteAndNext}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-govTeal-600 hover:bg-govTeal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <span>
                {isLastLessonInModule && currentModule?.quiz
                  ? (t.player?.startQuiz || 'Complete Lesson & Take Module Quiz')
                  : (t.player?.markComplete || 'Mark Complete & Continue')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
