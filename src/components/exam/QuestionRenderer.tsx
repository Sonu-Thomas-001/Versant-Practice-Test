import React from 'react';
import { Question } from '../../types';
import { RepeatQuestion } from './RepeatQuestion';
import { BuildQuestion } from './BuildQuestion';
import { ConversationQuestion } from './ConversationQuestion';
import { CompletionQuestion } from './CompletionQuestion';
import { DictationQuestion } from './DictationQuestion';
import { ReconstructionQuestion } from './ReconstructionQuestion';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, initialAnswer = '', onAutoNext }) => {
  switch (question.type) {
    case 'repeat':
      return <RepeatQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    case 'build':
      return <BuildQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    case 'conversation':
      return <ConversationQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    case 'completion':
      return <CompletionQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    case 'dictation':
      return <DictationQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    case 'reconstruction':
      return <ReconstructionQuestion question={question} onAnswer={onAnswer} initialAnswer={initialAnswer} onAutoNext={onAutoNext} />;
    default:
      return <div>Unknown question type</div>;
  }
}
