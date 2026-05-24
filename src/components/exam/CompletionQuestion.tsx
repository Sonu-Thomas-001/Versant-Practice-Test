import React, { useState, useEffect } from 'react';
import { Question } from '../../types';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
}

export function CompletionQuestion({ question, onAnswer, initialAnswer = '' }: QuestionProps) {
  const [value, setValue] = useState(initialAnswer);
  
  useEffect(() => {
    setValue(initialAnswer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg text-xl font-medium text-center text-gray-800">
        {question.prompt}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type the missing word:
        </label>
        <input
          type="text"
          autoFocus
          className="w-full p-4 border border-gray-300 rounded-lg font-medium text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter one word..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onAnswer(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
