import React from 'react';
import { DetailedAnswer, WordDiff } from '../types';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface DetailedReviewProps {
  detailedAnswers: DetailedAnswer[];
}

export function DetailedReview({ detailedAnswers }: DetailedReviewProps) {
  const partsToReview = detailedAnswers.filter(a => a.question.section === 'C' || a.question.section === 'D' || a.question.section === 'E' || a.question.section === 'F');

  if (partsToReview.length === 0) return null;

  const partC = partsToReview.filter(a => a.question.section === 'C');
  const partD = partsToReview.filter(a => a.question.section === 'D');
  const partE = partsToReview.filter(a => a.question.section === 'E');
  const partF = partsToReview.filter(a => a.question.section === 'F');

  return (
    <div className="w-full bg-white print:break-before-page page-break-before-always border-t-8 border-slate-900 flex flex-col">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Detailed Answer Review</h2>
        <p className="text-gray-500 font-medium mt-1">Review of Conversations, Sentence Completion, Dictation, and Passage Reconstruction.</p>
      </div>

      <div className="p-8 pt-4 flex-1 space-y-8">
        {partC.length > 0 && (
          <section>
            <h3 className="text-xl font-bold border-b pb-2 mb-4">Part C: Conversations</h3>
            <div className="space-y-6">
              {partC.map((ans, idx) => (
                <ReviewCard key={ans.question.id} answer={ans} index={idx} />
              ))}
            </div>
          </section>
        )}

        {partD.length > 0 && (
          <section className="print:break-before-page page-break-before-always">
            <h3 className="text-xl font-bold border-b pb-2 mb-4">Part D: Sentence Completion</h3>
            <div className="space-y-6">
              {partD.map((ans, idx) => (
                <ReviewCard key={ans.question.id} answer={ans} index={idx} />
              ))}
            </div>
          </section>
        )}

        {partE.length > 0 && (
           <section className="print:break-before-page page-break-before-always">
             <h3 className="text-xl font-bold border-b pb-2 mb-4">Part E: Dictation</h3>
             <div className="space-y-6">
               {partE.map((ans, idx) => (
                 <ReviewCard key={ans.question.id} answer={ans} index={idx} />
               ))}
             </div>
           </section>
        )}

        {partF.length > 0 && (
           <section className="print:break-before-page page-break-before-always">
             <h3 className="text-xl font-bold border-b pb-2 mb-4">Part F: Passage Reconstruction</h3>
             <div className="space-y-6">
               {partF.map((ans, idx) => (
                 <ReviewCard key={ans.question.id} answer={ans} index={idx} />
               ))}
             </div>
           </section>
        )}
      </div>
      
      <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
         <p>Mock Test Simulator • AI-Powered Assessment</p>
         <p className="font-bold">Detailed Review</p>
      </div>
    </div>
  );
}

const ReviewCard: React.FC<{ answer: DetailedAnswer, index: number }> = ({ answer, index }) => {
  const { question, userAnswer, evaluation } = answer;
  
  const isCorrect = evaluation?.status === 'correct';
  const isPartial = evaluation?.status === 'partial';
  const isUnanswered = evaluation?.status === 'unanswered' || !userAnswer;

  const statusColor = isCorrect ? 'text-green-600 bg-green-50 border-green-200' :
                      isPartial ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                      isUnanswered ? 'text-gray-500 bg-gray-50 border-gray-200' :
                      'text-red-600 bg-red-50 border-red-200';

  const StatusIcon = isCorrect ? CheckCircle2 :
                     isPartial ? AlertCircle : XCircle;

  return (
    <div className={`p-4 rounded-xl border ${statusColor} shadow-sm overflow-hidden break-inside-avoid print:break-inside-avoid`}>
       <div className="flex justify-between items-start mb-3">
         <h4 className="font-bold text-sm tracking-wider uppercase flex items-center">
            <span className="mr-2 opacity-60">Q{index + 1}</span> {question.sectionName}
         </h4>
         <div className="flex items-center space-x-2">
            <span className="text-sm font-bold opacity-80">{evaluation?.accuracyPercent ?? 0}% Match</span>
            <StatusIcon className="w-5 h-5" />
         </div>
       </div>

       <div className="space-y-4 text-sm font-medium">
          <div className="bg-white/50 p-3 rounded border border-white/40">
             <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">Prompt</span>
             <p className="text-gray-900">{question.prompt}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-3 rounded shadow-sm border border-white">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">Your Answer</span>
                <p className="text-gray-900 italic">
                  {userAnswer ? `"${userAnswer}"` : <span className="opacity-50">No answer provided</span>}
                </p>
             </div>
             
             <div className="bg-white p-3 rounded shadow-sm border border-white">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">Expected Answer</span>
                <p className="text-gray-900">
                  "{evaluation?.accurateExpected || (Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer)}"
                </p>
             </div>
          </div>

          {evaluation?.diffs && evaluation.diffs.length > 0 && (
             <div className="bg-white p-3 rounded shadow-sm border border-white">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">Differences</span>
                <div className="text-gray-900 leading-relaxed font-mono text-sm break-words whitespace-pre-wrap">
                   {evaluation.diffs.map((diff, dIdx) => (
                      <span key={dIdx} className={
                        diff.added ? 'bg-red-100 text-red-800 px-1 py-0.5 rounded mr-1' :
                        diff.removed ? 'bg-green-100 text-green-800 px-1 py-0.5 rounded mr-1 line-through opacity-70' :
                        'text-gray-600 mr-1'
                      }>
                         {diff.value}
                      </span>
                   ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 bg-red-100 mr-1 align-middle"></span> You typed this (Extra/Incorrect)
                  <span className="inline-block w-3 h-3 bg-green-100 ml-4 mr-1 align-middle"></span> Expected this (Missing)
                </div>
             </div>
          )}

          {(evaluation?.missingWords && evaluation.missingWords.length > 0) ? (
             <div className="bg-white p-3 rounded shadow-sm border border-white text-xs">
                <span className="font-bold opacity-60">Missing words: </span>
                <span className="text-gray-700">{evaluation.missingWords.join(', ')}</span>
             </div>
          ) : null}

          {question.tip && (
             <div className="bg-blue-50/50 p-3 rounded shadow-sm border border-blue-100/50 text-xs text-blue-900">
                <span className="font-bold opacity-70">Note: </span>
                <span className="opacity-90">{question.tip}</span>
             </div>
          )}
       </div>
    </div>
  );
}
