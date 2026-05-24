import * as Diff from 'diff';
import { WordDiff, EvaluationDetail } from '../types';

export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ');
}

export function compareSentences(expected: string, actual: string): EvaluationDetail {
  const normExpected = normalizeText(expected);
  const normActual = normalizeText(actual);

  if (!normActual) {
    return {
      status: 'unanswered',
      accurateExpected: expected,
      accuracyPercent: 0,
      diffs: [],
      missingWords: normExpected.split(' ').filter(Boolean),
      extraWords: []
    };
  }

  // Use diff package to compare words (case-insensitive)
  const diffs = Diff.diffWords(
    expected.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''), 
    actual.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''), 
    { ignoreCase: true }
  );

  let matchChars = 0;
  let totalExpectedChars = 0;
  
  const expectedWords = normExpected.split(' ').filter(Boolean);
  const actualWords = normActual.split(' ').filter(Boolean);

  let missingWords: string[] = [];
  let extraWords: string[] = [];

  diffs.forEach(part => {
    if (part.added) {
      extraWords.push(...part.value.trim().split(/\s+/).filter(Boolean));
    } else if (part.removed) {
      missingWords.push(...part.value.trim().split(/\s+/).filter(Boolean));
      totalExpectedChars += part.value.replace(/\s/g, '').length;
    } else {
      const matchLen = part.value.replace(/\s/g, '').length;
      matchChars += matchLen;
      totalExpectedChars += matchLen;
    }
  });

  // Basic word accuracy percentage based on character matches ignoring spaces for exact word matches
  // A simpler way: (total correct words) / (total expected words) or character level
  
  const accuracyPercent = totalExpectedChars === 0 ? 0 : Math.round((matchChars / totalExpectedChars) * 100);

  let status: EvaluationDetail['status'] = 'incorrect';
  if (accuracyPercent === 100) {
    status = 'correct';
  } else if (accuracyPercent > 60) {
    status = 'partial';
  }

  return {
    status,
    accurateExpected: expected,
    accuracyPercent,
    diffs,
    missingWords,
    extraWords
  };
}

export function evaluateCompletion(expectedAnswers: string[], actual: string): EvaluationDetail {
  if (!actual || actual.trim() === '') {
    return {
      status: 'unanswered',
      accurateExpected: expectedAnswers[0],
      accuracyPercent: 0
    };
  }

  let bestEval: EvaluationDetail | null = null;
  const normActual = normalizeText(actual);

  for (const expected of expectedAnswers) {
    const normExpected = normalizeText(expected);
    let accuracyPercent = 0;
    if (normExpected === normActual) {
      accuracyPercent = 100;
    } else {
      // Very basic similarity for completion
      // If it contains the word or similar
      const sim = 100 - (Math.abs(normExpected.length - normActual.length) / Math.max(normExpected.length, normActual.length) * 100);
      accuracyPercent = Math.max(0, sim);
    }
    
    let status: EvaluationDetail['status'] = accuracyPercent === 100 ? 'correct' : (accuracyPercent > 80 ? 'partial' : 'incorrect');

    if (!bestEval || accuracyPercent > bestEval.accuracyPercent) {
        bestEval = {
          status,
          accurateExpected: expected,
          accuracyPercent
        };
    }
  }

  return bestEval!;
}
