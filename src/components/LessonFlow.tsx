import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDetail } from '../types';
import { Presentation } from 'lucide-react';
import LessonTimeline from './LessonTimeline';

interface LessonFlowProps {
    services: ServiceDetail[];
}

const LessonFlow: React.FC<LessonFlowProps> = ({ services }) => {
    const [activeServiceId, setActiveServiceId] = useState(services[0].id);
    const activeService = services.find(s => s.id === activeServiceId) || services[0];

    return (
        <div className="bg-white rounded-[32px] border-4 border-black shadow-solid p-6 md:p-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">
                Typical 60-Minute Lesson
            </h2>
            
            {/* Toggle Switch */}
            <div className="flex justify-center mb-12 md:mb-16">
                <div className="bg-cream p-1.5 rounded-full border-3 border-black flex relative shadow-inner">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setActiveServiceId(service.id)}
                            className={`
                                relative z-10 px-4 md:px-6 py-2 md:py-3 rounded-full font-heading font-bold text-sm md:text-base transition-colors duration-300
                                ${activeServiceId === service.id ? 'text-white' : 'text-gray-500 hover:text-black'}
                            `}
                        >
                            {activeServiceId === service.id && (
                                <motion.div
                                    layoutId="activeToggle"
                                    className="absolute inset-0 bg-black rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-20">
                                {service.id === 'cs' ? 'Programming & AI' : 'GCSE Sciences'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="relative max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeServiceId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LessonTimeline steps={activeService.lessonFlow} serviceId={activeService.id} />
                    </motion.div>
                </AnimatePresence>

                {/* Custom Slides Feature */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-white border-4 border-black rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div className="bg-hot-pink p-4 rounded-xl border-3 border-black text-white shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                        <Presentation size={32} strokeWidth={2.5} />
                    </div>
                    <p className="font-bold text-black text-lg md:text-xl md:text-left text-center leading-snug">
                        Every lesson is built with a custom set of slides tailored to the current topic and progress which can be used for recap at a later stage.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LessonFlow;