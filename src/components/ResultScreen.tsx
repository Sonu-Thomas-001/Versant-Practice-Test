import React from 'react';
import { ExamResult, SectionType } from '../types';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultScreenProps {
  result: ExamResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const scorePercentage = result.totalScore / result.maxScore;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Main Score Card */}
        <Card className="text-center overflow-hidden shadow-xl border-0">
          <div className={`p-8 text-white ${result.passed ? 'bg-green-600' : 'bg-red-600'}`}>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              Test {result.passed ? 'Passed!' : 'Failed'}
            </h1>
            <p className="text-lg opacity-90 font-medium">
              You scored {result.totalScore} out of {result.maxScore}
            </p>
          </div>
          <CardContent className="p-8 pb-10 bg-white">
             <div className="max-w-md mx-auto mt-4">
               <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                 <span>Your Score: {Math.round(scorePercentage * 100)}%</span>
                 <span>Passing: ~61% (49/80)</span>
               </div>
               <ProgressBar 
                 progress={scorePercentage} 
                 className="h-4 bg-gray-200" 
                 indicatorClassName={result.passed ? 'bg-green-500' : 'bg-red-500'} 
               />
             </div>
             
             <p className="mt-8 text-xl text-gray-700 font-medium">
               {result.passed ? "Congratulations! You have demonstrated good language proficiency." : "Don't give up! Review the feedback below and try again."}
             </p>
          </CardContent>
        </Card>

        {/* Section Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.entries(result.sections) as [SectionType, any][]).map(([section, data]) => {
            const secScorePercent = data.maxScore > 0 ? data.score / data.maxScore : 0;
            return (
              <Card key={section} className="shadow-sm">
                <CardHeader className="pb-2">
                   <CardTitle className="text-lg font-bold flex justify-between items-center text-gray-800">
                     <span>Part {section}</span>
                     <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                       {data.score} / {data.maxScore}
                     </span>
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <ProgressBar progress={secScorePercent} className="h-2 mb-4" />
                   <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 font-medium leading-relaxed">
                     {data.feedback}
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Review */}
        <Card className="shadow-sm">
           <CardHeader>
             <CardTitle className="text-2xl font-bold">Answer Review</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
             {result.detailedAnswers.map((detail, idx) => (
                <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl space-y-3 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${detail.marksAwarded === detail.question.marks ? 'bg-green-500' : detail.marksAwarded > 0 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                       <span className="font-bold text-gray-500 w-8">{detail.question.id}.</span>
                       <span className="font-semibold text-gray-800 text-lg">{detail.question.sectionName}</span>
                    </div>
                    <div className="font-mono text-sm px-3 py-1 bg-gray-100 rounded-full font-bold text-gray-600">
                      {detail.marksAwarded} / {detail.question.marks}
                    </div>
                  </div>

                  <div className="pl-10 space-y-3 pt-2 text-[15px]">
                     <div>
                       <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Question</span>
                       <p className="text-gray-900 border-l-2 border-gray-300 pl-3 py-1 bg-gray-50 rounded-r-md">{detail.question.prompt || detail.question.instruction}</p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Your Answer</span>
                          <p className={`font-medium py-2 px-3 rounded-md border ${detail.marksAwarded > 0 ? (detail.marksAwarded === detail.question.marks ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200') : 'bg-red-50 text-red-800 border-red-200'}`}>
                            {detail.userAnswer || <span className="italic opacity-50">No answer provided</span>}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Correct Answer</span>
                          <p className="font-medium bg-gray-50 text-gray-800 py-2 px-3 rounded-md border border-gray-200">
                            {Array.isArray(detail.question.correctAnswer) ? detail.question.correctAnswer[0] : detail.question.correctAnswer}
                          </p>
                        </div>
                     </div>
                  </div>
                </div>
             ))}
           </CardContent>
        </Card>

        <div className="flex justify-center pb-12">
          <Button size="lg" onClick={onRestart} className="px-10 py-6 text-lg font-bold shadow-md">Start New Practice</Button>
        </div>
      </div>
    </div>
  );
}
