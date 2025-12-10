import React from 'react';
import { RefreshCcw, BookOpen, Code, CheckCircle, PenTool, Presentation } from 'lucide-react';

interface LessonStep {
    time: string;
    title: string;
    description: string;
}

interface LessonTimelineProps {
    steps: LessonStep[];
    serviceId?: string;
}

const LessonTimeline: React.FC<LessonTimelineProps> = ({ steps, serviceId = 'cs' }) => {
    const getStepIcon = (title: string, sId: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('recap') || lowerTitle.includes('homework')) return <RefreshCcw size={24} />;
        if (lowerTitle.includes('teaching') || lowerTitle.includes('concept')) return <BookOpen size={24} />;
        if (lowerTitle.includes('practice') || lowerTitle.includes('exam')) {
            return sId === 'cs' ? <Code size={24} /> : <PenTool size={24} />;
        }
        if (lowerTitle.includes('wrap') || lowerTitle.includes('feedback')) return <CheckCircle size={24} />;
        return <Presentation size={24} />;
    };

    return (
        <>
            {/* Mobile: Vertical Timeline */}
            <div className="md:hidden relative pl-8 space-y-6 pb-2 text-left">
                {/* Continuous Line */}
                <div className="absolute left-[11px] top-2 bottom-6 w-1 bg-black" />

                {steps.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between gap-4">
                        {/* Timeline Node */}
                        <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-hot-pink border-3 border-black z-10" />
                        
                        <div className="flex-1">
                            {/* Time Pill */}
                            <div className="inline-block bg-black text-white text-xs font-mono font-bold px-2 py-1 rounded mb-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                                {step.time}
                            </div>

                            {/* Content */}
                            <div>
                                <h4 className="font-heading font-bold text-lg leading-tight mb-1">{step.title}</h4>
                                <p className="text-gray-700 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="shrink-0 bg-white border-2 border-black p-2 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            {getStepIcon(step.title, serviceId)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Horizontal Flow */}
            <div className="hidden md:grid grid-cols-4 gap-4">
                {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col group">
                        {/* Connector Line (except for last item) */}
                        {i < steps.length - 1 && (
                            <div className="absolute top-1/2 -right-6 w-8 h-1 bg-black z-0 hidden lg:block -translate-y-1/2" />
                        )}
                        
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Time Pill */}
                            <div className="self-center bg-hot-pink text-white border-2 border-black font-mono font-bold text-xs px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4 group-hover:scale-110 transition-transform">
                                {step.time}
                            </div>

                            {/* Card */}
                            <div className="flex-1 bg-white border-3 border-black rounded-xl p-5 shadow-solid hover:shadow-solid-hover hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
                                <div className="absolute top-2 right-2 text-black/10 group-hover:text-black/20 transition-colors">
                                    {getStepIcon(step.title, serviceId)}
                                </div>
                                <h4 className="font-heading font-bold text-lg mb-2 text-center relative z-10">{step.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed text-center relative z-10">{step.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default LessonTimeline;
