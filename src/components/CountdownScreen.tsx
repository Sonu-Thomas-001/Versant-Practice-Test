import React, { useEffect, useState } from 'react';

interface CountdownScreenProps {
  onComplete: () => void;
}

export function CountdownScreen({ onComplete }: CountdownScreenProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center animate-pulse">
        <h2 className="text-3xl font-bold text-gray-700 mb-8">Get ready for Part A: Repeat</h2>
        <div className="text-9xl font-black text-blue-600 tracking-tighter">
          {count > 0 ? count : ''}
        </div>
      </div>
    </div>
  );
}
