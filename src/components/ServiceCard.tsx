
import React, { useState } from 'react';
import { ChevronDown, Clock, GraduationCap, Target, PenTool, School, Sprout, Shapes, Bot, Layers, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDetail } from '../types';

interface ServiceCardProps {
    service: ServiceDetail;
    isOpen: boolean;
    onToggle: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isOpen, onToggle }) => {
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

    // Helper to pick icons for the "Flashcards" based on keywords
    const getPersonaIcon = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes('ai')) return <Bot size={32} />;
        if (lower.includes('full-stack')) return <Layers size={32} />;
        if (lower.includes('career')) return <Briefcase size={32} />;
        if (lower.includes('university')) return <GraduationCap size={32} />;
        if (lower.includes('exam')) return <PenTool size={32} />;
        if (lower.includes('mastery')) return <Target size={32} />;
        if (lower.includes('foundations')) return <Shapes size={32} />;
        if (lower.includes('adult') || lower.includes('personal')) return <Sprout size={32} />;
        return <School size={32} />;
    };

    return (
        <div 
            id={service.id}
            className={`w-full rounded-[32px] border-4 border-black shadow-solid mb-8 transition-colors duration-300 overflow-hidden ${isOpen ? 'bg-cream' : 'bg-white'}`}
        >
            <div className="p-6 md:p-10 bg-white">
                {/* Header: Title Left, Big Price Right */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex-1">
                        <h3 className="font-heading text-3xl md:text-4xl font-bold mb-2">{service.title}</h3>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {service.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-cream border-2 border-black rounded-full text-xs md:text-sm font-bold text-gray-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Giant Price Tag */}
                    <div className="self-start md:self-auto bg-hot-pink text-white px-6 py-3 md:py-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-default">
                        <div className="flex items-baseline gap-1">
                            <span className="font-heading font-bold text-4xl md:text-5xl">{service.price}</span>
                            <span className="font-mono text-sm md:text-base font-bold opacity-90">{service.priceDetail}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onToggle}
                    className="flex items-center gap-2 font-heading font-bold text-lg bg-black text-white px-6 py-3 rounded-full hover:bg-hot-pink hover:shadow-lg transition-all duration-200 group"
                >
                    {isOpen ? 'Hide Details' : 'View Details'}
                    <ChevronDown 
                        className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-1'}`} 
                        size={20}
                    />
                </button>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t-4 border-black"
                    >
                        {/* Zone A: The Logistics Bar */}
                        <div className="bg-black text-white px-6 py-4 flex items-center gap-3 text-xs md:text-sm font-mono tracking-wide border-b-4 border-black">
                             <Clock size={16} className="text-hot-pink flex-shrink-0" />
                             {service.logistics}
                        </div>

                        <div className="p-6 md:p-10 bg-light-pink/30">
                            
                            {/* Zone B: Flashcard Grid (Who It's For) */}
                            <div className="mb-12">
                                <div className="bg-black text-white transform -rotate-1 inline-block px-4 py-2 font-heading font-bold text-xl mb-8 border-2 border-transparent shadow-sm">
                                    WHO IT'S FOR
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {service.structuredWhoFor.map((item, i) => (
                                        <div 
                                            key={i} 
                                            className="bg-white border-3 border-black rounded-xl p-6 shadow-solid flex flex-col items-center text-center transition-all duration-200"
                                        >
                                            {/* Icon Circle */}
                                            <div className="w-16 h-16 rounded-full bg-light-pink border-3 border-black flex items-center justify-center mb-4 text-black">
                                                {getPersonaIcon(item.title)}
                                            </div>
                                            <h5 className="font-heading font-bold text-lg uppercase tracking-wide mb-2">
                                                {item.title}
                                            </h5>
                                            <p className="text-sm font-medium text-gray-700 leading-snug">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Zone C: Interactive Methodology Selector (Horizontal) */}
                            <div>
                                <div className="bg-black text-white transform rotate-1 inline-block px-4 py-2 font-heading font-bold text-xl mb-8 border-2 border-transparent shadow-sm">
                                    METHODOLOGY
                                </div>
                                
                                <div className="flex flex-col gap-6">
                                    {/* 1. The Horizontal Ticket Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        {service.structuredFeatures.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveFeatureIndex(index)}
                                                className={`
                                                    w-12 h-12 md:w-14 md:h-14 rounded-xl border-3 border-black font-heading font-bold text-xl transition-all duration-150
                                                    ${activeFeatureIndex === index 
                                                        ? 'bg-hot-pink text-white translate-x-[3px] translate-y-[3px] shadow-none' 
                                                        : 'bg-white text-black shadow-solid hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-solid-hover'}
                                                `}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 2. The Display Box */}
                                    <div className="bg-white border-3 border-black rounded-xl shadow-solid p-6 md:p-8 min-h-[180px] flex flex-col justify-center relative overflow-hidden">
                                        {/* Background decoration number */}
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] font-heading font-bold text-gray-100 pointer-events-none select-none">
                                            {String(activeFeatureIndex + 1).padStart(2, '0')}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeFeatureIndex}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="relative z-10"
                                            >
                                                <h5 className="font-heading font-bold text-2xl mb-3 text-black">
                                                    {service.structuredFeatures[activeFeatureIndex].title}
                                                </h5>
                                                <p className="text-gray-700 font-medium text-lg leading-relaxed max-w-2xl">
                                                    {service.structuredFeatures[activeFeatureIndex].description}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServiceCard;
