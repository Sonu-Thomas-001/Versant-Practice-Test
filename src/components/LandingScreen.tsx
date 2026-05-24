import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Versant Practice Test</CardTitle>
            <p className="text-gray-500 mt-2">A mock speaking and listening test simulator.</p>
          </CardHeader>
          <CardContent className="space-y-8 mt-6">
            <div className="space-y-4 text-gray-700">
              <h4 className="font-semibold text-lg border-b pb-2">Test Format</h4>
              <ul className="space-y-2 list-disc list-inside px-2">
                <li><span className="font-medium text-gray-900">Duration:</span> 30 minutes</li>
                <li><span className="font-medium text-gray-900">Passing Score:</span> 49 out of 80</li>
                <li><span className="font-medium text-gray-900">Sections:</span> 6 Parts (A to F)</li>
              </ul>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <h4 className="font-semibold text-lg border-b pb-2">Sections Included</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm px-2">
                <div>Part A: Repeat</div>
                <div>Part B: Sentence Building</div>
                <div>Part C: Conversation</div>
                <div>Part D: Sentence Completion</div>
                <div>Part E: Dictation</div>
                <div>Part F: Passage Reconstruction</div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-sm leading-relaxed">
              <p className="font-semibold mb-1">Instructions:</p>
              <p>Ensure you are in a quiet environment. Once you click start, the timer will begin. Answer each question carefully and click 'Next' to proceed. You cannot pause the test once it begins.</p>
            </div>

            <div className="flex justify-center pt-4">
              <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg font-bold shadow-md hover:shadow-lg transition-all" onClick={() => setShowModal(true)}>
                Start Practice Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to start?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to start the practice test?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowModal(false);
                onStart();
              }}>
                Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
