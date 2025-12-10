
import React from 'react';
import { Users, BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseRoadmap from '../components/CourseRoadmap';
import CodeWindow from '../components/CodeWindow';
import LessonTimeline from '../components/LessonTimeline';
import { GOOGLE_FORM_URL } from '../constants';

const PythonCourse: React.FC = () => {
    // Data for the new visual structure
    const lessonSteps = [
        { time: "5-10m", title: "Recap", desc: "Reviewing homework & last week's concepts." },
        { time: "20-25m", title: "Teaching", desc: "Interactive live coding of new theory." },
        { time: "20-25m", title: "Practice", desc: "Guided exam-style questions." },
        { time: "5m", title: "Wrap-up", desc: "Q&A and homework assignment." },
    ];

    const getRotation = (i: number) => {
        if (i === 0) return '-rotate-1';
        if (i === 1) return 'rotate-1';
        return '-rotate-1';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* Hero */}
            <div className="grid md:grid-cols-2 gap-12 py-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    {/* Top Pills Row */}
                    <div className="flex flex-wrap gap-3">
                        <span className="bg-black text-white font-bold px-3 py-1 rounded-lg border-2 border-black transform -rotate-2 shadow-[4px_4px_0px_0px_#ff69b4]">
                            Coming Soon
                        </span>
                         <span className="bg-white border-2 border-black px-3 py-1 rounded-lg font-bold shadow-solid-sm text-sm">
                            Max 5 Students
                        </span>
                        <span className="bg-white border-2 border-black px-3 py-1 rounded-lg font-bold shadow-solid-sm text-sm">
                            £12.50 / lesson
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
                        GCSE Python for <span className="text-hot-pink underline decoration-4 decoration-black">Exam Success</span>
                    </h1>
                    
                    {/* Product Summary Box (The "Steak") */}
                    <div className="bg-light-pink border-3 border-black rounded-2xl p-6 shadow-solid">
                        <h3 className="font-heading font-bold text-xl mb-4">Everything needed for a Grade 9:</h3>
                        <ul className="space-y-3">
                            {[
                                "Complete 12-week syllabus (Variables to Algorithms)",
                                "Weekly homework marked with personal feedback",
                                <>Compatible with <span className="font-bold">AQA / OCR / Edexcel</span> exam boards</>,
                                "Specific focus on how to answer written exam questions"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="bg-black text-white rounded-full p-0.5 mt-0.5">
                                        <CheckCircle size={14} strokeWidth={3} />
                                    </div>
                                    <span className="font-medium text-gray-900 text-lg leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-2">
                        <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 bg-hot-pink text-white px-6 py-3 rounded-full border-3 border-black shadow-solid hover:bg-white hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <span className="font-heading font-bold text-lg">Register Interest</span>
                            <div className="bg-white text-black p-1.5 rounded-full group-hover:bg-hot-pink group-hover:text-white transition-colors">
                                <ArrowRight size={18} />
                            </div>
                        </a>
                        <p className="mt-3 text-sm text-gray-600 ml-1 font-medium">
                            No commitment required. Get notified when dates are released.
                        </p>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative h-full min-h-[400px] hidden md:block"
                >
                     {/* New Dynamic Code Component */}
                     <CodeWindow />
                </motion.div>
            </div>

            {/* Why This Course Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
                {[
                    { icon: BookOpen, title: "Exam Focused", desc: "Practice past paper exam questions." },
                    { icon: Users, title: "Small Groups", desc: "Maximum 5 students ensures everyone gets personal attention and feedback." },
                    { icon: Clock, title: "Weekly Homework", desc: "Marked weekly tasks with model answers to ensure continuous progress." }
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        className={`border-4 border-black rounded-[24px] p-6 shadow-solid transition-colors ${idx === 1 ? 'bg-light-pink' : 'bg-white'} ${getRotation(idx)}`}
                    >
                        <div className="bg-cream w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mb-4 text-hot-pink">
                            <card.icon size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-2">{card.title}</h3>
                        <p className="text-gray-700">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Interactive Roadmap */}
            <div className="mb-20" id="roadmap">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">Course Curriculum</h2>
                <CourseRoadmap />
            </div>

            {/* Typical Lesson Flow (New Branding Style) */}
            <div className="bg-white rounded-[32px] border-4 border-black shadow-solid p-8 md:p-12 mb-20">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16">Typical 60-Minute Lesson</h2>
                
                <div className="relative max-w-5xl mx-auto">
                    <LessonTimeline 
                        steps={lessonSteps.map(step => ({
                            ...step,
                            description: step.desc
                        }))} 
                        serviceId="cs" 
                    />
                </div>
            </div>
            
        </div>
    );
};

export default PythonCourse;
