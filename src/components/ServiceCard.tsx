
import React from 'react';
import { ChevronDown, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDetail } from '../types';

interface ServiceCardProps {
    service: ServiceDetail;
    isOpen: boolean;
    onToggle: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isOpen, onToggle }) => {
    return (
        <div 
            id={service.id}
            className={`w-full rounded-[32px] border-4 border-black shadow-solid mb-8 transition-colors duration-300 overflow-hidden ${isOpen ? 'bg-light-pink' : 'bg-white'}`}
        >
            <div className="p-8 md:p-10">
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

            {/* Expanded Content (The Blueprint Layout) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t-4 border-black bg-white"
                    >
                        {/* Zone A: The Logistics Bar */}
                        <div className="bg-black text-white px-8 py-4 flex items-center gap-3 text-sm md:text-base font-mono tracking-wide">
                             <Clock size={18} className="text-hot-pink" />
                             {service.logistics}
                        </div>

                        <div className="p-8 md:p-10 grid md:grid-cols-2 gap-12">
                            {/* Zone B: Who It's For (Personas) */}
                            <div>
                                <h4 className="font-heading font-bold text-2xl mb-6 text-black flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-hot-pink border-2 border-black flex items-center justify-center text-white text-sm">01</span>
                                    Who It's For
                                </h4>
                                <div className="space-y-6">
                                    {service.structuredWhoFor.map((item, i) => (
                                        <div key={i} className="group">
                                            <h5 className="font-heading font-bold text-lg mb-1 group-hover:text-hot-pink transition-colors">
                                                {item.title}
                                            </h5>
                                            <p className="text-gray-700 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Zone C: How We Learn (Methodology) */}
                            <div>
                                <h4 className="font-heading font-bold text-2xl mb-6 text-black flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-cream border-2 border-black flex items-center justify-center text-black text-sm">02</span>
                                    How We Learn
                                </h4>
                                <div className="grid gap-5">
                                    {service.structuredFeatures.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="mt-1.5 w-2 h-2 bg-hot-pink rounded-full flex-shrink-0" />
                                            <div>
                                                <h5 className="font-bold text-black">{item.title}</h5>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
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
