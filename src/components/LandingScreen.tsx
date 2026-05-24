import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { SectionType } from '../types';
import { Timer, Target, ListTodo, Headphones, MessageSquare, Type, PenTool, BookOpen, Mic2, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface LandingScreenProps {
  onStart: (sections: SectionType[]) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState<SectionType[]>(['A', 'B', 'C', 'D', 'E', 'F']);

  const allSections: { id: SectionType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'A', label: 'Part A: Repeat', icon: <Mic2 className="w-5 h-5 text-blue-500" />, desc: 'Listen and repeat sentences.' },
    { id: 'B', label: 'Part B: Sentence Building', icon: <ListTodo className="w-5 h-5 text-indigo-500" />, desc: 'Rearrange words to form sentences.' },
    { id: 'C', label: 'Part C: Conversations', icon: <MessageSquare className="w-5 h-5 text-teal-500" />, desc: 'Listen and answer a question.' },
    { id: 'D', label: 'Part D: Sentence Completion', icon: <Type className="w-5 h-5 text-pink-500" />, desc: 'Type the missing word.' },
    { id: 'E', label: 'Part E: Dictation', icon: <PenTool className="w-5 h-5 text-orange-500" />, desc: 'Type exactly what you hear.' },
    { id: 'F', label: 'Part F: Passage Reconstruction', icon: <BookOpen className="w-5 h-5 text-green-500" />, desc: 'Rewrite a passage from memory.' },
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

  // Modern fullscreen request
  const handleStartFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
    setShowModal(false);
    onStart(selectedSections);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-blue-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>AI-Powered Simulator</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Versant</span> Test.
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-md">
                Experience a hyper-realistic speaking and listening test environment designed to perfect your English proficiency.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <Timer className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Duration</p>
                  <p className="text-lg font-bold text-gray-900">30 Minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Passing Target</p>
                  <p className="text-lg font-bold text-gray-900">49 / 80 Score</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setShowModal(true)} size="lg" className="w-full sm:w-auto px-8 py-7 text-xl font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]">
              <PlayCircle className="w-6 h-6 mr-3" />
              Configure & Start
            </Button>
          </div>

          {/* Right Column: Sections Preview */}
          <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
              Test Framework
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {allSections.map((section) => (
                <div key={section.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {section.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{section.label}</h4>
                      <p className="text-sm text-gray-500 leading-snug">{section.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-4 text-amber-800">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600" />
              <div className="text-sm font-medium leading-relaxed">
                Ensure you are in a quiet environment. Moving to the next question is automatic in some sections. You cannot pause the test once it begins. The test will run in full-screen mode to prevent distractions.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Configuration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Select Test Sections</h3>
              <p className="text-gray-500 mt-2 font-medium">Choose exactly what you'd like to practice today.</p>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all hover:bg-gray-50 mb-4 border-gray-200 bg-gray-50/50">
                  <span className="font-bold text-gray-900 text-lg">Select All Modules</span>
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={selectedSections.length === allSections.length}
                      onChange={handleSelectAll}
                    />
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
                      <CheckCircle2 className={`w-4 h-4 text-white ${selectedSections.length === allSections.length ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all`} />
                    </div>
                  </div>
                </label>

                {allSections.map(s => (
                  <label key={s.id} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all hover:border-blue-200 ${selectedSections.includes(s.id) ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-gray-100 bg-white'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        {s.icon}
                      </div>
                      <span className="font-semibold text-gray-800">{s.label}</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={selectedSections.includes(s.id)}
                        onChange={() => toggleSection(s.id)}
                      />
                      <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors ${selectedSections.includes(s.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                         <CheckCircle2 className={`w-4 h-4 text-white ${selectedSections.includes(s.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all`} />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-4">
              <Button variant="outline" size="lg" className="px-6 py-6 text-gray-600 hover:text-gray-900 border-gray-200 rounded-xl" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                size="lg"
                className="px-8 py-6 shadow-lg shadow-blue-500/20 text-lg rounded-xl"
                onClick={handleStartFullscreen}
                disabled={selectedSections.length === 0}
              >
                Begin Practice
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
