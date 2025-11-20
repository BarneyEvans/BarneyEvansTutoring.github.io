
import { Lesson, FAQ, ServiceDetail, ExperienceJob } from './types';

export const CONTACT_EMAIL = "ebarneytutoring@gmail.com";
export const GOOGLE_FORM_URL = "https://forms.google.com"; // Placeholder
export const LINKEDIN_URL = "https://linkedin.com"; // Placeholder
export const MYTUTOR_URL = "https://mytutor.co.uk"; // Placeholder

export const PYTHON_CURRICULUM: Lesson[] = [
    { id: 1, title: "Foundations", description: "Print statements, variables, data types, and basic arithmetic operations.", codeSnippet: `print("Hello World")\nscore = 10\nname = "Alex"` },
    { id: 2, title: "Inputs & Strings", description: "Handling user input, type conversion, and string manipulation methods.", codeSnippet: `name = input("Enter name: ")\nage = int(input("Age: "))` },
    { id: 3, title: "Selection & Logic", description: "Control flow using if, elif, else and Boolean logic operators.", codeSnippet: `if score > 50:\n    print("Pass")\nelse:\n    print("Try again")` },
    { id: 4, title: "Loops (While)", description: "Condition-controlled iteration using while loops.", codeSnippet: `while lives > 0:\n    play_game()\n    lives -= 1` },
    { id: 5, title: "Loops (For)", description: "Count-controlled iteration using for loops and ranges.", codeSnippet: `for i in range(5):\n    print(f"Count: {i}")` },
    { id: 6, title: "Functions", description: "Defining subroutines, parameters, and return values.", codeSnippet: `def add(a, b):\n    return a + b` },
    { id: 7, title: "Lists", description: "Working with 1D arrays: indexing, appending, and iterating.", codeSnippet: `scores = [10, 20, 35]\nscores.append(40)` },
    { id: 8, title: "2D Lists", description: "Creating and manipulating tables, grids, and nested loops.", codeSnippet: `grid = [\n  [1, 2, 3],\n  [4, 5, 6]\n]` },
    { id: 9, title: "Dictionaries", description: "Key-value lookups, records, and data structuring.", codeSnippet: `student = {\n  "name": "Sam",\n  "grade": 9\n}` },
    { id: 10, title: "File Handling", description: "Reading from and writing to external text files.", codeSnippet: `with open("data.txt", "w") as f:\n    f.write("Save this")` },
    { id: 11, title: "Searching", description: "Standard algorithms: Linear search and Binary search.", codeSnippet: `def linear_search(arr, target):\n    # ... implementation` },
    { id: 12, title: "Sorting", description: "Standard algorithms: Bubble sort and Merge sort.", codeSnippet: `def bubble_sort(arr):\n    # ... implementation` }
];

export const SERVICES: ServiceDetail[] = [
    {
        id: "cs",
        title: "Programming & AI",
        price: "£32",
        priceDetail: "/hour",
        description: "", // Subtitle removed
        tags: ["Python", "JavaScript", "HTML/CSS", "Machine Learning"],
        logistics: "Online via Zoom (UK Time)  |  Levels: KS3, University & Adult Learners",
        structuredWhoFor: [
            { title: "For School & Exams", description: "GCSE and A-Level Computer Science students needing grade security." },
            { title: "For University", description: "Undergraduates working on coursework, dissertations, or new languages." },
            { title: "For Personal Growth", description: "Adult beginners and hobbyists curious about AI, web development, or career switching." }
        ],
        structuredFeatures: [
            { title: "Interactive Coding", description: "We code live together—you don't just watch me type." },
            { title: "Step-by-Step", description: "Complex ideas broken down into small, clear components." },
            { title: "Adaptive Pace", description: "We move as fast or slow as you need to master the concept." },
            { title: "Active Recall", description: "Regular recaps of earlier concepts to ensure they stick." },
            { title: "Applied Learning", description: "New ideas are immediately linked to exam questions or small projects." }
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
        price: "£29",
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
        details: ["85+ lessons delivered", "5★ rating average", "Schools Programme approved"]
    },
    {
        title: "Engineering Tutor",
        company: "CodeKids",
        period: "Jun 2023 - Jun 2024",
        details: ["Taught engineering & Python", "Ages 6-13", "In-person workshops"]
    }
];