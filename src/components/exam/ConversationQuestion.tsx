import React, { useState } from 'react';
import { Question } from '../../types';
import { AudioPlayer } from './AudioPlayer';

interface ConversationQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export function ConversationQuestion({ question, onAnswer, initialAnswer = '', onAutoNext }: ConversationQuestionProps) {
  const [selected, setSelected] = useState(initialAnswer);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Play audio when component mounts
  React.useEffect(() => {
    setIsPlaying(true);
  }, [question.id]);

  const handleAudioComplete = () => {
    setIsPlaying(false);
    setHasPlayed(true);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="mb-8 w-full">
         <AudioPlayer 
           text={question.prompt} 
           isPlaying={isPlaying} 
           onComplete={handleAudioComplete}
         />
      </div>

      <div className="w-full space-y-4">
        {question.options?.map((option, idx) => {
          const isSelected = selected === option;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  isSelected ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                </div>
                <span className="text-lg font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
