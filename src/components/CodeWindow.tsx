import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const CodeWindow: React.FC = () => {
    const [text, setText] = useState('');
    
    const fullCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                # Swap elements
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Let's sort a list!
nums = [64, 34, 25, 12]
print(bubble_sort(nums))`;

    useEffect(() => {
        let currentIndex = 0;
        let timeoutId: ReturnType<typeof setTimeout>;

        const typeChar = () => {
            if (currentIndex < fullCode.length) {
                setText(fullCode.slice(0, currentIndex + 1));
                currentIndex++;
                // Randomize typing speed for realism
                timeoutId = setTimeout(typeChar, Math.random() * 30 + 20);
            } else {
                // Pause at end then restart
                timeoutId = setTimeout(() => {
                    currentIndex = 0;
                    setText('');
                    typeChar();
                }, 5000);
            }
        };

        typeChar();

        return () => clearTimeout(timeoutId);
    }, [fullCode]);

    const highlightedCode = useMemo(() => {
        // 1. Escape HTML special characters to prevent rendering issues & interference with our tags
        const escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 2. Single-pass regex replacement for syntax highlighting
        // Order matters: Comments first (so they consume tokens inside them), then others.
        return escaped.replace(
            /(#.*)|(\b(?:def|return|if|elif|else|for|in)\b)|(\b(?:range|len|print|bubble_sort)\b)|(\b\d+\b)/g,
            (match, comment, keyword, func, number) => {
                if (comment) return `<span class="text-[#6a9955]">${comment}</span>`;
                if (keyword) return `<span class="text-[#c586c0]">${keyword}</span>`;
                if (func) return `<span class="text-[#dcdcaa]">${func}</span>`;
                if (number) return `<span class="text-[#b5cea8]">${number}</span>`;
                return match;
            }
        );
    }, [text]);

    return (
        <div className="w-full rounded-[32px] border-4 border-black bg-[#1e1e1e] shadow-solid overflow-hidden flex flex-col h-full min-h-[400px]">
            {/* Window Header */}
            <div className="bg-[#2d2d2d] px-6 py-4 flex items-center gap-3 border-b-2 border-[#000]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/20"></div>
                <div className="ml-4 text-gray-400 font-mono text-xs">sort.py</div>
            </div>

            {/* Code Content */}
            <div className="p-6 md:p-8 flex-grow font-mono text-sm md:text-base leading-relaxed overflow-auto">
                <pre className="whitespace-pre-wrap break-words">
                    <code className="text-[#d4d4d4]">
                        <span dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        <motion.span 
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-2.5 h-5 bg-hot-pink ml-1 align-middle"
                        />
                    </code>
                </pre>
            </div>
            
            {/* Status Bar */}
            <div className="bg-hot-pink text-white px-6 py-2 text-xs font-mono font-bold flex justify-between items-center border-t-4 border-black">
                <span>Python 3.10</span>
                <span>Ln {text.split('\n').length}, Col 1</span>
            </div>
        </div>
    );
};

export default CodeWindow;