import React, { useState, useEffect } from 'react';
import { Question } from '../../types';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
}

export function BuildQuestion({ question, onAnswer, initialAnswer = '' }: QuestionProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  useEffect(() => {
    // If there's an initial answer, parse it, else setup initial available words
    if (initialAnswer) {
      const parts = initialAnswer.split(' ').filter(p => p.trim());
      setSelectedWords(parts);
      const remaining = (question.jumbledWords || []).filter(w => !parts.includes(w));
      setAvailableWords(remaining);
    } else {
      setSelectedWords([]);
      setAvailableWords(question.jumbledWords || []);
    }
  }, [question, initialAnswer]);

  const handleSelect = (word: string) => {
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setAvailableWords(availableWords.filter(w => w !== word));
    onAnswer(newSelected.join(' '));
  };

  const handleDeselect = (word: string, index: number) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
    onAnswer(newSelected.join(' '));
  };

  return (
    <div className="space-y-8">
      <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-wrap gap-2 items-center bg-gray-50">
        {selectedWords.length === 0 ? (
          <span className="text-gray-400">Select words to build the sentence...</span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => handleDeselect(word, idx)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium hover:bg-blue-200 transition-colors"
            >
              {word}
            </button>
          ))
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Available words:</p>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => handleSelect(word)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
