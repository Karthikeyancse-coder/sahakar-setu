import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  Globe,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, Lesson, Quiz } from '../../types';
import { Language } from '../../types';
import { downloadCertificatePdf } from '../../utils/certificateGenerator';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const CourseViewer: React.FC = () => {
  const {
    courses,
    enrollments,
    certificates,
    currentUser,
    activeViewParams,
    navigate,
    markLessonComplete,
    submitQuiz,
    currentLanguage,
    t
  } = useApp();

  const courseId = activeViewParams?.courseId || courses[0].id;
  const course = courses.find(c => c.id === courseId) || courses[0];
  const enrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [contentLang, setContentLang] = useState<Language>(currentLanguage);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [earnedCertId, setEarnedCertId] = useState<string | null>(null);

  const currentModule = course.modules[activeModuleIndex] || course.modules[0];
  const currentLesson = currentModule?.lessons[activeLessonIndex] || currentModule?.lessons[0];
  const currentQuiz = currentModule?.quiz;

  useEffect(() => {
    setContentLang(currentLanguage);
  }, [currentLanguage]);

  const handleLessonChange = (modIdx: number, lesIdx: number) => {
    setActiveModuleIndex(modIdx);
    setActiveLessonIndex(lesIdx);
    setIsQuizMode(false);
    setQuizSubmitted(false);
    setSelectedAnswers({});
  };

  const handleOpenQuiz = (modIdx: number) => {
    setActiveModuleIndex(modIdx);
    setIsQuizMode(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
  };

  const handleCompleteCurrentLesson = () => {
    if (currentLesson) {
      markLessonComplete(course.id, currentLesson.id);
      // Advance to next lesson if available
      if (activeLessonIndex + 1 < currentModule.lessons.length) {
        setActiveLessonIndex(prev => prev + 1);
      } else if (currentModule.quiz) {
        setIsQuizMode(true);
      }
    }
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    let correctCount = 0;
    currentQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / currentQuiz.questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    const result = submitQuiz(course.id, currentQuiz.id, scorePct);
    if (result.passed) {
      // Fire confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B6E4F', '#E68A2E', '#2E8B57', '#F7DAB5'],
      });

      if (result.certId) {
        setEarnedCertId(result.certId);
      }
    }
  };

  // Safe localized getters
  const getLocalizedCourseTitle = () => {
    if (contentLang === 'hi') return course.titleHi;
    if (contentLang === 'mr') return course.titleMr;
    return course.title;
  };

  const getLocalizedLesson = (lesson: Lesson) => {
    const data = lesson.contentByLanguage[contentLang] || lesson.contentByLanguage.en;
    const title = contentLang === 'hi' ? lesson.titleHi : contentLang === 'mr' ? lesson.titleMr : lesson.title;
    return { ...data, title };
  };

  const localizedLesson = currentLesson ? getLocalizedLesson(currentLesson) : null;
  const userCert = certificates.find(c => c.userId === currentUser.id && c.courseId === course.id);

  return (
    <PageContainer>
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-govText-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('courses')}
            className="p-2 rounded-xl bg-govBg hover:bg-govTeal-50 text-govText-secondary hover:text-govTeal-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                NCCT Multilingual LMS
              </span>
              <SimulatedBadge text="Offline-Cached PWA" className="py-0.5 text-[10px]" />
            </div>
            <h2 className="text-xl font-extrabold text-govText-primary">
              {getLocalizedCourseTitle()}
            </h2>
          </div>
        </div>

        {/* Content Language Switcher */}
        <div className="flex items-center gap-2 bg-govBg p-1.5 rounded-xl border border-govTeal-100">
          <Globe className="w-4 h-4 text-govTeal-700 ml-1.5" />
          {(['en', 'hi', 'mr'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setContentLang(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                contentLang === lang
                  ? 'bg-govTeal-600 text-white shadow'
                  : 'text-govText-secondary hover:text-govText-primary'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Modules on left, Player on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Curriculum Accordion (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-govText-primary">
                {t.lms.modules}
              </h3>
              <span className="text-xs font-semibold text-govTeal-700 bg-govTeal-50 px-2 py-0.5 rounded">
                {enrollment?.progressPercent || 0}% Done
              </span>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {course.modules.map((mod, mIdx) => {
                const isModActive = activeModuleIndex === mIdx;
                const modTitle = contentLang === 'hi' ? mod.titleHi : contentLang === 'mr' ? mod.titleMr : mod.title;

                return (
                  <div key={mod.id} className="border border-govTeal-100 rounded-xl overflow-hidden">
                    <div className={`p-3 text-xs font-bold flex items-center justify-between cursor-pointer ${
                      isModActive ? 'bg-govTeal-700 text-white' : 'bg-govBg text-govText-primary hover:bg-govTeal-50'
                    }`}
                    onClick={() => handleLessonChange(mIdx, 0)}>
                      <span>{modTitle}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isModActive ? 'rotate-90 text-saffron-300' : ''}`} />
                    </div>

                    {isModActive && (
                      <div className="bg-white p-2 space-y-1">
                        {mod.lessons.map((les, lIdx) => {
                          const isLesActive = !isQuizMode && activeLessonIndex === lIdx;
                          const isCompleted = enrollment?.completedLessonIds.includes(les.id);
                          const lesTitle = contentLang === 'hi' ? les.titleHi : contentLang === 'mr' ? les.titleMr : les.title;

                          return (
                            <button
                              key={les.id}
                              onClick={() => handleLessonChange(mIdx, lIdx)}
                              className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                                isLesActive
                                  ? 'bg-govTeal-50 border border-govTeal-300 text-govTeal-900 font-bold'
                                  : 'text-govText-secondary hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-govTeal-600 flex-shrink-0" />
                                )}
                                <span className="truncate">{lesTitle}</span>
                              </div>
                              <span className="text-[10px] text-govText-muted flex-shrink-0 ml-1">
                                {les.durationMinutes}m
                              </span>
                            </button>
                          );
                        })}

                        {/* Module Quiz Button */}
                        {mod.quiz && (
                          <button
                            onClick={() => handleOpenQuiz(mIdx)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-all mt-1 ${
                              isQuizMode && activeModuleIndex === mIdx
                                ? 'bg-saffron-50 border border-saffron-300 text-saffron-900 font-bold'
                                : 'bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-semibold'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-saffron-600 flex-shrink-0" />
                              <span>{contentLang === 'hi' ? mod.quiz.titleHi : contentLang === 'mr' ? mod.quiz.titleMr : mod.quiz.title}</span>
                            </div>
                            {enrollment?.completedQuizIds.includes(mod.quiz.id) && (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Lesson Reader or Quiz Player (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {!isQuizMode && localizedLesson && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-6">
              
              {/* Lesson Title & Offline Badge */}
              <div className="border-b border-gray-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
                    Lesson {currentLesson?.order} of {currentModule.lessons.length}
                  </span>
                  <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Available Offline
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-govText-primary font-devanagari">
                  {localizedLesson.title}
                </h3>
              </div>

              {/* Main Reading Text */}
              <div className="prose prose-teal max-w-none text-govText-primary text-sm sm:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {localizedLesson.text}
              </div>

              {/* Key Takeaways Box */}
              {localizedLesson.keyTakeaways && (
                <div className="bg-govBg rounded-xl p-5 border border-govTeal-200 space-y-3">
                  <h4 className="font-bold text-xs text-govTeal-800 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-saffron-500" />
                    <span>{t.lms.keyTakeaways}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-govText-primary">
                    {localizedLesson.keyTakeaways.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-govTeal-600 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-govText-muted">
                  Language: <strong className="uppercase">{contentLang}</strong>
                </div>

                <button
                  onClick={handleCompleteCurrentLesson}
                  className="px-6 py-3 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2 text-xs sm:text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-saffron-300" />
                  <span>Mark Complete & Next</span>
                </button>
              </div>

            </div>
          )}

          {/* Interactive Quiz Mode */}
          {isQuizMode && currentQuiz && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-6">
              
              <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                    {t.lms.takeQuiz}
                  </span>
                  <h3 className="text-xl font-bold text-govText-primary">
                    {contentLang === 'hi' ? currentQuiz.titleHi : contentLang === 'mr' ? currentQuiz.titleMr : currentQuiz.title}
                  </h3>
                </div>
                <div className="bg-saffron-50 text-saffron-900 border border-saffron-200 px-3 py-1 rounded-lg text-xs font-bold">
                  {t.lms.passScore}: {currentQuiz.passThreshold}%
                </div>
              </div>

              {/* Quiz Questions */}
              <div className="space-y-6">
                {currentQuiz.questions.map((q, qIdx) => {
                  const qText = contentLang === 'hi' ? q.questionHi : contentLang === 'mr' ? q.questionMr : q.question;
                  const opts = q.options[contentLang] || q.options.en;
                  const chosenOpt = selectedAnswers[q.id];
                  const isCorrect = chosenOpt === q.correctOptionIndex;
                  const explanation = q.explanation[contentLang] || q.explanation.en;

                  return (
                    <div key={q.id} className="p-5 rounded-xl border border-govTeal-100 bg-govBg space-y-3">
                      <p className="font-bold text-sm text-govText-primary">
                        {qIdx + 1}. {qText}
                      </p>

                      <div className="space-y-2">
                        {opts.map((opt, oIdx) => {
                          const isSelected = chosenOpt === oIdx;
                          let optStyle = 'bg-white border-govText-border text-govText-primary hover:border-govTeal-400';

                          if (quizSubmitted) {
                            if (oIdx === q.correctOptionIndex) {
                              optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isSelected && !isCorrect) {
                              optStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                            } else {
                              optStyle = 'bg-white opacity-60 border-gray-200';
                            }
                          } else if (isSelected) {
                            optStyle = 'bg-govTeal-50 border-govTeal-600 text-govTeal-900 font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizAnswer(q.id, oIdx)}
                              className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && oIdx === q.correctOptionIndex && (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              )}
                              {quizSubmitted && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-3 rounded-lg text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                          <p className="font-semibold">{isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}</p>
                          <p className="mt-0.5 text-[11px] opacity-90">{explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Result / Submit Footer */}
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                  className="w-full py-3.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  <span>Submit Assessment</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl text-center space-y-2 ${
                    (quizScore || 0) >= currentQuiz.passThreshold
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border border-rose-300 text-rose-900'
                  }`}>
                    <h4 className="text-xl font-bold">
                      {(quizScore || 0) >= currentQuiz.passThreshold ? t.lms.congratsTitle : 'Assessment Needs Review'}
                    </h4>
                    <p className="text-sm">
                      {t.lms.yourScore}: <strong className="text-base">{quizScore}%</strong> • Passing Requirement: {currentQuiz.passThreshold}%
                    </p>
                  </div>

                  {(userCert || earnedCertId) && (
                    <div className="bg-gradient-to-r from-govTeal-700 to-govTeal-900 text-white p-6 rounded-2xl space-y-3 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-saffron-400" />
                        <h4 className="font-bold text-base">{t.lms.certificateReady}</h4>
                      </div>
                      <p className="text-xs text-govTeal-100">
                        Official cryptographic certificate generated and registered with NCCT.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        {userCert && (
                          <button
                            onClick={() => downloadCertificatePdf(userCert)}
                            className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download PDF Certificate</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigate('certificates')}
                          className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg"
                        >
                          View in My Certificates
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="w-full py-2.5 bg-govBg hover:bg-gray-100 text-govText-primary text-xs font-semibold rounded-xl border border-govText-border"
                  >
                    {t.lms.retakeQuiz}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </PageContainer>
  );
};
