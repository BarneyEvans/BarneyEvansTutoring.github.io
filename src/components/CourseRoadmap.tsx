
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { PYTHON_CURRICULUM } from '../constants';
import { Lesson } from '../types';

const CourseRoadmap: React.FC = () => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    return (
        <div className="bg-white rounded-[32px] border-4 border-black shadow-solid p-6 md:p-10">
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Left: Grid of Pills */}
                <div className="lg:col-span-7">
                    <h3 className="font-heading text-2xl font-bold mb-6">12-Week Roadmap</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PYTHON_CURRICULUM.map((lesson) => (
                            <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`
                                    py-3 px-2 rounded-xl border-3 border-black font-bold text-sm md:text-base transition-all duration-150 ease-out
                                    ${selectedLesson?.id === lesson.id 
                                        ? 'bg-hot-pink text-white shadow-none translate-x-[3px] translate-y-[3px]' 
                                        : 'bg-cream text-black shadow-solid-sm hover:bg-light-pink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-solid-hover'}
                                `}
                            >
                                Week {lesson.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Details Panel */}
                <div className="lg:col-span-5 bg-cream rounded-[24px] border-3 border-black p-6 relative min-h-[300px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {selectedLesson ? (
                            <motion.div
                                key={selectedLesson.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full flex flex-col"
                            >
                                <div className="mb-auto">
                                    <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded mb-2">
                                        WEEK {selectedLesson.id}
                                    </span>
                                    <h4 className="font-heading text-2xl font-bold mb-4">{selectedLesson.title}</h4>
                                    <p className="text-gray-800 mb-6 text-lg leading-relaxed">
                                        {selectedLesson.description}
                                    </p>
                                </div>
                                
                                {selectedLesson.codeSnippet && (
                                    <div className="bg-black rounded-xl p-4 mt-4 overflow-x-auto border-2 border-gray-700 max-w-full">
                                        <pre className="font-mono text-xs md:text-sm text-green-400 whitespace-pre-wrap">
                                            <code>{selectedLesson.codeSnippet}</code>
                                        </pre>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4"
                            >
                                <div className="bg-white p-4 rounded-full border-3 border-black shadow-sm mb-4">
                                    <MousePointerClick size={32} className="text-hot-pink" />
                                </div>
                                <p className="font-heading font-bold text-xl text-black mb-2">Explore the Curriculum</p>
                                <p className="text-sm">Select a week on the left to view the lesson plan and code examples.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CourseRoadmap;
