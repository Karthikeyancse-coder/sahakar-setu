import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

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

  const course = courses.find(c => c.id === courseId) || courses[0];
  const currentModule = (moduleId ? course?.modules.find(m => m.id === moduleId) : null) || course?.modules[0];
  const quiz = currentModule?.quiz;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);

  if (!quiz) {
    return (
      <PageContainer>
        <div className="bg-white rounded-2xl p-10 text-center border border-govText-border space-y-4">
          <BookOpen className="w-12 h-12 text-govTeal-400 mx-auto" />
          <h2 className="text-lg font-bold text-govText-primary">No Assessment Available</h2>
          <p className="text-xs text-govText-secondary">
            This module does not require a graded assessment or the quiz is currently being updated.
          </p>
          <button
            onClick={() => navigate('course_player', { courseId: course.id })}
            className="px-4 py-2 bg-govTeal-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Course Lessons
          </button>
        </div>
      </PageContainer>
    );
  }

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    setScorePercent(score);
    setIsSubmitted(true);

    submitQuiz(course.id, currentModule.id, score);

    if (score >= quiz.passThreshold) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercent(null);
  };

  const isPassed = scorePercent !== null && scorePercent >= quiz.passThreshold;
  const allAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined);

  const courseTitle = currentLanguage === 'hi' ? course.titleHi : currentLanguage === 'mr' ? course.titleMr : course.title;
  const moduleTitle = currentLanguage === 'hi' ? currentModule.titleHi : currentLanguage === 'mr' ? currentModule.titleMr : currentModule.title;

  return (
    <PageContainer>
      {/* 1. Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('course_player', { courseId: course.id })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-govTeal-700 hover:text-govTeal-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Lessons</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
              {courseTitle}
            </span>
            <SimulatedBadge text="NCCT Module Assessment" />
          </div>

          <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
            {moduleTitle}: {t.quiz?.assessmentTitle || 'Knowledge Assessment'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1">
            Answer all questions. Minimum passing score: <span className="font-bold text-govTeal-800">{quiz.passThreshold}%</span>.
          </p>
        </div>

        <div className="bg-govBg border border-govTeal-100 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-govTeal-600" />
          <span className="font-semibold text-govText-primary">
            {quiz.questions.length} Questions
          </span>
        </div>
      </div>

      {/* 2. Result Banner (Shown after submission) */}
      {isSubmitted && scorePercent !== null && (
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
                  ? (t.quiz?.congratulations || 'Congratulations! You Passed!')
                  : (t.quiz?.failedBadge || 'Assessment Not Cleared')}
              </h3>
              <p className="text-xs mt-0.5 opacity-90">
                You achieved a score of <span className="font-extrabold text-base">{scorePercent}%</span> (Passing score: {quiz.passThreshold}%).
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
                  onClick={() => navigate('course_detail', { courseId: course.id })}
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

      {/* 3. Questions List */}
      <div className="space-y-4 sm:space-y-6">
        {quiz.questions.map((q, qIdx) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = isSubmitted && selectedOption === q.correctOptionIndex;
          const isWrong = isSubmitted && selectedOption !== undefined && selectedOption !== q.correctOptionIndex;

          const questionText = currentLanguage === 'hi' ? q.questionHi : currentLanguage === 'mr' ? q.questionMr : q.question;
          const optionsList = q.options[currentLanguage] || q.options.en;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-4 sm:p-6 border shadow-sm space-y-4 transition-all ${
                isSubmitted
                  ? isCorrect
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
                  <h3 className="font-bold text-xs sm:text-sm text-govText-primary leading-snug">
                    {questionText}
                  </h3>
                </div>

                {isSubmitted && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden min-[360px]:inline">Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden min-[360px]:inline">Incorrect</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pl-0 sm:pl-10">
                {optionsList.map((optText, optIdx) => {
                  const isOptSelected = selectedOption === optIdx;
                  const isOptCorrect = isSubmitted && q.correctOptionIndex === optIdx;

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
                    optClass = 'border-govTeal-600 bg-govTeal-50 text-govTeal-950 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full min-h-[48px] p-3 sm:p-3.5 rounded-xl border text-xs text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${optClass}`}
                    >
                      <span className="leading-snug">{optText}</span>
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
            {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
          </span>

          <button
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
