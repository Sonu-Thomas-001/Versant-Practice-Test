import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Volume2, Mic, CheckCircle, Loader2, Play } from 'lucide-react';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string, confidence?: number) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export function RepeatQuestion({ question, onAnswer, initialAnswer = '', onAutoNext }: QuestionProps) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'recording' | 'saving'>('idle');
  const [value, setValue] = useState(initialAnswer);
  const [manualFallback, setManualFallback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    // Reset state for new question
    setValue(initialAnswer);
    setPhase('idle');
    setManualFallback(false);
    setTimeLeft(15);
    
    // Auto start playing after a short delay
    const playTimer = setTimeout(() => {
       playAudio();
    }, 500);

    return () => {
      clearTimeout(playTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Timer tick effect for recording phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'recording') {
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
    if (phase === 'recording' && timeLeft <= 0) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      finishAndAdvance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const playAudio = () => {
    setPhase('playing');
    setManualFallback(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(question.prompt);
        (window as any)._currentUtterance = utterance;
        utterance.onstart = () => setPhase('playing');
        utterance.onend = () => {
          startRecording();
        };
        utterance.onerror = (e) => {
          console.error('Speech synthesis errored', e);
          setManualFallback(true);
        };
        window.speechSynthesis.speak(utterance);
        
        // Fallback in case onstart fails to trigger on mobile due to lack of standard interaction
        setTimeout(() => {
          if (window.speechSynthesis.pending && !window.speechSynthesis.speaking) {
            setManualFallback(true);
          }
        }, 1000);
      }, 50);
    } else {
      setManualFallback(true);
    }
  };

  const startRecording = () => {
    setPhase('recording');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Fallback: Give user some time to type
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      let totalConfidence = 0;
      let count = 0;
      
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i][0].confidence > 0) {
          totalConfidence += event.results[i][0].confidence;
          count++;
        }
      }
      setValue(currentTranscript);
      
      const avgConfidence = count > 0 ? totalConfidence / count : undefined;
      onAnswer(currentTranscript, avgConfidence);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'no-speech') {
        // Just let the timer run out if there's no speech or no mic access
      }
    };
    
    // If it stops recording prematurely, restart it if we are still in recording phase
    recognition.onend = () => {
      if (phaseRef.current === 'recording') {
        try {
          recognition.start();
        } catch (e) {
          console.error('Restarting speech recognition error:', e);
        }
      }
    };
    
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
    }
  };

  const finishAndAdvance = () => {
    setPhase('saving');
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    // Short transition before moving to next question
    setTimeout(() => {
      if (onAutoNext) {
        onAutoNext();
      }
    }, 1500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phase === 'saving') return;
    finishAndAdvance();
  };

  return (
    <div className="space-y-6">
      {/* Header section with Timer or Status */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden h-[72px]">
        {phase === 'recording' ? (
          <>
            <div className="absolute top-0 left-0 bottom-0 bg-red-50 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <div className="relative flex items-center text-red-600 font-bold text-lg">
               <Clock className="w-6 h-6 mr-3" />
               Time remaining: {timeLeft}s
            </div>
            <div className="relative text-sm text-gray-500 font-bold uppercase tracking-wider hidden sm:block">
               Speak your answer now
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full text-blue-600 font-bold">
            {phase === 'playing' ? 'Playing audio...' : phase === 'idle' ? 'Preparing...' : 'Submitting answer...'}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 py-12 px-4 bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden transition-colors min-h-[300px]">
        {phase === 'idle' && (
          <div className="text-gray-500 flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="text-lg font-medium">Preparing audio...</p>
          </div>
        )}

        {phase === 'playing' && (
          <div className="text-blue-600 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Volume2 className="w-10 h-10" />
            </div>
            <p className="text-lg font-bold">Playing question audio...</p>
            {manualFallback && (
              <Button onClick={playAudio} className="mt-6" variant="outline">
                <Play className="w-4 h-4 mr-2" /> Tap to play audio
              </Button>
            )}
          </div>
        )}

        {phase === 'recording' && (
          <div className="text-red-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Mic className="w-10 h-10" />
            </div>
            <p className="text-lg font-bold">Recording your response...</p>
            <p className="text-sm text-gray-500 mt-2">Speak now</p>
          </div>
        )}

        {phase === 'saving' && (
          <div className="text-green-600 flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <p className="text-lg font-bold">Response saved</p>
            <p className="text-sm text-gray-500 mt-2">Moving to next question...</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSubmit} className="text-left w-full space-y-4">
          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider pl-1 text-center">
            Your Response
          </label>
          <textarea
            className="w-full min-h-[120px] p-4 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium text-lg bg-white"
            placeholder="Your transcribed response will appear here as you speak..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onAnswer(e.target.value, undefined);
            }}
            disabled={phase === 'saving'}
          />
          {(phase === 'recording' || phase === 'idle' || phase === 'playing') && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleSubmit} size="lg" className="px-10 py-4 text-lg rounded-2xl" disabled={phase !== 'recording' && !value.trim()}>
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
