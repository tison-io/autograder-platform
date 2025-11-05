'use client';

import React, { useState, useEffect } from 'react';
import { 
    Home, 
    BookOpen, 
    Bot, 
    ChefHat, 
    Apple, 
    User, 
    Settings,
    Menu,
    X,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import Header from '../components/header';


interface QuestionnaireData {
    goal: string;
    age: string;
    height: string;
    weight: string;
    weightUnit: 'kg' | 'lbs';
}

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
   
    const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
        goal: '',
        age: '',
        height: '',
        weight: '',
        weightUnit: 'kg'
    });

    const sidebarItems = [
        { name: 'Welcome', icon: Home, href: '/dashboard', active: true },
        { name: 'Diary', icon: BookOpen, href: '/dashboard/diary', active: false },
        { name: 'AI Assistant', icon: Bot, href: '/dashboard/ai-assistant', active: false },
        { name: 'Recipe Book', icon: ChefHat, href: '/dashboard/recipes', active: false },
        { name: 'Nutrition', icon: Apple, href: '/dashboard/nutrition', active: false },
        { name: 'Me', icon: User, href: '/dashboard/me', active: false },
        { name: 'Profile', icon: Settings, href: '/dashboard/profile', active: false }
    ];

    const goalOptions = [
        'Lose Weight',
        'Gain Weight',
        'Maintain Weight',
        'Build Muscle',
        'Improve Fitness',
        'Eat Healthier'
    ];

    const questions = [
        {
            title: 'What is your goal?',
            type: 'select',
            options: goalOptions,
            key: 'goal'
        },
        {
            title: 'What is your age?',
            type: 'number',
            placeholder: 'Enter your age',
            key: 'age'
        },
        {
            title: 'What is your height?',
            type: 'number',
            placeholder: 'Enter height in meters (e.g., 1.75)',
            key: 'height'
        },
        {
            title: 'What is your weight?',
            type: 'weight',
            placeholder: 'Enter your weight',
            key: 'weight'
        }
    ];

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            if (parsedProfile.goal && parsedProfile.age && parsedProfile.height && parsedProfile.weight) {
                setQuestionnaireData(parsedProfile);
                setQuestionnaireComplete(true);
            }
        }
    }, []);

    const handleQuestionnaireChange = (key: string, value: string) => {
        setQuestionnaireData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNext = () => {
        if (currentSlide < questions.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            localStorage.setItem('userProfile', JSON.stringify(questionnaireData));
            setQuestionnaireComplete(true);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const isCurrentQuestionAnswered = () => {
        const currentQuestion = questions[currentSlide];
        return questionnaireData[currentQuestion.key as keyof QuestionnaireData] !== '';
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 relative">
            {/* Page-wide Wavy SVG Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <svg 
                    className="w-full h-full opacity-10 dark:opacity-5" 
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

            <Header />
          
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    ${sidebarCollapsed ? 'w-16' : 'w-64'} 
                    fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:inset-0 mt-16 lg:mt-0
                `}>
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                        {!sidebarCollapsed && (
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-montserrat">Dashboard</h2>
                        )}
                        <button
                            onClick={toggleSidebarCollapse}
                            className="p-2 rounded-md hover:bg-sage-100 dark:hover:bg-gray-700 hidden lg:block text-gray-700 dark:text-gray-300"
                        >
                            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>
                    
                    <nav className="mt-8">
                        {sidebarItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 transition-colors duration-200 ${
                                        item.active 
                                            ? 'bg-sage-100 dark:bg-sage-400 text-sage-700 dark:text-sage-300 border-r-2 border-sage-500' 
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-sage-50 dark:hover:bg-gray-700 hover:text-sage-700 dark:hover:text-sage-300'
                                    }`}
                                >
                                    <div className="w-8 h-8 bg-sage-600 dark:bg-sage-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <IconComponent size={18} className="text-white" />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <span className="ml-3 text-sm font-medium font-poppins">{item.name}</span>
                                    )}
                                </a>
                            );
                        })}
                    </nav>
                </div>

              
                <button
                    onClick={toggleSidebar}
                    className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-sage-600 text-white rounded-md shadow-lg"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

            
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 lg:p-6 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            {!questionnaireComplete ? (
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 font-montserrat">
                                                Welcome, Let&apos;s get to know you better
                                            </h1>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-poppins">
                                                {currentSlide + 1} of {questions.length}
                                            </span>
                                        </div>
                                        
                                    
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div 
                                                className="bg-sage-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${((currentSlide + 1) / questions.length) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                 
                                    <div className="min-h-[300px] flex flex-col justify-center">
                                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-montserrat">
                                            {questions[currentSlide].title}
                                        </h2>

                                        {questions[currentSlide].type === 'select' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {goalOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleQuestionnaireChange('goal', option)}
                                                        className={`p-4 text-left rounded-lg border-2 transition-all duration-200 font-poppins ${
                                                            questionnaireData.goal === option
                                                                ? 'border-sage-500 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300'
                                                                : 'border-gray-200 dark:border-gray-600 hover:border-sage-400 dark:hover:border-sage-400 text-gray-800 dark:text-gray-200'
                                                        }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {questions[currentSlide].type === 'number' && (
                                            <div className="max-w-md">
                                                <input
                                                    type="number"
                                                    placeholder={questions[currentSlide].placeholder}
                                                    value={questionnaireData[questions[currentSlide].key as keyof QuestionnaireData]}
                                                    onChange={(e) => handleQuestionnaireChange(questions[currentSlide].key, e.target.value)}
                                                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins"
                                                />
                                            </div>
                                        )}

                                        {questions[currentSlide].type === 'weight' && (
                                            <div className="max-w-md">
                                                <div className="flex gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={questions[currentSlide].placeholder}
                                                        value={questionnaireData.weight}
                                                        onChange={(e) => handleQuestionnaireChange('weight', e.target.value)}
                                                        className="flex-1 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins"
                                                    />
                                                    <select
                                                        value={questionnaireData.weightUnit}
                                                        onChange={(e) => handleQuestionnaireChange('weightUnit', e.target.value)}
                                                        aria-label="Weight unit"
                                                        className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                    >
                                                        <option value="kg">kg</option>
                                                        <option value="lbs">lbs</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                
                                    <div className="flex justify-between mt-8">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentSlide === 0}
                                            className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-poppins shadow-md hover:shadow-lg"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!isCurrentQuestionAnswered()}
                                            className="px-6 py-3 bg-sage-500 hover:bg-sage-600 dark:bg-sage-600 dark:hover:bg-sage-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-poppins shadow-md hover:shadow-lg"
                                        >
                                            {currentSlide === questions.length - 1 ? 'Complete' : 'Next'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 text-center">
                                    <h1 className="text-3xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                                        Welcome! 🎉
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 font-poppins">
                                        Thank you for completing your profile. Your information has been saved and you can view or edit it in the &quot;Me&quot; section.
                                    </p>
                                    <div className="bg-sage-50 dark:bg-gray-700 rounded-lg p-6 text-left max-w-md mx-auto">
                                        <h3 className="font-normal text-gray-800 dark:text-gray-100 mb-4 font-montserrat">Your Profile Summary:</h3>
                                        <ul className="space-y-2 text-black dark:text-gray-300 font-poppins">
                                            <li><strong>Goal:</strong> {questionnaireData.goal}</li>
                                            <li><strong>Age:</strong> {questionnaireData.age} years</li>
                                            <li><strong>Height:</strong> {questionnaireData.height} meters</li>
                                            <li><strong>Weight:</strong> {questionnaireData.weight} {questionnaireData.weightUnit}</li>
                                        </ul>
                                    </div>
                                    
                                    
                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <a 
                                            href="/dashboard/diary"
                                            className="p-4 bg-sage-50 dark:bg-sage-800 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-700 transition-colors duration-200 text-center shadow-md"
                                        >
                                            <div className="mx-auto mb-2 w-8 h-8 bg-sage-600 dark:bg-sage-700 rounded-lg flex items-center justify-center">
                                                <BookOpen className="text-white" size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-sage-700 dark:text-sage-300 font-poppins">Diary</span>
                                        </a>
                                        
                                        <a 
                                            href="/dashboard/ai-assistant"
                                            className="p-4 bg-sage-50 dark:bg-sage-800 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-700 transition-colors duration-200 text-center shadow-md"
                                        >
                                            <div className="mx-auto mb-2 w-8 h-8 bg-sage-600 dark:bg-sage-700 rounded-lg flex items-center justify-center">
                                                <Bot className="text-white" size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-sage-700 dark:text-sage-300 font-poppins">AI Assistant</span>
                                        </a>
                                        
                                        <a 
                                            href="/dashboard/recipes"
                                            className="p-4 bg-sage-50 dark:bg-sage-800 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-700 transition-colors duration-200 text-center shadow-md"
                                        >
                                            <div className="mx-auto mb-2 w-8 h-8 bg-sage-600 dark:bg-sage-700 rounded-lg flex items-center justify-center">
                                                <ChefHat className="text-white" size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-sage-700 dark:text-sage-300 font-poppins">Recipe Book</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

       
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Dashboard;