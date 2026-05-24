import React, { useState, useEffect } from 'react';
import { Question } from '../../types';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
}

export function ReconstructionQuestion({ question, onAnswer, initialAnswer = '' }: QuestionProps) {
  const [value, setValue] = useState(initialAnswer);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 30);
  const [canType, setCanType] = useState(false);
  
  useEffect(() => {
    // Reset state when question changes
    setValue(initialAnswer);
    setTimeLeft(question.timeLimit || 30);
    setCanType(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (timeLeft > 0 && !canType) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canType) {
      setCanType(true);
    }
  }, [timeLeft, canType]);

  return (
    <div className="space-y-6">
      {!canType ? (
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-lg text-gray-800 leading-relaxed shadow-inner text-center">
          <p className="mb-6">{question.prompt}</p>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold">
             Disappears in {timeLeft}s
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-medium">
            Story hidden. Now reconstruct the passage from memory. Do your best!
          </div>
          <textarea
            autoFocus
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium text-lg leading-relaxed shadow-sm"
            placeholder="Type your reconstructed paragraph here..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onAnswer(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
}
