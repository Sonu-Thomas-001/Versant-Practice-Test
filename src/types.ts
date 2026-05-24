export type SectionType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Question {
  id: string;
  section: SectionType;
  sectionName: string;
  instruction: string;
  prompt: string; // The audio transcript or reading text
  type: 'repeat' | 'build' | 'conversation' | 'completion' | 'dictation' | 'reconstruction';
  correctAnswer: string | string[]; // Single string for exact, array for acceptable choices
  options?: string[]; // Multiple choice options for conversation
  jumbledWords?: string[]; // For sentence building
  marks: number;
  timeLimit?: number;
  tip?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  confidence?: number;
}

export interface ExamState {
  hasStarted: boolean;
  isFinished: boolean;
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  timeRemaining: number; // in seconds
}

export interface SectionResult {
  score: number;
  maxScore: number;
  feedback: string;
}

export interface WordDiff {
  value: string;
  added?: boolean;
  removed?: boolean;
  ignored?: boolean;
}

export interface EvaluationDetail {
  status: 'correct' | 'partial' | 'incorrect' | 'unanswered';
  accurateExpected: string; // The specific correct answer matched against
  accuracyPercent: number;
  diffs?: WordDiff[];
  missingWords?: string[];
  extraWords?: string[];
}

export interface DetailedAnswer {
  question: Question;
  userAnswer: string;
  marksAwarded: number;
  evaluation?: EvaluationDetail;
}

export interface ExamResult {
  totalScore: number;
  maxScore: number;
  passed: boolean;
  sections: Record<SectionType, SectionResult>;
  detailedAnswers: DetailedAnswer[];
}
