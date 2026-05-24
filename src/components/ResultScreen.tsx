import React from 'react';
import { ExamResult } from '../types';
import { ScoreReport } from './ScoreReport';

interface ResultScreenProps {
  result: ExamResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return <ScoreReport result={result} onRestart={onRestart} />;
}

