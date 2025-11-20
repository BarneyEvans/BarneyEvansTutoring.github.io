import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const Home: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center py-12 md:py-20">
                {/* Left Column - Photo & Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="order-2 md:order-1"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-hot-pink rounded-[32px] rotate-3 transform translate-x-2 translate-y-2 border-4 border-black"></div>
                        <img
                            src="/assets/grad_photo.jpg"
                            alt="Barney Evans Graduation" 
                            className="relative w-full h-auto rounded-[32px] border-4 border-black shadow-lg bg-white z-10"
                        />
                        
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-2 z-20 bg-white border-3 border-black px-6 py-4 rounded-2xl shadow-solid flex flex-col items-center">
                            <div className="flex gap-1 text-yellow-400 mb-1">
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                            </div>
                            <span className="font-heading font-bold">80+ Lessons</span>
                            <span className="text-xs text-gray-500">Enhanced DBS</span>
                        </div>
                    </div>
                    <p className="mt-8 text-center font-medium text-gray-600">
                        MEng Computer Science with AI<br/>
                        University of Southampton
                    </p>
                </motion.div>

                {/* Right Column - Text & Pills */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="order-1 md:order-2"
                >
                    <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Personalised tutoring in <span className="text-hot-pink bg-white px-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">CS</span>, Maths & Sciences
                    </h1>
                    <p className="text-xl text-gray-700 mb-10">
                        Interactive, exam-focused lessons to help students achieve top grades. From Year 9 to University level.
                    </p>

                    <div className="space-y-6">
                        {/* Pill 1 */}
                        <div className="group bg-light-pink border-3 border-black rounded-[24px] p-6 shadow-solid hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer relative overflow-hidden">
                            <Link to="/private-tutoring" className="absolute inset-0 z-10"></Link>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-heading font-bold text-xl mb-1">1-to-1 Private Tutoring</h3>
                                    <p className="text-gray-700">Tailored support for GCSEs & Programming.</p>
                                </div>
                                <div className="bg-white p-2 rounded-full border-2 border-black group-hover:bg-hot-pink group-hover:text-white transition-colors">
                                    <ArrowRight />
                                </div>
                            </div>
                        </div>

                        {/* Pill 2 */}
                        <div className="group bg-white border-3 border-black rounded-[24px] p-6 shadow-solid hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer relative overflow-hidden">
                             <Link to="/python-course" className="absolute inset-0 z-10"></Link>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-heading font-bold text-xl mb-1">GCSE Python Course</h3>
                                    <p className="text-gray-700 mb-2">12-week exam-focused groups.</p>
                                    <span className="inline-block bg-cream border border-black px-2 py-0.5 rounded text-sm font-semibold">
                                        £12.50/lesson
                                    </span>
                                </div>
                                <div className="bg-cream p-2 rounded-full border-2 border-black group-hover:bg-hot-pink group-hover:text-white transition-colors">
                                    <ArrowRight />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Trust Signals */}
            <div className="border-t-3 border-black pt-12 mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        "Enhanced DBS Checked",
                        "5★ Average Rating",
                        "AQA / OCR / Edexcel",
                        "200+ Teaching Hours"
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <CheckCircle className="text-hot-pink" size={24} />
                            <span className="font-bold font-heading">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;


