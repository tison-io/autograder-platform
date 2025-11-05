'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search,
    BookOpen,
    ArrowLeft,
    Loader2,
    Droplets,
    Heart,
    AlertCircle,
    TrendingUp,
    Target,
    Coffee,
    Apple,
    Info,
    Calendar as CalendarIcon,
    Save,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import Header from "../../components/header";

interface FoodItem {
    food_name: string;
    nf_calories: number;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_total_fat: number;
    serving_qty?: number;
    serving_unit?: string;
}

interface DiaryResult {
    foods: FoodItem[];
}

interface SavedDayData {
    date: string;
    foods: FoodItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    timestamp: number;
}

export default function DiaryPage() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<DiaryResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [savedData, setSavedData] = useState<Record<string, SavedDayData>>({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [saving, setSaving] = useState(false);

    
    useEffect(() => {
        const saved = localStorage.getItem('diary-data');
        if (saved) {
            try {
                setSavedData(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
        loadDataForDate(selectedDate);
    }, []);

    
    const loadDataForDate = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const dayData = savedData[dateKey];
        if (dayData) {
            setResult({ foods: dayData.foods });
        } else {
            setResult(null);
        }
        setQuery('');
        setError(null);
    };

    
    const saveDataToStorage = (data: Record<string, SavedDayData>) => {
        localStorage.setItem('diary-data', JSON.stringify(data));
        setSavedData(data);
    };

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/diary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) {
                throw new Error(`API responded with status ${res.status}`);
            }

            const data = await res.json();
            setResult(data.data);
        } catch (error) {
            console.error('Error analyzing food:', error);
            setError('Failed to analyze food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDay = async () => {
        if (!result || !result.foods || result.foods.length === 0) {
            setError('No food data to save');
            return;
        }

        setSaving(true);
        const dateKey = selectedDate.toISOString().split('T')[0];
        const macros = getTotalMacros();
        
        const dayData: SavedDayData = {
            date: dateKey,
            foods: result.foods,
            totalCalories: getTotalCalories(),
            totalProtein: macros.protein,
            totalCarbs: macros.carbs,
            totalFat: macros.fat,
            timestamp: Date.now()
        };

        const newSavedData = { ...savedData, [dateKey]: dayData };
        saveDataToStorage(newSavedData);
        
        setTimeout(() => {
            setSaving(false);
        }, 500);
    };

    const handleDeleteDay = () => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const newSavedData = { ...savedData };
        delete newSavedData[dateKey];
        saveDataToStorage(newSavedData);
        setResult(null);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        loadDataForDate(date);
        setShowCalendar(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getTotalCalories = () => {
        if (!result?.foods) return 0;
        return result.foods.reduce((total, item) => total + item.nf_calories, 0);
    };

    const getTotalMacros = () => {
        if (!result?.foods) return { protein: 0, carbs: 0, fat: 0 };
        return result.foods.reduce((totals, item) => ({
            protein: totals.protein + item.nf_protein,
            carbs: totals.carbs + item.nf_total_carbohydrate,
            fat: totals.fat + item.nf_total_fat
        }), { protein: 0, carbs: 0, fat: 0 });
    };

    
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSameDate = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString();
    };

    const hasDataForDate = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        return savedData[dateKey] !== undefined;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-10 w-10"></div>
            );
        }

    
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = isSameDate(date, selectedDate);
            const isTodayDate = isToday(date);
            const hasData = hasDataForDate(date);

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`
                        h-10 w-10 rounded-lg text-sm font-medium transition-colors duration-200
                        ${isSelected 
                            ? 'bg-sage-600 text-white' 
                            : isTodayDate
                                ? 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 border border-sage-400'
                                : hasData
                                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                        relative
                    `}
                >
                    {day}
                    {hasData && !isSelected && (
                        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    )}
                </button>
            );
        }

        return days;
    };

    const healthTips = [
        {
            icon: <Droplets className="h-6 w-6 text-blue-500" />,
            title: "Stay Hydrated",
            description: "Drink 1-2 liters of water daily to maintain proper hydration and support metabolism."
        },
        {
            icon: <Heart className="h-6 w-6 text-red-500" />,
            title: "Consult Your Doctor",
            description: "See your healthcare provider to determine your optimal daily calorie intake based on your individual needs."
        },
        {
            icon: <Target className="h-6 w-6 text-green-500" />,
            title: "Balanced Nutrition",
            description: "Aim for a balanced mix of proteins, carbohydrates, and healthy fats in your daily meals."
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
            title: "Track Progress",
            description: "Log your meals consistently to understand your eating patterns and make informed dietary choices."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            
            <main className="flex-1">
            
                <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-sage-25 to-beige-25 dark:from-gray-800 dark:to-gray-900">
        
                    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                        <svg 
                            className="absolute w-full h-full opacity-10 dark:opacity-5"
                            viewBox="0 0 1440 1000" 
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M0,320 C320,280 420,360 600,320 C780,280 880,360 1200,320 L1200,800 L0,800 Z"
                                fill="url(#gradient-diary-1)"
                            />
                            <path
                                d="M0,480 C300,440 400,520 600,480 C800,440 900,520 1200,480 L1200,800 L0,800 Z"
                                fill="url(#gradient-diary-2)"
                            />
                            <defs>
                                <linearGradient id="gradient-diary-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.3"/>
                                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.1"/>
                                </linearGradient>
                                <linearGradient id="gradient-diary-2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#047857" stopOpacity="0.1"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                        <div className="mb-8">
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200 font-poppins"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </Link>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center space-x-2 text-sage-600 dark:text-sage-400 mb-4 bg-sage-100/50 dark:bg-sage-800/50 p-2 rounded-full px-4">
                                <BookOpen className="h-5 w-5" />
                                <span className="text-sm font-medium font-poppins">Food Diary</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-montserrat font-bold leading-tight text-gray-800 dark:text-gray-100 mb-4">
                                Track Your <span className="text-sage-500 dark:text-sage-300">Daily Nutrition</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins leading-relaxed mb-8">
                                Log your meals and get detailed nutritional information to maintain a healthy lifestyle.
                            </p>

                        
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-montserrat">
                                        {formatDate(selectedDate)}
                                    </div>
                                    <button
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-sage-300 dark:border-gray-600 rounded-lg hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors duration-200 font-poppins"
                                    >
                                        <CalendarIcon size={18} />
                                        <span>Change Date</span>
                                    </button>
                                </div>

                            
                                {showCalendar && (
                                    <div className="inline-block bg-white dark:bg-gray-800 border border-sage-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => navigateMonth('prev')}
                                                className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-montserrat">
                                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <button
                                                onClick={() => navigateMonth('next')}
                                                className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                <div key={day} className="h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="grid grid-cols-7 gap-1">
                                            {renderCalendar()}
                                        </div>
                                        
                                        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Has data</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-sage-500 border border-sage-400 rounded-full"></div>
                                                <span>Today</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        
                            <div className="max-w-2xl mx-auto">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="e.g., 2 eggs and toast, chicken salad, apple..."
                                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={!query.trim() || loading}
                                        className="px-6 py-4 bg-sage-600 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-poppins flex items-center gap-2 justify-center"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <Plus size={20} />
                                        )}
                                        <span className="hidden sm:inline">
                                            {loading ? 'Analyzing...' : 'Add Food'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                            <div className="lg:col-span-2">
                        
                                {error && (
                                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                                            <div>
                                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2 font-montserrat">
                                                    Analysis Error
                                                </h3>
                                                <p className="text-red-700 dark:text-red-300 font-poppins">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                        
                                {result && result.foods && result.foods.length > 0 && (
                                    <div className="space-y-6">
                                    
                                        <div className="flex flex-wrap gap-3 justify-end">
                                            <button
                                                onClick={handleSaveDay}
                                                disabled={saving}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors duration-200 font-poppins flex items-center gap-2"
                                            >
                                                {saving ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    <Save size={16} />
                                                )}
                                                {saving ? 'Saving...' : 'Save Day'}
                                            </button>
                                            {hasDataForDate(selectedDate) && (
                                                <button
                                                    onClick={handleDeleteDay}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-poppins flex items-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Clear Day
                                                </button>
                                            )}
                                        </div>

                                
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-sage-100 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-sage-600 dark:text-sage-400 font-montserrat">
                                                        {Math.round(getTotalCalories())}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                        Total Calories
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-sage-100 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-montserrat">
                                                        {Math.round(getTotalMacros().protein)}g
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                        Protein
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-sage-100 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-montserrat">
                                                        {Math.round(getTotalMacros().carbs)}g
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                        Carbs
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-sage-100 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-montserrat">
                                                        {Math.round(getTotalMacros().fat)}g
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                        Fat
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sage-100 dark:border-gray-700 overflow-hidden">
                                            <div className="p-6 border-b border-sage-100 dark:border-gray-700">
                                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-montserrat flex items-center gap-2">
                                                    <Apple className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                                                    Food Items for {selectedDate.toLocaleDateString()}
                                                </h2>
                                            </div>
                                            <div className="divide-y divide-sage-100 dark:divide-gray-700">
                                                {result.foods.map((item, index) => (
                                                    <div key={`${item.food_name}-${index}`} className="p-6">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-montserrat capitalize">
                                                                    {item.food_name}
                                                                </h3>
                                                                {item.serving_qty && item.serving_unit && (
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                                        Serving: {item.serving_qty} {item.serving_unit}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                                                <div>
                                                                    <div className="text-lg font-bold text-sage-600 dark:text-sage-400 font-montserrat">
                                                                        {Math.round(item.nf_calories)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                                        Calories
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-montserrat">
                                                                        {Math.round(item.nf_protein)}g
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                                        Protein
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 font-montserrat">
                                                                        {Math.round(item.nf_total_carbohydrate)}g
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                                        Carbs
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400 font-montserrat">
                                                                        {Math.round(item.nf_total_fat)}g
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                                        Fat
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            
                                {!result && !loading && !error && (
                                    <div className="text-center py-12">
                                        <Coffee className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                            {hasDataForDate(selectedDate) 
                                                ? 'No data for this date' 
                                                : 'Ready to Track Your Meals?'
                                            }
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 font-poppins max-w-md mx-auto">
                                            {hasDataForDate(selectedDate)
                                                ? 'Select a different date or add new food entries.'
                                                : 'Enter the foods you\'ve eaten above and get detailed nutritional information instantly.'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                    
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sage-100 dark:border-gray-700 p-6 sticky top-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Info className="h-6 w-6 text-sage-600 dark:text-sage-400" />
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-montserrat">
                                            Health Tips
                                        </h3>
                                    </div>
                                    <div className="space-y-6">
                                        {healthTips.map((tip, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    {tip.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                                        {tip.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-poppins leading-relaxed">
                                                        {tip.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                
                                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-amber-800 dark:text-amber-200 font-poppins">
                                                    <strong>Important:</strong> This tool provides nutritional estimates. 
                                                    For personalized dietary advice, consult with a registered dietitian or healthcare provider.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                        
                                    {Object.keys(savedData).length > 0 && (
                                        <div className="mt-6 p-4 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-lg">
                                            <h4 className="font-semibold text-sage-800 dark:text-sage-200 mb-2 font-montserrat">
                                                Tracking Summary
                                            </h4>
                                            <p className="text-sm text-sage-700 dark:text-sage-300 font-poppins">
                                                You&apos;ve logged data for {Object.keys(savedData).length} day{Object.keys(savedData).length !== 1 ? 's' : ''}. 
                                                Keep up the great work!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
