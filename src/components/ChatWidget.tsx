import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send, MessageSquare, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'ai';
    timestamp: Date;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNudge, setShowNudge] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [sessionId] = useState(() => crypto.randomUUID());
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: "Hello! I'm AI-Barney. I can answer questions about the course syllabus, pricing, or my teaching style. Try asking: 'Do you teach A-Level?'",
            role: 'ai',
            timestamp: new Date()
        }
    ]);

    const [processingStatus, setProcessingStatus] = useState<string | null>(null);
    const [isDesktopView, setIsDesktopView] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkViewport = () => {
            setIsDesktopView(window.innerWidth >= 800 && window.innerHeight >= 800);
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    useEffect(() => {
        const hasSeenNudge = localStorage.getItem('hasSeenChatNudge');
        if (!hasSeenNudge) {
            const timer = setTimeout(() => setShowNudge(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissNudge = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowNudge(false);
        localStorage.setItem('hasSeenChatNudge', 'true');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, processingStatus]);

    useEffect(() => {
        if (isOpen && !isDesktopView) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isDesktopView]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            content: inputValue,
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setProcessingStatus("Thinking...")
        
        const history = [...messages, userMsg].map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : msg.role,
            content: msg.content
        }));

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: history,
                    session_id: sessionId
                })
            });

            if (!response.ok) {
                throw new Error("Server error!");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No reader available");
            }

            const aiMsgId = (Date.now() + 1).toString();
            let messageCreated = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const events = chunk.split('\n\n');

                for (const event of events) {
                    if (event.startsWith('data: ')) {
                        const data = event.slice(6);
                        if (data === '[DONE]') break;

                        if (!messageCreated) {
                            const aiMsg: Message = {
                                id: aiMsgId,
                                content: data,
                                role: 'ai',
                                timestamp: new Date()
                            };
                            setMessages(prev => [...prev, aiMsg]);
                            setProcessingStatus(null);
                            messageCreated = true;
                        } else {
                            setMessages(prev => prev.map(msg =>
                                msg.id === aiMsgId
                                    ? { ...msg, content: msg.content + data }
                                    : msg
                            ));
                        }
                    }
                }
            }

        } catch (error) {
            setProcessingStatus("Failed to get response");
            console.error("Failed:", error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (showNudge) {
            setShowNudge(false);
            localStorage.setItem('hasSeenChatNudge', 'true');
        }
    };

    // --- Custom Renderer for Code Blocks ---
    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        const [isCopied, setIsCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(String(children));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return !inline && match ? (
            <div className="relative my-4 rounded-lg overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-gray-800 text-gray-200 px-4 py-1 text-xs flex justify-between items-center border-b border-gray-700 font-mono">
                    <span>{match[1]}</span>
                    <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition-colors">
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: 0 }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className={`${className} bg-gray-200 text-red-500 px-1 rounded text-sm font-mono`} {...props}>
                {children}
            </code>
        );
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && isDesktopView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer"
                        aria-label="Close chat"
                    />
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            origin-bottom-right
                            bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            flex flex-col overflow-hidden
                            ${isDesktopView
                                ? 'relative h-[520px] w-[360px] mb-2 rounded-xl'
                                : 'fixed inset-0 h-[100dvh]'}
                        `}
                    >
                        <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black shrink-0">
                            <div className="flex items-center gap-3">
                                <Terminal size={18} className="text-white" />
                                <span className="font-mono font-bold tracking-wider text-sm">AI_BARNEY_V1.0</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-hot-pink animate-pulse">ONLINE</span>
                                    <div className="w-2 h-2 rounded-full bg-hot-pink"></div>
                                </div>
                                {!isDesktopView && (
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white hover:text-hot-pink transition-colors p-1"
                                        aria-label="Close chat"
                                    >
                                        <X size={24} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-cream space-y-4 scrollbar-terminal">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}
                                >
                                    <div className={`
                                        p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                        ${msg.role === 'user'
                                            ? 'bg-hot-pink text-white rounded-l-xl rounded-tr-xl'
                                            : 'bg-white text-black rounded-r-xl rounded-tl-xl text-sm'}
                                    `}>
                                         {msg.role === 'ai' ? (
                                            <div className="max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code: CodeBlock,
                                                        h1: ({children}) => <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>,
                                                        h2: ({children}) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
                                                        h3: ({children}) => <h3 className="text-sm font-bold mt-3 mb-1">{children}</h3>,
                                                        p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                                                        ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                        ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                        li: ({children}) => <li className="leading-relaxed">{children}</li>,
                                                        strong: ({children}) => <strong className="font-bold">{children}</strong>,
                                                        em: ({children}) => <em className="italic">{children}</em>,
                                                        hr: () => <hr className="my-3 border-gray-300" />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                                        {msg.role === 'user' ? 'You' : 'System'} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))}

                            {processingStatus && (
                                <div className="self-start mr-auto max-w-[85%]">
                                    <div className="bg-black text-hot-pink border-2 border-black p-3 rounded-r-xl rounded-tl-xl font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-2">
                                        <span className="animate-pulse">▋</span>
                                        {processingStatus}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="bg-cream px-4 py-1 text-[10px] text-center text-gray-500 border-t-2 border-black/10">
                            AI can make mistakes. Verify important details.
                        </div>

                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t-4 border-black flex gap-2 shrink-0 safe-area-bottom">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 bg-gray-100 border-2 border-black px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!!processingStatus}
                                className={`
                                    bg-black text-hot-pink p-2 border-2 border-black rounded-lg
                                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                    transition-all duration-150 ease-out
                                    hover:bg-hot-pink hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                                    active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                                    disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-hot-pink disabled:cursor-not-allowed
                                    flex items-center justify-center
                                `}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                    )}
                </AnimatePresence>

                <div className={`relative group ${isOpen && !isDesktopView ? 'hidden' : 'block'}`}>
                    <AnimatePresence>
                        {showNudge && !isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="absolute right-full mr-5 bottom-3 w-max max-w-[200px] bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-40 hidden md:block"
                            >
                                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-t-3 border-r-3 border-black transform rotate-45 -translate-y-1/2"></div>

                                <button
                                    onClick={dismissNudge}
                                    className="absolute -top-3 -left-3 bg-black text-white rounded-full p-1 hover:bg-hot-pink border-2 border-black transition-colors"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                                <p className="font-heading font-bold text-sm leading-tight text-black">
                                    Questions? <br/>
                                    <span className="text-hot-pink">Ask AI-Barney.</span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleToggle}
                        className={`
                            w-16 h-16 rounded-full
                            border-3 border-black flex items-center justify-center
                            transition-all duration-200 ease-out
                            shadow-solid hover:shadow-solid-hover hover:translate-x-[4px] hover:translate-y-[4px]
                            active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
                            ${isOpen ? 'bg-white text-hot-pink' : 'bg-white text-black'}
                        `}
                        aria-label={isOpen ? "Close chat" : "Open chat"}
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {isOpen ? (
                                <X size={32} strokeWidth={3} className="text-hot-pink" />
                            ) : (
                                <MessageSquare size={32} strokeWidth={3} className="text-hot-pink fill-current" style={{ fillOpacity: 0.1 }} />
                            )}
                        </motion.div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;