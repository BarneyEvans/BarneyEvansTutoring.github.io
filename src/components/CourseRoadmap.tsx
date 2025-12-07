
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { PYTHON_CURRICULUM } from '../constants';
import { Lesson } from '../types';

const CourseRoadmap: React.FC = () => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [typedCode, setTypedCode] = useState('');
    const typingTimeoutRef = useRef<number | null>(null);

    // Typewriter effect for code snippets
    useEffect(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (!selectedLesson?.codeSnippet) {
            setTypedCode('');
            return;
        }

        const fullCode = selectedLesson.codeSnippet;
        let currentIndex = 0;
        setTypedCode('');

        const typeChar = () => {
            if (currentIndex < fullCode.length) {
                setTypedCode(fullCode.slice(0, currentIndex + 1));
                currentIndex++;
                typingTimeoutRef.current = window.setTimeout(typeChar, Math.random() * 30 + 20);
            }
        };

        typeChar();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [selectedLesson]);

    // Syntax highlighting
    const highlightedCode = useMemo(() => {
        const escaped = typedCode
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return escaped.replace(
            /(#.*)|(\b(?:def|return|if|elif|else|for|in|while|with|as|open)\b)|(\b(?:range|len|print|input|int|append)\b)|(\b\d+\b)|(".*?")/g,
            (match, comment, keyword, func, number, string) => {
                if (comment) return `<span class="text-[#6a9955]">${comment}</span>`;
                if (keyword) return `<span class="text-[#c586c0]">${keyword}</span>`;
                if (func) return `<span class="text-[#dcdcaa]">${func}</span>`;
                if (number) return `<span class="text-[#b5cea8]">${number}</span>`;
                if (string) return `<span class="text-[#ce9178]">${string}</span>`;
                return match;
            }
        );
    }, [typedCode]);

    // --- Sub-Components ---

    const LessonButton = ({ lesson, isActive, onClick, isMobile = false }: { lesson: Lesson, isActive: boolean, onClick: () => void, isMobile?: boolean }) => (
        <button
            onClick={onClick}
            className={`
                relative w-full text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group overflow-hidden
                ${isMobile ? 'px-3 py-3' : 'px-5 py-4'}
                ${isActive
                    ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_#ff69b4] -translate-y-1'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50'}
                ${isMobile && isActive ? 'rounded-b-none border-b-0 shadow-none translate-y-0' : ''}
            `}
        >
            <div className="flex items-center gap-3 z-10 min-w-0">
                <span className={`font-mono font-bold ${isMobile ? 'text-xs' : 'text-sm'} ${isActive ? 'text-hot-pink' : 'text-gray-300 group-hover:text-black'} transition-colors`}>
                    {String(lesson.id).padStart(2, '0')}
                </span>
                <span className={`font-heading font-bold truncate ${isMobile ? 'text-sm' : 'text-lg'} ${isActive ? 'text-white' : 'text-gray-800'} transition-colors`}>
                    {lesson.title}
                </span>
            </div>

            {/* Arrow */}
            <div className={`transform transition-all duration-300 z-10 flex-shrink-0 ${
                isActive 
                    ? 'opacity-100 translate-x-0 text-hot-pink' 
                    : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-black'
            }`}>
                {isMobile && isActive ? '↓' : (isMobile ? '' : '→')}
            </div>
        </button>
    );

    const LessonDetails = ({ lesson }: { lesson: Lesson }) => (
        <div className="h-full flex flex-col">
            <div className="mb-auto">
                <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded mb-2">
                    WEEK {lesson.id}
                </span>
                <h4 className="font-heading text-2xl font-bold mb-4">{lesson.title}</h4>
                <p className="text-gray-800 mb-6 text-lg leading-relaxed">
                    {lesson.description}
                </p>
            </div>
            
            {lesson.codeSnippet && (
                <div className="bg-[#1e1e1e] rounded-xl p-4 mt-4 overflow-x-auto border-2 border-[#2d2d2d] max-w-full min-h-[5rem]">
                    <pre className="font-mono text-xs md:text-sm text-[#d4d4d4] whitespace-pre-wrap leading-relaxed">
                        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        {typedCode.length < (lesson.codeSnippet?.length || 0) && (
                            <span className="inline-block w-2 h-4 bg-hot-pink animate-pulse ml-0.5 align-middle" />
                        )}
                    </pre>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-[32px] border-4 border-black shadow-solid p-6 md:p-10">
            <h3 className="font-heading text-2xl font-bold mb-6">12-Week Roadmap</h3>

            {/* --- Mobile Layout (Smart Grid) --- */}
            <div className="md:hidden grid grid-cols-2 gap-3">
                {PYTHON_CURRICULUM.map((lesson) => {
                    const isActive = selectedLesson?.id === lesson.id;
                    return (
                        <div 
                            key={lesson.id} 
                            className={`flex flex-col transition-all duration-300 ${isActive ? 'col-span-2' : 'col-span-1'}`}
                        >
                            <LessonButton 
                                lesson={lesson} 
                                isActive={isActive} 
                                onClick={() => setSelectedLesson(isActive ? null : lesson)}
                                isMobile={true}
                            />
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white border-2 border-t-0 border-black rounded-b-xl p-5 shadow-[4px_4px_0px_0px_#ff69b4] mx-1 mb-2">
                                            <LessonDetails lesson={lesson} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* --- Desktop Layout (Split View) --- */}
            <div className="hidden md:grid lg:grid-cols-12 gap-8">
                {/* Left: Grid of Pills */}
                <div className="lg:col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {PYTHON_CURRICULUM.map((lesson) => (
                            <LessonButton
                                key={lesson.id}
                                lesson={lesson}
                                isActive={selectedLesson?.id === lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Details Panel */}
                <div className="lg:col-span-5 bg-white rounded-[24px] border-3 border-black p-6 relative min-h-[300px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {selectedLesson ? (
                            <motion.div
                                key={selectedLesson.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <LessonDetails lesson={selectedLesson} />
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
                                <p className="text-sm">Select a week to view the lesson plan and code examples.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CourseRoadmap;
