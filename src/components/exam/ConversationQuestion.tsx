import React, { useState, useEffect } from 'react';
import { Question } from '../../types';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
}

export function ConversationQuestion({ question, onAnswer, initialAnswer = '' }: QuestionProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-line text-lg">
        {question.prompt}
      </div>
      <div className="space-y-3">
        {question.options?.map((option, idx) => (
          <label key={idx} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${initialAnswer === option ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
            <input
              type="radio"
              name={`q-${question.id}`}
              value={option}
              checked={initialAnswer === option}
              onChange={(e) => onAnswer(e.target.value)}
              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-lg font-medium text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
