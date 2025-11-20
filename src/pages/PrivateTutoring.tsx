import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import ServiceCard from '../components/ServiceCard';
import LessonFlow from '../components/LessonFlow';

const PrivateTutoring: React.FC = () => {
    const [openCardId, setOpenCardId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenCardId(prev => prev === id ? null : id);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pb-20">
            <div className="text-center py-12">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-heading text-4xl md:text-5xl font-bold mb-4"
                >
                    1-to-1 Private Tutoring
                </motion.h1>
                <p className="text-xl text-gray-600">Choose the option that best fits your needs.</p>
            </div>

            {/* Service Cards */}
            <div className="space-y-12 mb-20">
                {SERVICES.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ServiceCard 
                            service={service}
                            isOpen={openCardId === service.id}
                            onToggle={() => handleToggle(service.id)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Lesson Structure Flow */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-20"
            >
                <LessonFlow services={SERVICES} />
            </motion.div>
        </div>
    );
};

export default PrivateTutoring;