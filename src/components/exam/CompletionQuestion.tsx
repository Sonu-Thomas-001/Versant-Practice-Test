import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Clock, CheckCircle } from 'lucide-react';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export function CompletionQuestion({ question, onAnswer, initialAnswer = '', onAutoNext }: QuestionProps) {
  const [value, setValue] = useState(initialAnswer);
  const [timeLeft, setTimeLeft] = useState(25);
  const [phase, setPhase] = useState<'answering' | 'saving'>('answering');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setValue(initialAnswer);
    setTimeLeft(25);
    setPhase('answering');
    
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handleTimeUp = () => {
    // Save whatever is there and move on
    finishAndAdvance();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phase === 'saving') return;
    if (timerRef.current) clearInterval(timerRef.current);
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
      {/* Timer Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 bg-orange-50 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 25) * 100}%` }} />
        <div className="relative flex items-center text-orange-600 font-bold text-lg">
           <Clock className="w-6 h-6 mr-3" />
           Time remaining: {timeLeft}s
        </div>
        <div className="relative text-sm text-gray-500 font-bold uppercase tracking-wider">
           {phase === 'answering' ? 'Answer before time runs out' : 'Submitting answer...'}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 py-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-center transition-colors min-h-[400px]">
        {phase === 'saving' ? (
          <div className="text-green-600 flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold">Answer saved</p>
            <p className="text-base text-gray-500 mt-2">Moving to next question...</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl px-4 animate-in fade-in zoom-in duration-300">
             <form onSubmit={handleSubmit} className="text-center w-full space-y-8">
               <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl text-3xl font-medium text-center text-gray-800 leading-[4rem]">
                 {question.prompt.split('_______').map((part, i, arr) => (
                   <React.Fragment key={i}>
                     {part}
                     {i < arr.length - 1 && (
                       <input
                         type="text"
                         autoFocus
                         className="inline-block border-b-4 border-gray-300 focus:border-blue-500 bg-transparent mx-2 text-center text-blue-600 font-bold outline-none min-w-[120px] transition-colors"
                         style={{ width: Math.max(120, value.length * 20) + 'px' }}
                         value={value}
                         onChange={(e) => {
                           setValue(e.target.value);
                           onAnswer(e.target.value);
                         }}
                         disabled={phase === 'saving'}
                       />
                     )}
                   </React.Fragment>
                 ))}
               </div>
               
               <div>
                 <Button type="submit" size="lg" className="px-10 py-6 text-xl rounded-2xl" disabled={phase === 'saving' || !value.trim()}>
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
