import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { SectionType } from '../types';

interface LandingScreenProps {
  onStart: (sections: SectionType[]) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState<SectionType[]>(['A', 'B', 'C', 'D', 'E', 'F']);

  const allSections: { id: SectionType; label: string }[] = [
    { id: 'A', label: 'Part A: Repeat' },
    { id: 'B', label: 'Part B: Sentence Building' },
    { id: 'C', label: 'Part C: Conversation' },
    { id: 'D', label: 'Part D: Sentence Completion' },
    { id: 'E', label: 'Part E: Dictation' },
    { id: 'F', label: 'Part F: Passage Reconstruction' },
  ];

  const toggleSection = (section: SectionType) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSelectAll = () => {
    if (selectedSections.length === allSections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(['A', 'B', 'C', 'D', 'E', 'F']);
    }
  };

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
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Settings to Practice</h3>
            <p className="text-gray-600 mb-4">Choose which parts of the test you'd like to include.</p>
            
            <div className="space-y-3 mb-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer border-b border-gray-200 pb-3 mb-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                  checked={selectedSections.length === allSections.length}
                  onChange={handleSelectAll}
                />
                <span className="font-bold text-gray-900">Select All Sections</span>
              </label>

              {allSections.map(s => (
                <label key={s.id} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={selectedSections.includes(s.id)}
                    onChange={() => toggleSection(s.id)}
                  />
                  <span className="text-gray-700 font-medium">{s.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowModal(false);
                  onStart(selectedSections);
                }}
                disabled={selectedSections.length === 0}
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
