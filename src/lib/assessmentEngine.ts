/**
 * src/lib/assessmentEngine.ts
 * Reusable Assessment Engine with Stable Question and Option IDs.
 * Single source of truth for answer validation, scoring, and question statuses.
 */

export interface AssessmentOption {
  id: string;          // e.g. "q-dairy-1-a"
  text: string;        // Localized or default display text
  textHi?: string;
  textMr?: string;
}

export interface AssessmentQuestion {
  id: string;          // Stable question ID
  question: string;
  questionHi?: string;
  questionMr?: string;
  options: AssessmentOption[];
  correctOptionId: string; // Stable option ID that is correct
  explanation?: {
    en?: string;
    hi?: string;
    mr?: string;
  };
}

export type QuestionAnswerStatus = 'correct' | 'incorrect' | 'unanswered';

export interface QuestionValidationResult {
  questionId: string;
  selectedOptionId?: string;
  correctOptionId: string;
  isCorrect: boolean;
  status: QuestionAnswerStatus;
}

export interface AssessmentResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredCount: number;
  scorePercentage: number;
  passingScore: number;
  passed: boolean;
  questionResults: Record<string, QuestionValidationResult>;
}

const OPTION_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/**
 * Normalizes any question data (legacy index-based or new object-based)
 * to guarantee stable question ID, stable option IDs, and correctOptionId.
 */
export function normalizeQuestion(rawQ: any, lang: 'en' | 'hi' | 'mr' = 'en'): AssessmentQuestion {
  const qId = String(rawQ.id || 'q');

  let normalizedOptions: AssessmentOption[] = [];

  // If explicit optionList is provided
  if (Array.isArray(rawQ.optionList) && rawQ.optionList.length > 0) {
    normalizedOptions = rawQ.optionList.map((opt: any, idx: number) => {
      const optId = opt.id || `${qId}-${OPTION_LETTERS[idx] || idx}`;
      const displayText = lang === 'hi' ? (opt.textHi || opt.text) : lang === 'mr' ? (opt.textMr || opt.text) : opt.text;
      return {
        id: optId,
        text: displayText || opt.text || '',
        textHi: opt.textHi,
        textMr: opt.textMr,
      };
    });
  } else if (Array.isArray(rawQ.options)) {
    // Array of strings or objects
    normalizedOptions = rawQ.options.map((opt: any, idx: number) => {
      const optId = (typeof opt === 'object' && opt.id) ? opt.id : `${qId}-${OPTION_LETTERS[idx] || idx}`;
      const text = typeof opt === 'string' ? opt : (opt[lang] || opt.text || opt.en || '');
      return {
        id: optId,
        text,
        textHi: typeof opt === 'object' ? opt.textHi : undefined,
        textMr: typeof opt === 'object' ? opt.textMr : undefined,
      };
    });
  } else if (rawQ.options && typeof rawQ.options === 'object') {
    // Legacy localized options shape: { en: string[], hi?: string[], mr?: string[] }
    const enOpts: string[] = rawQ.options.en || [];
    const hiOpts: string[] = rawQ.options.hi || [];
    const mrOpts: string[] = rawQ.options.mr || [];
    const count = Math.max(enOpts.length, hiOpts.length, mrOpts.length);

    for (let i = 0; i < count; i++) {
      const optId = `${qId}-${OPTION_LETTERS[i] || i}`;
      const text = (lang === 'hi' ? hiOpts[i] : lang === 'mr' ? mrOpts[i] : enOpts[i]) || enOpts[i] || '';
      normalizedOptions.push({
        id: optId,
        text,
        textHi: hiOpts[i],
        textMr: mrOpts[i],
      });
    }
  }

  // Derive stable correctOptionId
  let correctOptionId = rawQ.correctOptionId;
  if (!correctOptionId && typeof rawQ.correctOptionIndex === 'number') {
    if (normalizedOptions[rawQ.correctOptionIndex]) {
      correctOptionId = normalizedOptions[rawQ.correctOptionIndex].id;
    } else {
      correctOptionId = `${qId}-${OPTION_LETTERS[rawQ.correctOptionIndex] || rawQ.correctOptionIndex}`;
    }
  }

  // Fallback if still empty
  if (!correctOptionId && normalizedOptions.length > 0) {
    correctOptionId = normalizedOptions[0].id;
  }

  const questionText = (lang === 'hi' ? rawQ.questionHi : lang === 'mr' ? rawQ.questionMr : rawQ.question) || rawQ.question || '';

  return {
    id: qId,
    question: questionText,
    questionHi: rawQ.questionHi,
    questionMr: rawQ.questionMr,
    options: normalizedOptions,
    correctOptionId: correctOptionId || `${qId}-a`,
    explanation: rawQ.explanation,
  };
}

/**
 * Pure scoring and validation function.
 * Validates selected answer options against correctOptionIds.
 */
export function gradeAssessment(
  questions: AssessmentQuestion[],
  selectedAnswers: Record<string, string>, // questionId -> selectedOptionId
  passingScore: number = 80
): AssessmentResult {
  const totalQuestions = questions.length;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredCount = 0;
  const questionResults: Record<string, QuestionValidationResult> = {};

  questions.forEach((q) => {
    const selectedOptionId = selectedAnswers[q.id];
    const isAnswered = selectedOptionId !== undefined && selectedOptionId !== null && selectedOptionId.trim() !== '';
    const isCorrect = isAnswered && selectedOptionId === q.correctOptionId;

    let status: QuestionAnswerStatus = 'unanswered';
    if (!isAnswered) {
      status = 'unanswered';
      unansweredCount += 1;
    } else if (isCorrect) {
      status = 'correct';
      correctAnswers += 1;
    } else {
      status = 'incorrect';
      incorrectAnswers += 1;
    }

    questionResults[q.id] = {
      questionId: q.id,
      selectedOptionId,
      correctOptionId: q.correctOptionId,
      isCorrect,
      status,
    };
  });

  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const passed = scorePercentage >= passingScore;

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredCount,
    scorePercentage,
    passingScore,
    passed,
    questionResults,
  };
}
