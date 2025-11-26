
import { Lesson, FAQ, ServiceDetail, ExperienceJob } from './types';

export const CONTACT_EMAIL = "ebarneytutoring@gmail.com";
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfK8TGCXA-HOv2_LMBt2WysIyLuXZ-RC66K1q1unHPSX0hQ5w/viewform?usp=header";
export const LINKEDIN_URL = "https://www.linkedin.com/in/barney-evans-400379280/";
export const MYTUTOR_URL = "https://www.mytutor.co.uk/tutors/9468218/";

export const PYTHON_CURRICULUM: Lesson[] = [
    { id: 1, title: "Basics", description: "Print statements, variables, data types, and basic arithmetic operations.", codeSnippet: `print("Hello World")\nscore = int(input())` },
    { id: 2, title: "Inputs", description: "Handling user input, type conversion, and string manipulation methods.", codeSnippet: `name = input("Enter name: ")\nage = int(input("Age: "))` },
    { id: 3, title: "Logic", description: "Control flow using if, elif, else and Boolean logic operators.", codeSnippet: `if score > 50:\n    print("Pass")` },
    { id: 4, title: "While", description: "Condition-controlled iteration using while loops.", codeSnippet: `while lives > 0:\n    lives -= 1` },
    { id: 5, title: "For", description: "Count-controlled iteration using for loops and ranges.", codeSnippet: `for i in range(5):\n    print(f"Count: {i}")` },
    { id: 6, title: "Functions", description: "Defining subroutines, parameters, and return values.", codeSnippet: `def add(a, b):\n    return a + b` },
    { id: 7, title: "Lists", description: "Working with 1D arrays: indexing, appending, and iterating.", codeSnippet: `scores = [10, 20, 35]\nscores.append(40)` },
    { id: 8, title: "Grids", description: "Creating and manipulating tables, grids, and nested loops.", codeSnippet: `grid = [[1, 2], [3, 4]]\nprint(grid[0][1])` },
    { id: 9, title: "Dicts", description: "Key-value lookups, records, and data structuring.", codeSnippet: `student = {"name": "Sam"}\nprint(student["name"])` },
    { id: 10, title: "Files", description: "Reading from and writing to external text files.", codeSnippet: `with open("data.txt", "w") as f:\n    f.write("Save this")` },
    { id: 11, title: "Searching", description: "Standard algorithms: Linear search and Binary search.", codeSnippet: `def linear_search(arr, target):\n    # ... implementation` },
    { id: 12, title: "Sorting", description: "Standard algorithms: Bubble sort and Merge sort.", codeSnippet: `def bubble_sort(arr):\n    # ... implementation` }
];

export const SERVICES: ServiceDetail[] = [
    {
        id: "cs",
        title: "Specialist Programming and Applied AI",
        price: "£38",
        priceDetail: "/hour",
        description: "", // Subtitle removed
        tags: ["Python", "JavaScript", "HTML/CSS", "Machine Learning"],
        logistics: "Online via Zoom (UK Time)  |  Levels: KS3, University & Adult Learners",
        structuredWhoFor: [
            { 
                title: "Build AI Applications", 
                description: "Don't just use AI—build it. Learn to create RAG-powered chatbots (like AI-Barney) using Python, OpenAI, and Fast API."
            },
            { 
                title: "Full-Stack Development", 
                description: "Master the modern tech stack. We build responsive, deployed applications using React, TypeScript, and Tailwind CSS." 
            },
            { 
                title: "Academic & Career Mastery", 
                description: "For A-Level NEAs, University dissertations, or career switchers. We focus on high-level system design and grade-securing code." 
            }
        ],
        structuredFeatures: [
            { 
                title: "Industry Best Practices", 
                description: "Writing clean, maintainable code using standard conventions (PEP 8, ESLint) and modular architecture." 
            },
            { 
                title: "Full-Stack Architecture", 
                description: "Understanding how frontend, backend, and databases interact to build complete, scalable systems." 
            },
            { 
                title: "Professional Code Review", 
                description: "Detailed feedback on your logic, efficiency, and style to refine your implementation towards professional standards." 
            },
            { 
                title: "Systematic Debugging", 
                description: "Learning structured workflows to diagnose errors, manage dependencies, and solve complex problems independently." 
            },
            { 
                title: "Deployment Pipelines", 
                description: "Taking projects from local development to live production environments using modern hosting and version control." 
            }
        ],
        lessonFlow: [
            { time: "5-10m", title: "Recap", description: "Reviewing previous concept or homework." },
            { time: "20-25m", title: "Live Teaching", description: "New concept explained via interactive coding." },
            { time: "20-25m", title: "Practice", description: "Student writes code with guidance & feedback." },
            { time: "5m", title: "Wrap Up", description: "Summary of lesson & next steps." }
        ]
    },
    {
        id: "gcse",
        title: "GCSE Sciences & Maths",
        price: "£32",
        priceDetail: "/hour",
        description: "", // Subtitle removed
        tags: ["Maths", "Physics", "Chemistry", "Biology", "CompSci"],
        logistics: "Boards: AQA, Edexcel, OCR & CIE  |  Format: Online (Zoom) or In-Person (South London)",
        structuredWhoFor: [
            { title: "Building Foundations (Years 9–10)", description: "Students starting their GCSE course or needing help grasping new topics as they come up in school." },
            { title: "Exam Preparation (Year 11)", description: "Focused revision strategies for upcoming mocks and final exams." },
            { title: "Topic Mastery", description: "Students struggling with specific modules (e.g., Organic Chemistry or Vectors) who need targeted intervention." }
        ],
        structuredFeatures: [
            { title: "Active Learning", description: "Lessons are interactive discussions, not just passive listening." },
            { title: "Simplification", description: "Complex concepts are broken down into small, manageable steps." },
            { title: "Tailored Pace", description: "We move at the speed the student needs to fully understand." },
            { title: "Retention", description: "Regular recaps of earlier topics to prevent forgetting." },
            { title: "Exam Technique", description: "Every new concept is immediately applied to real exam-style questions." }
        ],
        lessonFlow: [
            { time: "5-10m", title: "Homework Recap", description: "Reviewing previous week's task & errors." },
            { time: "20-25m", title: "Concept Teaching", description: "New topic explained interactively." },
            { time: "20-25m", title: "Exam Practice", description: "Applying concept to exam-style questions." },
            { time: "5m", title: "Feedback", description: "Q&A, marking, and homework assignment." }
        ]
    }
];

export const EXPERIENCE: ExperienceJob[] = [
    {
        title: "Tutor & Mentor",
        company: "Ritz Education",
        period: "Mar 2025 - Present",
        details: ["Teaching Maths & CS Olympiad", "Web Dev & Machine Learning", "Groups of 5-15 students online"]
    },
    {
        title: "Tutor",
        company: "MyTutor",
        period: "Dec 2023 - Present",
        details: ["95+ lessons delivered", "5★ rating average", "Schools Programme approved"]
    },
    {
        title: "Engineering Tutor",
        company: "CodeKids",
        period: "Jun 2023 - Jun 2024",
        details: ["Taught engineering & Python", "Ages 6-13", "In-person workshops"]
    }
];