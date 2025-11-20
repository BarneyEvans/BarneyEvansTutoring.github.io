import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PythonBackground: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();

    // Animation for the dashed line "flow"
    const flowAnimation = {
        initial: { strokeDashoffset: 0 },
        animate: {
            strokeDashoffset: -200,
            transition: {
                repeat: Infinity,
                duration: 40,
                ease: "linear"
            }
        }
    };

    // Animation for a gentle floating/breathing effect of the paths
    const floatAnimation = {
        initial: { y: -20 },
        animate: {
            y: 0,
            transition: {
                repeat: Infinity,
                repeatType: "mirror" as const,
                duration: 5,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* 
                We use a large viewBox to allow for curves. 
                preserveAspectRatio="xMidYMid slice" ensures it covers the screen without distortion.
            */}
            <svg 
                className="w-full h-full opacity-40" 
                viewBox="0 0 200 200" 
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#ff69b4" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Primary thick snake body - Light Pink */}
                <motion.path
                    d="M -50 -50 Q 50 50 100 100 T 250 250"
                    fill="transparent"
                    stroke="#ffe0f1" 
                    strokeWidth="30"
                    strokeLinecap="round"
                    initial={shouldReduceMotion ? {} : "initial"}
                    animate={shouldReduceMotion ? {} : "animate"}
                    variants={floatAnimation}
                />

                {/* Secondary "Code Stream" - Hot Pink Dashed */}
                <motion.path
                    d="M -50 -50 Q 50 50 100 100 T 250 250"
                    fill="transparent"
                    stroke="url(#snakeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="10 15"
                    initial={shouldReduceMotion ? {} : "initial"}
                    animate={shouldReduceMotion ? {} : "animate"}
                    variants={flowAnimation}
                />

                {/* Second intertwined curve for complexity */}
                <motion.path
                    d="M 250 -50 Q 150 50 100 100 T -50 250"
                    fill="transparent"
                    stroke="#1a1a1a"
                    strokeWidth="1"
                    strokeOpacity="0.05"
                    strokeDasharray="5 5"
                    initial={shouldReduceMotion ? {} : "initial"}
                    animate={shouldReduceMotion ? {} : { ...flowAnimation.animate, transition: { ...flowAnimation.animate.transition, duration: 60 } }}
                />
            </svg>
        </div>
    );
};

export default PythonBackground;