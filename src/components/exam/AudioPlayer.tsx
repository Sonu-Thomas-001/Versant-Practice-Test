import React, { useState, useEffect } from 'react';
import { Volume2, Play } from 'lucide-react';
import { Button } from '../ui/Button';

interface AudioPlayerProps {
  text: string;
  isPlaying: boolean;
  onComplete: () => void;
}

export function AudioPlayer({ text, isPlaying, onComplete }: AudioPlayerProps) {
  const [manualFallback, setManualFallback] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      playAudio();
    }
  }, [isPlaying]);

  const playAudio = () => {
    setManualFallback(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          onComplete();
        };
        utterance.onerror = (e) => {
          console.error('Speech synthesis errored', e);
          setManualFallback(true);
        };
        window.speechSynthesis.speak(utterance);
        
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

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-xl relative">
         <Volume2 className="w-8 h-8 text-gray-400 mb-2" />
         <p className="text-gray-500 font-medium">Audio Finished</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-blue-50 border border-blue-200 rounded-xl relative">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
        <Volume2 className="w-8 h-8 text-blue-600" />
      </div>
      <p className="text-lg font-bold text-blue-800">Playing audio...</p>
      {manualFallback && (
        <Button onClick={playAudio} className="mt-6" variant="outline">
          <Play className="w-4 h-4 mr-2" /> Tap to play audio
        </Button>
      )}
    </div>
  );
}
