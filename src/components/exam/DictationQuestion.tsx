import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types';
import { Volume2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export function DictationQuestion({ question, onAnswer, initialAnswer = '', onAutoNext }: QuestionProps) {
  const [value, setValue] = useState(initialAnswer);
  const [phase, setPhase] = useState<'playing' | 'answering' | 'saving'>('playing');
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    setValue(initialAnswer);
    setPhase('playing');
    setTimeLeft(30);
    
    // Auto-play audio safely
    const playTimeout = setTimeout(() => {
      playAudio();
    }, 500);

    return () => {
      clearTimeout(playTimeout);
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Timer tick effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'answering') {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, question.id]);

  // Phase transition effect
  useEffect(() => {
    if (phase === 'answering' && timeLeft <= 0) {
      finishAndAdvance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const startTimer = () => {
    setPhase('answering');
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.prompt);
      
      // Prevent garbage collection bug in Chrome
      (window as any)._currentUtterance = utterance;

      utterance.onend = () => startTimer();
      utterance.onerror = () => startTimer();
      window.speechSynthesis.speak(utterance);
    } else {
      startTimer();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phase === 'saving') return;
    finishAndAdvance();
  };

  const finishAndAdvance = () => {
    setPhase('saving');
    // Short transition before moving to next question
    setTimeout(() => {
      if (onAutoNext) {
        onAutoNext();
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header section with Timer or Status */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden h-[72px]">
        {phase === 'answering' ? (
          <>
            <div className="absolute top-0 left-0 bottom-0 bg-blue-50 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 30) * 100}%` }} />
            <div className="relative flex items-center text-blue-600 font-bold text-lg">
               <Clock className="w-6 h-6 mr-3" />
               Time remaining: {timeLeft}s
            </div>
            <div className="relative text-sm text-gray-500 font-bold uppercase tracking-wider hidden sm:block">
               Answer before time runs out
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full text-blue-600 font-bold">
            {phase === 'playing' ? 'Playing audio...' : 'Submitting answer...'}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 py-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-center transition-colors min-h-[400px]">
        
        {phase === 'playing' && (
          <div className="text-gray-500 flex flex-col items-center animate-pulse">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <Volume2 className="w-12 h-12 text-blue-500" />
             </div>
             <p className="text-xl font-bold">Playing sentence audio...</p>
             <p className="text-sm text-gray-500 mt-2">Listen carefully</p>
          </div>
        )}

        {phase === 'saving' && (
          <div className="text-green-600 flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold">Answer saved</p>
            <p className="text-base text-gray-500 mt-2">Moving to next question...</p>
          </div>
        )}

        {phase === 'answering' && (
          <div className="w-full max-w-2xl px-4 animate-in fade-in zoom-in duration-300">
             <form onSubmit={handleSubmit} className="text-left w-full space-y-6">
               <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider pl-1 text-center">
                 Type the sentence you heard
               </label>
               <textarea
                 autoFocus
                 className="w-full min-h-[120px] p-4 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-medium text-lg leading-relaxed bg-white text-gray-900"
                 placeholder="Type what you heard..."
                 value={value}
                 onChange={(e) => {
                   setValue(e.target.value);
                   onAnswer(e.target.value);
                 }}
                 disabled={phase === 'saving'}
               />
               <div className="flex justify-center">
                 <Button onClick={handleSubmit} size="lg" className="px-10 py-4 text-lg rounded-2xl" disabled={!value.trim()}>
                   Submit
                 </Button>
               </div>
             </form>
          </div>
        )}
      </div>
    </div>
  );
}
