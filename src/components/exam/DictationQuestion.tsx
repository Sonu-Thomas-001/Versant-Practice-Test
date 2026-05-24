import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Volume2 } from 'lucide-react';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
}

export function DictationQuestion({ question, onAnswer, initialAnswer = '' }: QuestionProps) {
  const [value, setValue] = useState(initialAnswer);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    setValue(initialAnswer);
    return () => {
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.prompt);
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4 bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Volume2 className="w-24 h-24" />
        </div>
        
        <button 
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all z-10 ${isPlaying ? 'bg-blue-400 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <Volume2 className="w-10 h-10" />
        </button>
        <p className="text-gray-700 font-medium text-lg z-10">
          {isPlaying ? 'Listen carefully...' : 'Click to hear the dictation'}
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Type exactly what you hear
        </label>
        <textarea
          autoFocus
          className="w-full min-h-[120px] p-4 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium text-lg leading-relaxed"
          placeholder="Start typing..."
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
