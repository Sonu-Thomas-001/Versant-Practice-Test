import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Volume2, Mic, CheckCircle, Loader2, Play } from 'lucide-react';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  initialAnswer?: string;
  onAutoNext?: () => void;
}

export function RepeatQuestion({ question, onAnswer, initialAnswer = '', onAutoNext }: QuestionProps) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'recording' | 'saving'>('idle');
  const [value, setValue] = useState(initialAnswer);
  const [manualFallback, setManualFallback] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Reset state for new question
    setValue(initialAnswer);
    setPhase('idle');
    setManualFallback(false);
    
    // Auto start playing after a short delay
    const playTimer = setTimeout(() => {
       playAudio();
    }, 500);

    return () => {
      clearTimeout(playTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

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
      timerRef.current = setTimeout(() => {
        finishAndAdvance();
      }, 6000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setValue(currentTranscript);
      onAnswer(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'no-speech') {
        // Just let the timer run out if there's no speech or no mic access
      }
    };
    
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
    }

    // Stop recording automatically after fixed duration (e.g., 6 seconds)
    timerRef.current = setTimeout(() => {
      try { recognitionRef.current?.stop(); } catch(e) {}
      finishAndAdvance();
    }, 6000);
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
    <div className="space-y-8 mt-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-6 py-12 px-4 bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden transition-colors">
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
          <div className="text-green-600 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <p className="text-lg font-bold">Response saved</p>
            <p className="text-sm text-gray-500 mt-2">Moving to next question...</p>
          </div>
        )}
      </div>

      <div className="space-y-4 transition-opacity text-left">
        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Your Response
        </label>
        <textarea
          className="w-full min-h-[100px] p-4 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium text-lg bg-white"
          placeholder="Your transcribed response will appear here as you speak..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onAnswer(e.target.value);
          }}
          disabled={phase === 'saving'}
        />
      </div>
    </div>
  );
}
