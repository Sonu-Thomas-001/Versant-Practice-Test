import { Question, ExamResult } from '../types';

// Simple Levenshtein distance for string comparison
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

function normalizeString(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ');
}

// Calculate similarity ratio between 0 and 1
function getStringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  
  const distance = getLevenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

export function evaluateAnswer(question: Question, userAnswer: string): number {
  if (!userAnswer || userAnswer.trim() === '') return 0;

  const normalizedUser = normalizeString(userAnswer);
  let isCorrect = false;
  let similarityScore = 0;
  let maxMarks = question.marks;

  const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
  
  for (const correctOpt of correctAnswers) {
    const normalizedCorrect = normalizeString(correctOpt);
    const sim = getStringSimilarity(normalizedUser, normalizedCorrect);
    if (sim > similarityScore) {
      similarityScore = sim;
    }
  }

  // Scoring thresholds depending on question type
  switch (question.type) {
    case 'repeat':
    case 'dictation':
      // Needs to be fairly accurate
      if (similarityScore > 0.8) return maxMarks;
      if (similarityScore > 0.6) return maxMarks * 0.5;
      return 0;

    case 'build':
    case 'completion':
      // Almost exact match required
      if (similarityScore > 0.9) return maxMarks;
      return 0;

    case 'reconstruction':
      // More lenient for long passage
      if (similarityScore > 0.7) return maxMarks;
      if (similarityScore > 0.5) return maxMarks * 0.75;
      if (similarityScore > 0.3) return maxMarks * 0.5;
      return 0;

    default:
      return 0;
  }
}

export function generateFeedback(sectionScorePercentage: number): string {
  if (sectionScorePercentage >= 0.8) return "Excellent! You perform well here.";
  if (sectionScorePercentage >= 0.6) return "Good, but there's room for improvement.";
  if (sectionScorePercentage >= 0.4) return "Fair. Try to practice this area more.";
  return "Needs significant improvement. Focus on these exercises.";
}
