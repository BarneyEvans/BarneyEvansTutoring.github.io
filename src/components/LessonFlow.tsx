import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDetail } from '../types';

interface LessonFlowProps {
    services: ServiceDetail[];
}

const LessonFlow: React.FC<LessonFlowProps> = ({ services }) => {
    // Default to the first service (CS)
    const [activeServiceId, setActiveServiceId] = useState(services[0].id);
    
    const activeService = services.find(s => s.id === activeServiceId) || services[0];

    return (
        <div className="bg-white rounded-[32px] border-4 border-black shadow-solid p-8 md:p-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">
                Typical 60-Minute Lesson
            </h2>
            
            {/* Tactile Toggle Switch */}
            <div className="flex justify-center mb-16">
                <div className="bg-cream p-1.5 rounded-full border-3 border-black flex relative shadow-inner">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setActiveServiceId(service.id)}
                            className={`
                                relative z-10 px-6 py-3 rounded-full font-heading font-bold text-sm md:text-base transition-colors duration-300
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

            {/* Animated Timeline */}
            <div className="relative">
                <div className="grid md:grid-cols-4 gap-8 md:gap-4">
                    <AnimatePresence mode="wait">
                        {activeService.lessonFlow.map((step, i) => (
                            <motion.div
                                key={`${activeService.id}-${i}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                className="relative z-10 flex flex-col md:items-center text-left md:text-center group"
                            >
                                {/* Time Pill */}
                                <div className="mb-4 self-start md:self-center bg-hot-pink text-white border-2 border-black font-mono font-bold text-sm px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                                    {step.time}
                                </div>

                                {/* Content Box */}
                                <div className="bg-white border-3 border-black rounded-xl p-5 w-full h-full shadow-solid hover:shadow-solid-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
                                    <h4 className="font-heading font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LessonFlow;