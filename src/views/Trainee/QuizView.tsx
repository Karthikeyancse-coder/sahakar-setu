import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import {
  normalizeQuestion,
  gradeAssessment,
  AssessmentResult,
} from '../../lib/assessmentEngine';
import { api } from '../../lib/api';

/**
 * Validates and normalizes raw quiz payload from database or course curriculum.
 * Ensures data is an object, has an id, and contains a non-empty array of valid questions.
 */
function validateAndExtractQuiz(raw: any): any | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.id) return null;

  let questions = raw.questions;
  // Handle database JSON string serialization
  if (typeof questions === 'string') {
    try {
      questions = JSON.parse(questions);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  // Ensure questions have prompt and options
  const validQuestions = questions.filter((q: any) => {
    if (!q || typeof q !== 'object') return false;
    const hasPrompt = Boolean(
      q.question ||
      q.questionText ||
      q.title ||
      q.questionHi ||
      q.questionTextHi ||
      q.questionMr ||
      q.questionTextMr
    );
    const hasOptions =
      (Array.isArray(q.options) && q.options.length > 0) ||
      (Array.isArray(q.optionList) && q.optionList.length > 0) ||
      (q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0);

    return hasPrompt && hasOptions;
  });

  if (validQuestions.length === 0) return null;

  return {
    ...raw,
    questions: validQuestions,
  };
}

export const QuizView: React.FC = () => {
  const {
    courses,
    activeViewParams,
    navigate,
    submitQuiz,
    currentLanguage,
    t
  } = useApp();

  const courseId = activeViewParams?.courseId || courses[0]?.id;
  const moduleId = activeViewParams?.moduleId;

  // Resolve course safely with fallback and alias resolution
  const course = useMemo(() => {
    return (
      courses.find(
        (c) =>
          c.id === courseId ||
          (courseId?.includes('dairy') && c.id?.includes('dairy')) ||
          (courseId?.includes('pacs') && c.id?.includes('pacs')) ||
          (courseId?.includes('shg') && c.id?.includes('shg'))
      ) || courses[0]
    );
  }, [courses, courseId]);

  const currentModule = useMemo(() => {
    if (!course?.modules || course.modules.length === 0) return null;
    if (moduleId) {
      const found = course.modules.find((m) => m.id === moduleId);
      if (found) return found;
    }
    return course.modules[0];
  }, [course, moduleId]);

  const localQuiz = currentModule?.quiz;

  // Single authoritative quiz state
  const [quiz, setQuiz] = useState<any>(() => {
    return validateAndExtractQuiz(localQuiz);
  });
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(() => !validateAndExtractQuiz(localQuiz));

  // Ref to always track latest valid quiz state without race condition
  const quizRef = useRef<any>(quiz);
  quizRef.current = quiz;

  // Derive stable quiz identifier
  const quizIdentifier = useMemo(() => {
    if (activeViewParams?.quizId) return activeViewParams.quizId;
    if (localQuiz?.id) return localQuiz.id;
    if (moduleId) return moduleId;
    if (courseId) {
      if (courseId.includes('dairy')) return 'quiz-dairy-m1';
      if (courseId.includes('pacs')) return 'quiz-pacs-m1';
      if (courseId.includes('shg')) return 'quiz-shg-m1';
    }
    return 'quiz-dairy-m1';
  }, [activeViewParams?.quizId, localQuiz?.id, moduleId, courseId]);

  // Authoritative quiz data loading lifecycle
  useEffect(() => {
    let isCancelled = false;

    // 1. If we don't have a valid quiz yet, try validating current localQuiz
    const validLocal = validateAndExtractQuiz(localQuiz);
    if (validLocal && !quizRef.current) {
      setQuiz(validLocal);
      setLoadingQuiz(false);
    }

    // 2. Fetch authoritative full quiz from backend repository
    if (quizIdentifier) {
      if (!quizRef.current) {
        setLoadingQuiz(true);
      }

      api.learning
        .getQuiz(quizIdentifier)
        .then((res) => {
          if (isCancelled) return;
          const validApiQuiz = validateAndExtractQuiz(res);

          if (validApiQuiz) {
            // Guard: Do not allow a response with fewer questions to overwrite a complete quiz
            if (
              quizRef.current &&
              Array.isArray(quizRef.current.questions) &&
              quizRef.current.questions.length > validApiQuiz.questions.length
            ) {
              console.warn(
                `[QuizView] Preserved authoritative quiz with ${quizRef.current.questions.length} questions; ignored incoming quiz with ${validApiQuiz.questions.length} questions`
              );
            } else {
              setQuiz(validApiQuiz);
            }
          } else {
            console.warn(
              `[QuizView] API returned invalid quiz payload for "${quizIdentifier}"; preserved existing state`
            );
          }
        })
        .catch((err) => {
          console.warn('[QuizView] Could not fetch quiz from API, keeping existing state:', err);
        })
        .finally(() => {
          if (!isCancelled) {
            setLoadingQuiz(false);
          }
        });
    } else {
      setLoadingQuiz(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [quizIdentifier]);

  // Authoritative questions list — never returns [{}] fallback
  const rawQuestions = useMemo(() => {
    return Array.isArray(quiz?.questions) ? quiz.questions : [];
  }, [quiz]);

  // Normalized questions with localized strings and stable keys
  const normalizedQuestions = useMemo(() => {
    if (rawQuestions.length === 0) return [];
    return rawQuestions.map((q: any) => normalizeQuestion(q, currentLanguage));
  }, [rawQuestions, currentLanguage]);

  // Separate answers state — selecting answers NEVER modifies quiz or questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Render Protection 1: Loading state
  if (loadingQuiz && (!quiz || normalizedQuestions.length === 0)) {
    return (
      <PageContainer>
        <div className="bg-white rounded-2xl p-12 text-center border border-govText-border space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-govTeal-600 animate-spin mx-auto" />
          <h2 className="text-base font-bold text-govText-primary">Loading Assessment Questions...</h2>
          <p className="text-xs text-govText-secondary">
            Fetching official examination questions from the NCCT repository.
          </p>
        </div>
      </PageContainer>
    );
  }

  // Render Protection 2: Error state — prevents "QUESTION 1 OF 1" with empty fields
  if (!quiz || normalizedQuestions.length === 0) {
    return (
      <PageContainer>
        <div className="bg-white rounded-2xl p-10 text-center border border-govText-border space-y-4 shadow-sm">
          <BookOpen className="w-12 h-12 text-govTeal-400 mx-auto" />
          <h2 className="text-lg font-bold text-govText-primary">No Assessment Available</h2>
          <p className="text-xs text-govText-secondary">
            This module does not require a graded assessment or the quiz is currently being updated.
          </p>
          <button
            onClick={() => navigate('course_player', { courseId: course?.id || courseId })}
            className="px-4 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Course Lessons
          </button>
        </div>
      </PageContainer>
    );
  }

  // Answer selection handler — only updates answers state
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Submission validation
  const answeredCount = normalizedQuestions.filter((q) => Boolean(selectedAnswers[q.id])).length;
  const totalQuestionsCount = normalizedQuestions.length;
  const allAnswered = totalQuestionsCount > 0 && answeredCount === totalQuestionsCount;

  const handleSubmit = async () => {
    if (normalizedQuestions.length === 0) return;

    // 1. Local scoring fallback
    const localResult = gradeAssessment(
      normalizedQuestions,
      selectedAnswers,
      quiz.passThreshold || 70
    );

    // 2. Authoritative backend scoring
    try {
      const serverRes = await api.learning.submitQuiz(quiz.id, selectedAnswers);
      if (serverRes) {
        const passed = Boolean(serverRes.passed);
        const scorePercent =
          serverRes.scorePercent ?? serverRes.score ?? localResult.scorePercentage;
        setAssessmentResult({
          totalQuestions: serverRes.totalQuestions || normalizedQuestions.length,
          correctAnswers: serverRes.correctAnswers || 0,
          incorrectAnswers:
            (serverRes.totalQuestions || normalizedQuestions.length) -
            (serverRes.correctAnswers || 0),
          unansweredCount: 0,
          scorePercentage: scorePercent,
          passingScore: quiz.passThreshold || 70,
          passed,
          questionResults: localResult.questionResults,
        });
        setIsSubmitted(true);

        if (passed) {
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {
            /* Confetti fallback */
          }
        }

        // Notify AppContext for state sync
        const rawAnswers = normalizedQuestions.map((q) => {
          const selOptId = selectedAnswers[q.id];
          const idx = q.options.findIndex((o) => o.id === selOptId);
          return idx >= 0 ? idx : -1;
        });
        await submitQuiz(course?.id || courseId, quiz.id, rawAnswers, serverRes);
        return;
      }
    } catch (e) {
      console.warn('[QuizView] Server submit fallback to local scoring:', e);
    }

    // Fallback if network call had an issue
    setAssessmentResult(localResult);
    setIsSubmitted(true);
    if (localResult.passed) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        /* Confetti fallback */
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setAssessmentResult(null);
  };

  const isPassed = assessmentResult ? assessmentResult.passed : false;

  const courseTitle =
    currentLanguage === 'hi'
      ? course?.titleHi
      : currentLanguage === 'mr'
      ? course?.titleMr
      : course?.title;

  const moduleTitle =
    currentLanguage === 'hi'
      ? currentModule?.titleHi
      : currentLanguage === 'mr'
      ? currentModule?.titleMr
      : currentModule?.title;

  return (
    <PageContainer>
      {/* 1. Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('course_player', { courseId: course?.id || courseId })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-govTeal-700 hover:text-govTeal-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Lessons</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
              {courseTitle || 'Course Curriculum'}
            </span>
            <SimulatedBadge text="NCCT Module Assessment" />
          </div>

          <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
            {moduleTitle ? `${moduleTitle}: ` : ''}
            {quiz.title || t.quiz?.assessmentTitle || 'Module Competency Assessment'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1">
            Answer all questions. Minimum passing score:{' '}
            <span className="font-bold text-govTeal-800">{quiz.passThreshold || 70}%</span>.
          </p>
        </div>

        <div className="bg-govBg border border-govTeal-100 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-govTeal-600" />
          <span className="font-semibold text-govText-primary">
            {normalizedQuestions.length} Questions
          </span>
        </div>
      </div>

      {/* 2. Result Banner (Shown after submission) */}
      {isSubmitted && assessmentResult !== null && (
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn ${
            isPassed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isPassed ? <Award className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">
                {isPassed
                  ? t.quiz?.congratulations || 'Assessment Passed'
                  : t.quiz?.failedBadge || 'Assessment Score Below Threshold'}
              </h3>
              <p className="text-xs mt-0.5 opacity-90">
                You achieved a score of{' '}
                <span className="font-extrabold text-base">
                  {assessmentResult.scorePercentage}%
                </span>{' '}
                (Passing score: {quiz.passThreshold || 70}%).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {isPassed ? (
              <>
                <button
                  onClick={() => navigate('certificates')}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{t.quiz?.viewCertificate || 'View Verified Certificate'}</span>
                </button>
                <button
                  onClick={() => navigate('course_detail', { courseId: course?.id || courseId })}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-white border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center"
                >
                  Continue Syllabus
                </button>
              </>
            ) : (
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.quiz?.retry || 'Retry Assessment'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Questions List — Rendering ALL questions with stable keys */}
      <div className="space-y-4 sm:space-y-6">
        {normalizedQuestions.map((q, qIdx) => {
          const selectedOptionId = selectedAnswers[q.id];
          const qResult = assessmentResult?.questionResults[q.id];
          const isQuestionCorrect = isSubmitted && qResult?.status === 'correct';
          const isQuestionIncorrect = isSubmitted && qResult?.status === 'incorrect';
          const isQuestionUnanswered = isSubmitted && qResult?.status === 'unanswered';

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-4 sm:p-6 border shadow-sm space-y-4 transition-all ${
                isSubmitted
                  ? isQuestionCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-govText-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="w-7 h-7 rounded-lg bg-govTeal-100 text-govTeal-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-saffron-700 tracking-wider uppercase block mb-0.5">
                      Question {qIdx + 1} of {normalizedQuestions.length}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-govText-primary leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="flex-shrink-0">
                    {isQuestionCorrect && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden min-[360px]:inline">Correct</span>
                      </span>
                    )}
                    {isQuestionIncorrect && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden min-[360px]:inline">Incorrect</span>
                      </span>
                    )}
                    {isQuestionUnanswered && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="hidden min-[360px]:inline">Not Answered</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pl-0 sm:pl-10">
                {q.options.map((opt) => {
                  const isOptSelected = selectedOptionId === opt.id;
                  const isOptCorrect = isSubmitted && opt.id === q.correctOptionId;

                  let optClass = 'border-gray-200 hover:bg-gray-50 text-govText-primary';
                  if (isSubmitted) {
                    if (isOptCorrect) {
                      optClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isOptSelected) {
                      optClass = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      optClass = 'border-gray-200 opacity-60 text-gray-500';
                    }
                  } else if (isOptSelected) {
                    optClass =
                      'border-govTeal-600 bg-govTeal-50 text-govTeal-950 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full min-h-[48px] p-3 sm:p-3.5 rounded-xl border text-xs text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${optClass}`}
                    >
                      <span className="leading-snug">{opt.text}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isOptSelected
                            ? isSubmitted
                              ? isOptCorrect
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-rose-600 bg-rose-600 text-white'
                              : 'border-govTeal-600 bg-govTeal-600 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {isOptSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Submission Bar */}
      {!isSubmitted && (
        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs text-govText-secondary font-medium text-center sm:text-left">
            {answeredCount} of {totalQuestionsCount} answered
          </span>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center ${
              allAnswered
                ? 'bg-govTeal-600 hover:bg-govTeal-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t.quiz?.submitQuiz || 'Submit Assessment'}
          </button>
        </div>
      )}
    </PageContainer>
  );
};
