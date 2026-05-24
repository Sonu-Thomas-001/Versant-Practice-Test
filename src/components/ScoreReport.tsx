import React, { useRef, useState, useEffect } from 'react';
import { ExamResult } from '../types';
import { calculateDerivedScores, getSkillDescription } from '../utils/scoring';
import { Button } from './ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Download, Printer, ChevronRight, Loader2 } from 'lucide-react';
import { DetailedReview } from './DetailedReview';

interface ScoreReportProps {
  result: ExamResult;
  onRestart: () => void;
}


interface LLMReport {
  overallSummary?: string;
  speakingSummary?: string;
  listeningSummary?: string;
  readingSummary?: string;
  writingSummary?: string;
  speakingTip?: string;
  listeningTip?: string;
  readingTip?: string;
  writingTip?: string;
}

export function ScoreReport({ result, onRestart }: ScoreReportProps) {
  const scores = calculateDerivedScores(result.sections);
  const printRef = useRef<HTMLDivElement>(null);
  
  const [llmReport, setLlmReport] = useState<LLMReport | null>(null);
  const [loadingLlm, setLoadingLlm] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores, sectionScores: result.sections })
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.error) {
             setLlmReport(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch LLM report", err);
      } finally {
        setLoadingLlm(false);
      }
    }
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const chartData = [
    { name: 'Speaking', score: scores.speaking, fill: '#3b82f6' },
    { name: 'Listening', score: scores.listening, fill: '#8b5cf6' },
    { name: 'Reading', score: scores.reading, fill: '#10b981' },
    { name: 'Writing', score: scores.writing, fill: '#f59e0b' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8 print:p-0 print:bg-white flex flex-col items-center">
      
      {/* Controls - Hidden in Print */}
      <div className="w-full max-w-[850px] mb-4 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={onRestart} className="font-semibold bg-white">
          ← Back to Dashboard
        </Button>
        <div className="space-x-3">
          <Button onClick={handlePrint} className="font-semibold shadow-sm text-sm">
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div ref={printRef} className="w-full max-w-[850px] bg-white shadow-2xl print:shadow-none print:w-full">
        
        {/* ================= PAGE 1 ================= */}
        <div className="w-full aspect-[1/1.414] overflow-hidden flex flex-col print:break-after-page page-break-after-always">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8">
             <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1">Versant™ 4 Skills Essential</h1>
                  <h2 className="text-slate-400 font-medium tracking-widest uppercase text-sm">Practice Test Score Report</h2>
                </div>
             </div>
             
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium border-t border-slate-700 pt-4">
                <div>
                  <p className="text-slate-400 uppercase text-xs mb-1">Candidate</p>
                  <p className="text-white">Sample Candidate</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-xs mb-1">Test ID</p>
                  <p className="text-white">PRAC-9082-VT</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-xs mb-1">Test Date</p>
                  <p className="text-white">{currentDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase text-xs mb-1">Overall Status</p>
                  <p className="text-white">{result.passed ? 'Completed' : 'Reviewed'}</p>
                </div>
             </div>
          </div>

          <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 content-start">
            
            {/* Left Big Score Area */}
            <div className="md:col-span-1 space-y-6">
               <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                  <h3 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Overall Score</h3>
                  <div className="text-7xl font-black text-gray-900 mb-2 font-mono tracking-tighter">
                    {scores.overall}
                  </div>
                  <div className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-full text-lg shadow-sm">
                    CEFR: {scores.cefr}
                  </div>
               </div>

               <div className="text-sm text-gray-600 leading-relaxed font-medium">
                 {loadingLlm ? (
                   <span className="flex items-center text-blue-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing overall performance...</span>
                 ) : (
                   llmReport?.overallSummary || "The Overall Score is an average of the four skill scores. It measures the ability to understand and use English in everyday and workplace situations."
                 )}
               </div>
            </div>

            {/* Right Skills Summary */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Skill Summary</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                   { label: 'Speaking', val: scores.speaking, color: 'bg-blue-500' },
                   { label: 'Listening', val: scores.listening, color: 'bg-violet-500' },
                   { label: 'Reading', val: scores.reading, color: 'bg-emerald-500' },
                   { label: 'Writing', val: scores.writing, color: 'bg-amber-500' }
                 ].map((s) => (
                   <div key={s.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
                     <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{s.label}</span>
                     <div className="text-3xl font-extrabold text-gray-900">{s.val}</div>
                     <div className={`mt-2 w-10 h-1.5 rounded-full ${s.color}`} />
                   </div>
                 ))}
              </div>

              <div className="h-64 mt-6 border border-gray-100 rounded-xl p-4 shadow-inner bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontWeight: 600, fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={[10, 90]} 
                      ticks={[10, 30, 50, 70, 90]} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <ReferenceLine y={scores.overall} stroke="#94a3b8" strokeDasharray="3 3" />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                       {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
          
          {/* Footer Area Page 1 */}
          <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <p>Mock Test Simulator • AI-Powered Assessment</p>
            <p className="font-bold">Page 1 of 2</p>
          </div>
        </div>


        {/* ================= PAGE 2 ================= */}
        <div className="w-full aspect-[1/1.414] overflow-hidden flex flex-col bg-white print:break-before-page page-break-before-always border-t-8 border-slate-900">
           
           <div className="p-8 pb-4">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Detailed Capability Analysis</h2>
             <p className="text-gray-500 font-medium mt-1">Breakdown of specific skill competencies and recommendations for improvement.</p>
           </div>

           <div className="p-8 pt-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 content-start">
             
             {(['speaking', 'listening', 'reading', 'writing'] as const).map((skill) => {
               const sScore = scores[skill];
               const details = getSkillDescription(skill, sScore);
               
               let color = 'text-blue-600 bg-blue-50 border-blue-200';
               let badgeColor = 'bg-blue-600';
               if (skill === 'listening') { color = 'text-violet-600 bg-violet-50 border-violet-200'; badgeColor = 'bg-violet-600'; }
               if (skill === 'reading') { color = 'text-emerald-600 bg-emerald-50 border-emerald-200'; badgeColor = 'bg-emerald-600'; }
               if (skill === 'writing') { color = 'text-amber-600 bg-amber-50 border-amber-200'; badgeColor = 'bg-amber-500'; }

               return (
                 <div key={skill} className="space-y-4">
                    <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${color}`}>
                       <h3 className="text-xl font-black uppercase tracking-wider">{skill}</h3>
                       <div className="flex items-center space-x-3">
                         <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full text-sm shadow-sm">
                           GSE: {sScore}
                         </span>
                       </div>
                    </div>
                    
                    <div className="pl-2 pr-4 space-y-4">
                      <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">
                           <ChevronRight className="w-4 h-4 text-gray-400 mr-1" /> Current Capabilities
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {loadingLlm ? <span className="animate-pulse bg-gray-200 text-transparent rounded">Loading capability analysis from AI...</span> : (llmReport?.[`${skill}Summary` as keyof LLMReport] || details.summary)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-2 flex items-center">
                           <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2" /> Improvement Tip
                        </h4>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                          {loadingLlm ? <span className="animate-pulse bg-gray-200 text-transparent rounded">Loading actionable tip...</span> : (llmReport?.[`${skill}Tip` as keyof LLMReport] ? `"${llmReport[`${skill}Tip` as keyof LLMReport]}"` : `"${details.tip}"`)}
                        </p>
                      </div>
                    </div>
                 </div>
               );
             })}
           </div>

           {/* Generic Info Panel */}
           <div className="m-8 p-6 bg-slate-800 rounded-2xl text-slate-300 text-sm">
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider">Understanding The Scores</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <strong className="text-white block mb-1">GSE (10-90)</strong>
                  The Global Scale of English measures proficiency on a granular scale. 10 is absolute beginner, 90+ is expert/native-like. 
                </div>
                <div>
                  <strong className="text-white block mb-1">CEFR Band</strong>
                  The Common European Framework of Reference provides a standard descriptive level from A1 (Beginner) to C2 (Mastery).
                </div>
              </div>
           </div>

           {/* Footer Area Page 2 */}
           <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
             <p>Candidate ID: PRAC-9082-VT • Date: {currentDate}</p>
             <p className="font-bold">Page 2</p>
           </div>

        </div>

        <DetailedReview detailedAnswers={result.detailedAnswers} />

      </div>
      
      {/* Fallback space for very bottom */}
      <div className="h-12 w-full print:hidden"></div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break-after-always { page-break-after: always; }
          .page-break-before-always { page-break-before: always; }
        }
      `}} />
    </div>
  );
}
