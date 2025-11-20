
export enum CourseLevel {
    GCSE = 'GCSE',
    ALEVEL = 'A-Level',
    UNIVERSITY = 'University',
    ADULT = 'Adult'
}

export interface Lesson {
    id: number;
    title: string;
    description: string;
    codeSnippet?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface LessonStep {
    time: string;
    title: string;
    description: string;
}

export interface StructuredItem {
    title: string;
    description: string;
}

export interface ServiceDetail {
    id: string;
    title: string;
    price: string;
    priceDetail?: string;
    description: string;
    tags: string[];
    logistics: string;
    structuredWhoFor: StructuredItem[];
    structuredFeatures: StructuredItem[];
    lessonFlow: LessonStep[];
}

export interface ExperienceJob {
    title: string;
    company: string;
    period: string;
    details: string[];
}
