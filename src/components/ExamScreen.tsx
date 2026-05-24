import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import { EXAM_DURATION } from '../data/questions';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { QuestionRenderer } from './exam/QuestionRenderer';
import { Clock, HelpCircle } from 'lucide-react';

interface ExamScreenProps {
  questions: Question[];
  onComplete: (answers: Record<string, UserAnswer>) => void;
}

export function ExamScreen({ questions, onComplete }: ExamScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(answers);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answers, onComplete]);

  // Load existing answer when navigating back or forward
  useEffect(() => {
    const saved = answers[questions[currentIdx].id]?.answer || '';
    setCurrentAnswer(saved);
  }, [currentIdx, questions, answers]);

  const handleNext = () => {
    const q = questions[currentIdx];
    
    // Save current answer
    const newAnswers = { ...answers };
    newAnswers[q.id] = { questionId: q.id, answer: currentAnswer };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    // Save current answer before moving back
    const q = questions[currentIdx];
    setAnswers({ ...answers, [q.id]: { questionId: q.id, answer: currentAnswer } });
    
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const currentQuestion = questions[currentIdx];
  const progress = (currentIdx + 1) / questions.length;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
             <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wider">
               {currentQuestion.sectionName.split(':')[0]}
             </div>
             <span className="font-semibold text-gray-700 text-lg hidden sm:block">
               {currentQuestion.sectionName.split(':')[1]}
             </span>
          </div>
          <div className="flex items-center space-x-2 text-red-600 font-mono text-xl font-bold bg-red-50 px-4 py-2 rounded-lg">
             <Clock className="w-5 h-5" />
             <span>{timeString}</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <ProgressBar progress={progress} className="h-3" />
        </div>

        {/* Question Area */}
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col justify-between">
           <div>
             <div className="flex items-start space-x-3 text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg">
                <HelpCircle className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-lg font-medium">{currentQuestion.instruction}</p>
             </div>
             
             <QuestionRenderer 
               question={currentQuestion}
               onAnswer={setCurrentAnswer}
               initialAnswer={currentAnswer}
               onAutoNext={handleNext}
               key={currentQuestion.id} // Ensure reset on load if reusing
             />
           </div>

           {currentQuestion.tip && (
             <div className="mt-8 text-sm italic text-gray-500 border-l-4 border-yellow-400 pl-4 py-1">
               Tip: {currentQuestion.tip}
             </div>
           )}
        </div>

        {/* Navigation */}
        {currentQuestion.type !== 'repeat' && (
          <div className="flex justify-between pt-4">
             <Button variant="outline" onClick={handlePrevious} disabled={currentIdx === 0} className="w-32">
               Previous
             </Button>
             <Button onClick={handleNext} className="w-32 shadow-md">
               {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next'}
             </Button>
          </div>
        )}

      </div>
    </div>
  );
}
