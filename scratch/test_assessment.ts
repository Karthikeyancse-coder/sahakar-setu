import { normalizeQuestion, gradeAssessment } from '../src/lib/assessmentEngine';

console.log('--- RUNNING ASSESSMENT ENGINE UNIT TESTS ---');

// Mock data matching exact question in prompt
const rawDairyQuestion = {
  id: 'q-dairy-1',
  question: 'What are the two primary parameters used to determine the purchase price of milk at cooperative societies?',
  options: {
    en: ['FAT and SNF (Solids-Not-Fat)', 'Color and Smell only', 'Container volume only', 'Temperature and Acidity only'],
  },
  correctOptionIndex: 0,
  correctOptionId: 'q-dairy-1-a',
};

const normalized = normalizeQuestion(rawDairyQuestion, 'en');

// Check normalization
console.log('Normalized Question ID:', normalized.id);
console.log('Normalized Options Count:', normalized.options.length);
console.log('Normalized Option 0:', normalized.options[0]);
console.log('Correct Option ID:', normalized.correctOptionId);

if (normalized.options[0].id !== 'q-dairy-1-a') {
  throw new Error('Option 0 ID is not q-dairy-1-a');
}
if (normalized.correctOptionId !== 'q-dairy-1-a') {
  throw new Error('correctOptionId is not q-dairy-1-a');
}

// TEST 1: Select FAT and SNF (Correct answer)
console.log('\n--- TEST 1: Select Correct Answer (FAT and SNF) ---');
const attempt1Answers = { 'q-dairy-1': 'q-dairy-1-a' };
const result1 = gradeAssessment([normalized], attempt1Answers, 80);

console.log('Score percentage:', result1.scorePercentage + '%');
console.log('Passed:', result1.passed);
console.log('Correct answers:', result1.correctAnswers);
console.log('Total questions:', result1.totalQuestions);
console.log('Question 1 status:', result1.questionResults['q-dairy-1'].status);
console.log('Question 1 isCorrect:', result1.questionResults['q-dairy-1'].isCorrect);

if (result1.scorePercentage !== 100) throw new Error('Expected 100% score for correct answer');
if (!result1.passed) throw new Error('Expected passed to be true');
if (result1.questionResults['q-dairy-1'].status !== 'correct') throw new Error('Expected status to be correct');
if (!result1.questionResults['q-dairy-1'].isCorrect) throw new Error('Expected isCorrect to be true');

// TEST 2: Select Color and Smell only (Wrong answer)
console.log('\n--- TEST 2: Select Wrong Answer (Color and Smell only) ---');
const attempt2Answers = { 'q-dairy-1': 'q-dairy-1-b' };
const result2 = gradeAssessment([normalized], attempt2Answers, 80);

console.log('Score percentage:', result2.scorePercentage + '%');
console.log('Passed:', result2.passed);
console.log('Correct answers:', result2.correctAnswers);
console.log('Incorrect answers:', result2.incorrectAnswers);
console.log('Question 1 status:', result2.questionResults['q-dairy-1'].status);
console.log('Question 1 isCorrect:', result2.questionResults['q-dairy-1'].isCorrect);

if (result2.scorePercentage !== 0) throw new Error('Expected 0% score for wrong answer');
if (result2.passed) throw new Error('Expected passed to be false');
if (result2.questionResults['q-dairy-1'].status !== 'incorrect') throw new Error('Expected status to be incorrect');
if (result2.questionResults['q-dairy-1'].isCorrect) throw new Error('Expected isCorrect to be false');

// TEST 3: Unanswered Question
console.log('\n--- TEST 3: Unanswered Question ---');
const attempt3Answers = {};
const result3 = gradeAssessment([normalized], attempt3Answers, 80);

console.log('Score percentage:', result3.scorePercentage + '%');
console.log('Unanswered count:', result3.unansweredCount);
console.log('Question 1 status:', result3.questionResults['q-dairy-1'].status);

if (result3.scorePercentage !== 0) throw new Error('Expected 0% score for unanswered');
if (result3.questionResults['q-dairy-1'].status !== 'unanswered') throw new Error('Expected status to be unanswered');

// TEST 4: Multiple Questions (5 questions, 4 correct -> 80%)
console.log('\n--- TEST 4: 5 Questions, 4 correct -> 80% ---');
const fiveQuestions = [1, 2, 3, 4, 5].map(i => ({
  id: `q${i}`,
  question: `Question ${i}`,
  options: [
    { id: `q${i}-a`, text: 'Option A' },
    { id: `q${i}-b`, text: 'Option B' },
  ],
  correctOptionId: `q${i}-a`,
}));

// Answer q1, q2, q3, q4 correctly, q5 wrongly
const multiAnswers = {
  q1: 'q1-a',
  q2: 'q2-a',
  q3: 'q3-a',
  q4: 'q4-a',
  q5: 'q5-b', // wrong
};
const resultMulti = gradeAssessment(fiveQuestions, multiAnswers, 80);

console.log('5 Questions Score:', resultMulti.scorePercentage + '%');
console.log('5 Questions Passed (>= 80%):', resultMulti.passed);
console.log('Correct count:', resultMulti.correctAnswers);
console.log('Incorrect count:', resultMulti.incorrectAnswers);

if (resultMulti.scorePercentage !== 80) throw new Error('Expected 80% score');
if (!resultMulti.passed) throw new Error('Expected passed = true at 80%');

// TEST 5: Retry Assessment (Reset state simulation)
console.log('\n--- TEST 5: Retry Assessment Simulation ---');
let activeAnswers: Record<string, string> = { 'q-dairy-1': 'q-dairy-1-b' };
let activeResult: any = gradeAssessment([normalized], activeAnswers, 80);
console.log('Initial attempt score:', activeResult.scorePercentage + '%'); // 0%

// Click retry:
activeAnswers = {};
activeResult = null;
console.log('After retry reset - answers:', Object.keys(activeAnswers).length, 'result:', activeResult);

// Re-attempt with correct answer:
activeAnswers = { 'q-dairy-1': 'q-dairy-1-a' };
activeResult = gradeAssessment([normalized], activeAnswers, 80);
console.log('Second attempt score:', activeResult.scorePercentage + '%'); // 100%

if (activeResult.scorePercentage !== 100 || !activeResult.passed) {
  throw new Error('Retry second attempt failed');
}

console.log('\nALL 5 TEST SUITES PASSED PERFECTLY!');
