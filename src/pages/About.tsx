
import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE, MYTUTOR_URL } from '../constants';
import { ExternalLink, GraduationCap, Star, Code, Quote, Clock, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
    const getIcon = (company: string) => {
        if (company.includes("Ritz")) return <GraduationCap size={20} />;
        if (company.includes("MyTutor")) return <Star size={20} />;
        if (company.includes("CodeKids")) return <Code size={20} />;
        return <Star size={20} />;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 overflow-hidden">
            <div className="text-center py-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Meet Barney</h1>
            </div>

            {/* 1. BIO SECTION: Credentials Hero + Polaroid Stack */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                
                {/* Left: Credentials Hero Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[24px] border-4 border-black shadow-solid p-8 md:p-10 relative z-20"
                >
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 leading-tight">
                        MEng Computer Science with AI
                    </h2>
                    <p className="text-xl text-gray-600 font-medium mb-6">
                        University of Southampton
                    </p>
                    
                    <div className="border-t-3 border-dashed border-gray-300 my-8"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Spec 1: A-Levels */}
                        <div className="bg-cream border-3 border-black rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-[2px_2px_0px_0px_#1a1a1a]">
                            <span className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-1">A-Levels</span>
                            <span className="font-heading font-bold text-2xl">A* A* A</span>
                            <span className="text-xs font-bold text-gray-500 mt-1">Chem • CS • Maths</span>
                        </div>

                        {/* Spec 2: Hours */}
                        <div className="bg-white border-3 border-black rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-solid-hover transition-shadow">
                            <Clock className="mb-1 text-hot-pink" size={24} />
                            <span className="font-heading font-bold text-xl">200+ Hours</span>
                            <span className="text-xs font-bold text-gray-500">Teaching Exp.</span>
                        </div>

                        {/* Spec 3: Rating */}
                        <div className="bg-white border-3 border-black rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-solid-hover transition-shadow">
                             <Star className="mb-1 text-hot-pink" size={24} fill="currentColor" />
                            <span className="font-heading font-bold text-xl">5★ Rating</span>
                            <span className="text-xs font-bold text-gray-500">Average</span>
                        </div>

                         {/* Spec 4: DBS */}
                         <div className="bg-white border-3 border-black rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-solid-hover transition-shadow">
                            <ShieldCheck className="mb-1 text-hot-pink" size={24} />
                            <span className="font-heading font-bold text-xl">Enhanced DBS</span>
                            <span className="text-xs font-bold text-gray-500">Certified</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: The Polaroid Stack */}
                <div className="relative h-[400px] w-full flex justify-center lg:block lg:mt-0">
                    {/* Back Photo (Ice Hockey) - Tilted Left */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: -6, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="absolute top-4 lg:left-4 w-[260px] h-[320px] lg:w-[300px] lg:h-[360px] bg-white p-3 pb-12 border-4 border-black shadow-xl transform z-0"
                    >
                        <div className="w-full h-full bg-gray-200 border-2 border-black overflow-hidden grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                             <img src="/assets/hockey_image.jpg" alt="Ice Hockey" className="w-full h-full object-cover" />
                        </div>
                        <p className="font-heading font-bold text-center mt-3 text-gray-500 rotate-1">Ice Hockey 🏒</p>
                    </motion.div>

                    {/* Front Photo (Graduation) - Tilted Right */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 6, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="absolute top-12 lg:left-32 w-[260px] h-[320px] lg:w-[300px] lg:h-[360px] bg-white p-3 pb-12 border-4 border-black shadow-solid z-10"
                    >
                        <div className="w-full h-full bg-gray-200 border-2 border-black overflow-hidden">
                            <img src="/assets/teaching.jpg" alt="Teaching Python to a class" className="w-full h-full object-cover" />
                        </div>
                        <p className="font-heading font-bold text-center mt-3 text-black -rotate-1">Teaching Python to a class</p>
                    </motion.div>
                </div>
            </div>

            {/* 2. EXPERIENCE TIMELINE (The Clothesline) */}
            <div className="mb-20">
                <h3 className="font-heading text-2xl font-bold mb-12 pl-4 md:pl-0 md:text-center">Career Path</h3>
                
                <div className="relative">
                    {/* The Line */}
                    {/* Mobile: Vertical Line Left */}
                    <div className="absolute left-[27px] top-0 bottom-0 w-[4px] bg-black rounded-full md:hidden"></div>
                    {/* Desktop: Horizontal Line Top - Aligned to center of icons (29px) */}
                    <div className="hidden md:block absolute left-0 right-0 top-[27px] h-[4px] bg-black rounded-full"></div>

                    <div className="flex flex-col md:grid md:grid-cols-3 gap-12 md:gap-8">
                        {EXPERIENCE.map((job, idx) => {
                            const isMyTutor = job.company.includes("MyTutor");
                            
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="relative pl-20 md:pl-0 md:pt-20"
                                >
                                    {/* Connector Line (Desktop) */}
                                    <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-20 bg-black -z-10"></div>

                                    {/* Icon Node */}
                                    <div className={`
                                        absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2
                                        w-[58px] h-[58px] rounded-full border-4 border-black flex items-center justify-center z-10
                                        ${isMyTutor ? 'bg-hot-pink text-white shadow-[0px_0px_0px_4px_#fff]' : 'bg-white text-black'}
                                    `}>
                                        {getIcon(job.company)}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`
                                        rounded-[20px] border-3 border-black p-5 shadow-solid relative
                                        ${isMyTutor ? 'bg-light-pink' : 'bg-white'}
                                    `}>
                                        {isMyTutor && (
                                            <div className="absolute -top-3 -right-3 bg-hot-pink text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-lg transform rotate-3">
                                                FEATURED
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex flex-wrap justify-between items-baseline mb-2">
                                                <h4 className="font-heading font-bold text-xl leading-tight">{job.company}</h4>
                                                <span className="font-mono text-xs md:text-sm font-bold opacity-60">{job.period}</span>
                                            </div>
                                            <p className="font-bold mb-2 text-sm md:text-base">{job.title}</p>
                                            <ul className={`list-disc list-inside text-sm space-y-1 ${isMyTutor ? 'opacity-100' : 'opacity-80'}`}>
                                                {job.details.map((d, i) => (
                                                    <li key={i} className={isMyTutor ? 'font-bold text-black' : ''}>
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Threaded Testimonial for MyTutor */}
                                    {isMyTutor && (
                                        <div className="relative mt-4 ml-8 md:ml-0 md:mt-6">
                                            {/* Connector Line (Mobile: L-Shape) */}
                                            <div className="md:hidden absolute -left-6 -top-6 w-6 h-12 border-l-3 border-b-3 border-black rounded-bl-2xl opacity-30"></div>
                                            {/* Connector Line (Desktop: Vertical) */}
                                            <div className="hidden md:block absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-black opacity-30"></div>
                                            
                                            <div className="bg-white rounded-xl border-3 border-black p-4 shadow-sm relative">
                                                <div className="flex gap-3 items-start">
                                                    <Quote size={20} className="text-hot-pink flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="italic text-sm text-gray-700 mb-3">
                                                            "Barney has helped my daughter in her Computer Science GCSE making her much more confident within a few months."
                                                        </p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-bold text-xs">- Parent</span>
                                                            <a href={MYTUTOR_URL} target="_blank" rel="noreferrer" className="text-xs font-bold flex items-center gap-1 hover:text-hot-pink">
                                                                Verify <ExternalLink size={12}/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

