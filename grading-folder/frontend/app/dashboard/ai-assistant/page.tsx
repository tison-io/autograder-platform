'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Send,
    Loader2,
    Sparkles,
    ArrowLeft,
    Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import Header from "../../components/header";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI nutrition assistant. Ask me anything about nutrition, meal planning, dietary advice, or healthy eating habits. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestedQuestions = [
        "What are good protein sources?",
        "What's a balanced meal plan?",
        "Tips for healthy snacking?",
        "How much water should I drink daily?",
        "Best foods for weight loss?",
        "Healthy breakfast ideas?",
      
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
       
        inputRef.current?.focus();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {

            const res = await fetch('https://snackandtrack.onrender.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage.content })
            });

            if (!res.ok) {
            const errText = await res.text();
            throw new Error(`API error ${res.status}: ${errText}`);
            }

          
            const data = await res.json();
             console.log('API Response:', data); 
            
           
            let assistantText = '';
            
            if (typeof data === 'string') {
                assistantText = data;
            } else if (data?.response) {
             
                assistantText = data.response;
            } else if (data?.reply) {
                assistantText = data.reply;
            } else if (data?.content) {
                assistantText = data.content;
            } else if (data?.message) {
                assistantText = data.message;
            } else {
                
                assistantText = JSON.stringify(data);
            }

            const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: assistantText,
            timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleSuggestedQuestion = (question: string) => {
        setInputMessage(question);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
            <Header />
            
            <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto bg-sage-25 dark:bg-gray-900 relative">
               
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <svg 
                            className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-5" 
                            viewBox="0 0 1200 800" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <path
                                d="M0,320 C320,280 420,360 600,320 C780,280 880,360 1200,320 L1200,800 L0,800 Z"
                                fill="url(#gradient1)"
                            />
                            <path
                                d="M0,480 C300,440 400,520 600,480 C800,440 900,520 1200,480 L1200,800 L0,800 Z"
                                fill="url(#gradient2)"
                            />
                            <path
                                d="M0,640 C240,600 360,680 600,640 C840,600 960,680 1200,640 L1200,800 L0,800 Z"
                                fill="url(#gradient3)"
                            />
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.3"/>
                                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.1"/>
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#047857" stopOpacity="0.1"/>
                                </linearGradient>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.15"/>
                                    <stop offset="100%" stopColor="#059669" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="max-w-4xl mx-auto p-4 lg:p-6 relative z-10">
                   
                        <div className="mb-6">
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-4 font-poppins transition-colors duration-200"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </Link>
                            
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-sage-600 dark:bg-sage-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <Sparkles className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 font-montserrat">
                                        AI Nutrition Assistant
                                    </h1>
                                    <p className="text-gray-700 dark:text-gray-300 mt-1 font-poppins">
                                        Your personal nutrition and health advisor
                                    </p>
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sage-200 dark:border-gray-700 overflow-hidden">
                          
                            <div className="h-96 lg:h-[500px] overflow-y-auto p-4 lg:p-6 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="flex items-start gap-2 max-w-[85%] lg:max-w-[75%]">
                                            {message.role === 'assistant' && (
                                                <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                    <Sparkles className="text-white" size={16} />
                                                </div>
                                            )}
                                            <div
                                                className={`rounded-2xl p-3 lg:p-4 ${
                                                    message.role === 'user'
                                                        ? 'bg-sage-600 text-white ml-2'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                }`}
                                            >
                                                <p className="text-sm lg:text-base font-poppins whitespace-pre-wrap leading-relaxed">
                                                    {message.content}
                                                </p>
                                                <span className={`text-xs mt-2 block ${
                                                    message.role === 'user' 
                                                        ? 'text-sage-100' 
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-2 max-w-[85%] lg:max-w-[75%]">
                                            <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <Sparkles className="text-white" size={16} />
                                            </div>
                                            <div className="rounded-2xl p-3 lg:p-4 bg-gray-100 dark:bg-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="animate-spin text-sage-600 dark:text-sage-400" size={16} />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                        Thinking...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                          
                            {messages.length === 1 && (
                                <div className="border-t border-gray-200 dark:border-gray-600 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 font-semibold text-sage-600 dark:text-gray-100 mb-3 font-montserrat">
                                        <Lightbulb className="w-5 h-5 text-sage-600" />
                                        <span>Suggestions to get started:</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {suggestedQuestions.map((question, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestedQuestion(question)}
                                                className="text-left p-3 text-sm bg-white dark:bg-gray-700 border border-sage-200 dark:border-gray-600 rounded-lg hover:bg-sage-50 dark:hover:bg-gray-600 hover:border-sage-300 dark:hover:border-sage-500 transition-all duration-200 font-poppins text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
                                                title={`Ask: ${question}`}
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                         
                            <div className="border-t border-gray-200 dark:border-gray-600 p-4 lg:p-6 bg-white dark:bg-gray-800">
                                <div className="flex gap-2 lg:gap-3">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything about nutrition..."
                                        disabled={isLoading}
                                        className="flex-1 p-3 lg:p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins disabled:opacity-50 transition-colors duration-200"
                                        maxLength={500}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim() || isLoading}
                                        className="px-4 lg:px-6 py-3 lg:py-4 bg-sage-600 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-poppins shadow-lg hover:shadow-xl flex items-center justify-center group"
                                        title="Send message"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                   
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                        {inputMessage.length}/500
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Usage Tips */}
                        <div className="mt-6 bg-sage-100 dark:bg-sage-800/30 rounded-xl p-4 border border-sage-200 dark:border-sage-700">
                            <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                <Lightbulb className="w-5 h-5 text-sage-600" />
                                <span>Pro Tips</span>
                            </div>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 font-poppins">
                                <li>• Be specific about your dietary goals and restrictions</li>
                                <li>• Ask about meal planning, portion sizes, or specific nutrients</li>
                                <li>• Mention your activity level for personalized recommendations</li>
                                <li>• Feel free to ask follow-up questions for clarification</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIAssistant;