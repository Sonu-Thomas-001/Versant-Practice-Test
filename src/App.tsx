import React, { useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { questions } from './data/questions';
import { evaluateAnswer, generateFeedback } from './lib/scoring';
import { compareSentences, evaluateCompletion } from './lib/comparison';
import { ExamState, ExamResult, UserAnswer, SectionType, DetailedAnswer } from './types';

export default function App() {
  const [examState, setExamState] = useState<'landing' | 'countdown' | 'exam' | 'result'>('landing');
  const [result, setResult] = useState<ExamResult | null>(null);

  const [selectedSections, setSelectedSections] = useState<SectionType[]>(['A', 'B', 'C', 'D', 'E', 'F']);
  const [activeQuestions, setActiveQuestions] = useState(questions);

  const handleStart = (sections: SectionType[]) => {
    setSelectedSections(sections);
    setActiveQuestions(questions.filter(q => sections.includes(q.section)));
    setExamState('countdown');
  };

  const handleCountdownComplete = () => {
    setExamState('exam');
  };

  const handleComplete = (userAnswers: Record<string, UserAnswer>) => {
    let totalScore = 0;
    const sections: Record<SectionType, any> = {
      A: { score: 0, maxScore: 0, feedback: '' },
      B: { score: 0, maxScore: 0, feedback: '' },
      C: { score: 0, maxScore: 0, feedback: '' },
      D: { score: 0, maxScore: 0, feedback: '' },
      E: { score: 0, maxScore: 0, feedback: '' },
      F: { score: 0, maxScore: 0, feedback: '' },
    };

    const detailedAnswers: DetailedAnswer[] = activeQuestions.map((q) => {
      const uAnswer = userAnswers[q.id]?.answer || '';
      
      let marksAwarded = 0;
      marksAwarded = evaluateAnswer(q, uAnswer);
      marksAwarded = Math.round(marksAwarded * 10) / 10; 

      totalScore += marksAwarded;
      sections[q.section].score += marksAwarded;
      sections[q.section].maxScore += q.marks;

      const detailedAnswer: DetailedAnswer = {
        question: q,
        userAnswer: uAnswer,
        marksAwarded,
      };

      if (q.section === 'D') {
        const correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        detailedAnswer.evaluation = evaluateCompletion(correctAnswers, uAnswer);
      } else if (q.section === 'E') {
        const expected = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
        detailedAnswer.evaluation = compareSentences(expected, uAnswer);
      }

      return detailedAnswer;
    });


    // Generate feedback for each section
    (Object.keys(sections) as SectionType[]).forEach(sec => {
      const s = sections[sec];
      const p = s.maxScore > 0 ? s.score / s.maxScore : 0;
      s.feedback = generateFeedback(p);
    });

    let totalMaxScore = 0;
    (Object.keys(sections) as SectionType[]).forEach(sec => {
      totalMaxScore += sections[sec].maxScore;
    });

    const calculatedPassingScore = Math.floor(totalMaxScore * 0.6125); // ~61% of max like before

    setResult({
      totalScore: Math.round(totalScore),
      maxScore: totalMaxScore,
      passed: totalScore >= calculatedPassingScore,
      sections,
      detailedAnswers
    });

    setExamState('result');
  };

  const handleRestart = () => {
    setResult(null);
    setExamState('landing');
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      {examState === 'landing' && <LandingScreen onStart={handleStart} />}
      {examState === 'countdown' && <CountdownScreen onComplete={handleCountdownComplete} />}
      {examState === 'exam' && <ExamScreen questions={activeQuestions} onComplete={handleComplete} />}
      {examState === 'result' && result && <ResultScreen result={result} onRestart={handleRestart} />}
    </div>
  );
}
