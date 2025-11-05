'use client';

import React from 'react';
import Header from "../../components/header";
import Link from "next/link";
import { Leaf, Utensils, Heart, BookOpen, ChevronRight, Clock, Target, Shield, Zap, Apple, Droplets, ArrowLeft } from "lucide-react";


const nutritionTopics = [
    {
        icon: Utensils,
        title: "The Three Macronutrients",
        description: "Learn the role of Carbohydrates, Proteins, and Fats in your body and how to balance them.",
        details: [
            { name: "Carbohydrates", role: "Primary energy source, vital for brain function. Focus on complex carbs (whole grains, vegetables). Aim for 45-65% of daily calories." },
            { name: "Proteins", role: "Essential for building and repairing tissues, enzymes, and hormones. Include lean meats, beans, and nuts. Need 0.8g per kg of body weight." },
            { name: "Fats", role: "Crucial for hormone production, nutrient absorption, and cell health. Prioritize unsaturated fats (avocado, olive oil). Should be 20-35% of calories." }
        ]
    },
    {
        icon: Leaf,
        title: "Vitamins and Minerals (Micronutrients)",
        description: "Discover the small but mighty components vital for metabolism, immunity, and overall well-being.",
        details: [
            { name: "Fat-Soluble Vitamins", role: "A, D, E, K stored in body fat. Vitamin D (bone health, immunity), Vitamin A (vision, skin), Vitamin E (antioxidant), Vitamin K (blood clotting)." },
            { name: "Water-Soluble Vitamins", role: "B-complex and C, not stored in body. B12 (nerve function), Folate (DNA synthesis), Vitamin C (collagen, immunity). Need daily replenishment." },
            { name: "Essential Minerals", role: "Calcium (bones), Iron (oxygen transport), Magnesium (300+ enzyme reactions), Zinc (immune function), Potassium (heart health)." }
        ]
    },
    {
        icon: Heart,
        title: "Portion Control and Mindful Eating",
        description: "Strategies to manage energy intake and improve your relationship with food.",
        details: [
            { name: "Portion Awareness", role: "Use the plate method: 1/2 vegetables, 1/4 lean protein, 1/4 whole grains. Palm-sized protein, thumb-sized fats." },
            { name: "Mindful Eating", role: "Eat slowly (20+ minutes), chew thoroughly, recognize hunger/fullness cues, avoid emotional eating triggers." },
            { name: "Label Reading", role: "Check serving sizes, aim for <5g saturated fat, <200mg sodium per serving, avoid trans fats and added sugars." }
        ]
    },
    {
        icon: Droplets,
        title: "Hydration and Fluid Balance",
        description: "Understanding the critical role of water and proper hydration for optimal health.",
        details: [
            { name: "Daily Water Needs", role: "8-10 cups (2-2.5L) daily, more with exercise/heat. Monitor urine color - pale yellow indicates good hydration." },
            { name: "Electrolyte Balance", role: "Sodium, potassium, magnesium maintain fluid balance. Natural sources: bananas (potassium), leafy greens (magnesium)." },
            { name: "Hydrating Foods", role: "Cucumbers (96% water), watermelon (92%), oranges (87%), soups and broths contribute to daily fluid intake." }
        ]
    },
    {
        icon: Apple,
        title: "Fiber and Digestive Health",
        description: "The importance of dietary fiber for gut health, weight management, and disease prevention.",
        details: [
            { name: "Soluble Fiber", role: "Dissolves in water, helps lower cholesterol and blood sugar. Found in oats, beans, apples, citrus fruits. 10-15g daily." },
            { name: "Insoluble Fiber", role: "Adds bulk to stool, promotes regularity. Found in whole grains, nuts, vegetables. Aim for 25-35g total fiber daily." },
            { name: "Gut Microbiome", role: "Fiber feeds beneficial gut bacteria, supports immune function, may reduce inflammation and disease risk." }
        ]
    },
    {
        icon: Shield,
        title: "Antioxidants and Phytonutrients",
        description: "Plant compounds that protect against cellular damage and support long-term health.",
        details: [
            { name: "Colorful Vegetables", role: "Beta-carotene (orange foods), lycopene (tomatoes), anthocyanins (berries) fight free radicals and inflammation." },
            { name: "Polyphenols", role: "Found in tea, dark chocolate, red wine. Support heart health, brain function, and may reduce cancer risk." },
            { name: "Cruciferous Power", role: "Broccoli, cabbage, kale contain sulforaphane - supports detoxification and may have anti-cancer properties." }
        ]
    },
    {
        icon: Clock,
        title: "Meal Timing and Metabolism",
        description: "How when you eat affects digestion, energy levels, and metabolic health.",
        details: [
            { name: "Circadian Rhythm", role: "Eating aligned with natural body clock optimizes metabolism. Larger meals in AM/afternoon, lighter evening meals." },
            { name: "Intermittent Fasting", role: "12-16 hour fasting windows may improve insulin sensitivity, cellular repair. Consult healthcare provider first." },
            { name: "Pre/Post Exercise", role: "Eat carbs 1-3 hours before exercise, protein within 30 minutes after for optimal recovery and performance." }
        ]
    },
    {
        icon: Target,
        title: "Special Dietary Considerations",
        description: "Nutritional needs for different life stages, conditions, and dietary preferences.",
        details: [
            { name: "Life Stages", role: "Pregnancy: +300 calories, extra folate/iron. Older adults: higher protein needs, B12 supplementation often needed." },
            { name: "Plant-Based Diets", role: "Focus on B12, iron, zinc, omega-3s. Combine legumes with grains for complete proteins. Consider supplements." },
            { name: "Food Allergies", role: "Common allergens: nuts, dairy, gluten. Read labels carefully, work with dietitian for balanced alternatives." }
        ]
    },
    {
        icon: Zap,
        title: "Energy Balance and Metabolism",
        description: "Understanding how calories work and factors that influence your metabolic rate.",
        details: [
            { name: "Caloric Needs", role: "BMR (60-70% of calories) + activity + digestion. Women: 1,600-2,400, Men: 2,000-3,000 calories daily (varies by age/activity)." },
            { name: "Metabolic Factors", role: "Age, muscle mass, genetics, thyroid function affect metabolism. Strength training and protein intake help maintain muscle." },
            { name: "Energy Density", role: "Choose foods with high nutrients per calorie. Vegetables, fruits, lean proteins vs. processed foods with empty calories." }
        ]
    }
];


const nutritionFacts = [
    {
        title: "Did You Know?",
        facts: [
            "Your brain uses about 20% of your daily calories, mostly from glucose.",
            "Vitamin D is actually a hormone, not just a vitamin.",
            "Fiber can help you feel full with fewer calories.",
            "Dark leafy greens are among the most nutrient-dense foods on earth."
        ]
    },
    {
        title: "Quick Tips",
        facts: [
            "Aim for 5-9 servings of fruits and vegetables daily.",
            "Choose whole grains over refined grains when possible.",
            "Include a source of healthy fat with each meal.",
            "Eat the rainbow - different colors provide different nutrients."
        ]
    }
];

export default function NutritionPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            
            <main className="flex-1">
             
                <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-sage-25 to-beige-25 dark:from-gray-800 dark:to-gray-900">
                  
                    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                        <svg 
                            className="absolute w-full h-full opacity-10 dark:opacity-5"
                            viewBox="0 0 1440 1000" 
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M0,320 C320,280 420,360 600,320 C780,280 880,360 1200,320 L1200,800 L0,800 Z"
                                fill="url(#gradient-nutrition-1)"
                            />
                            <path
                                d="M0,480 C300,440 400,520 600,480 C800,440 900,520 1200,480 L1200,800 L0,800 Z"
                                fill="url(#gradient-nutrition-2)"
                            />
                            <defs>
                                <linearGradient id="gradient-nutrition-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.3"/>
                                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.1"/>
                                </linearGradient>
                                <linearGradient id="gradient-nutrition-2" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                <span className="text-sm font-medium font-poppins">The Complete Nutrition Guide</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-montserrat font-bold leading-tight text-gray-800 dark:text-gray-100 mb-4">
                                Comprehensive Nutritional <span className="text-sage-500 dark:text-sage-300">Health</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins leading-relaxed">
                                Master the science of nutrition with our comprehensive guide covering everything from macronutrients to meal timing and special dietary considerations.
                            </p>
                        </div>
                    </div>
                </section>
                
               
                <section className="py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 lg:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Essential Pillars of <span className="text-sage-500 dark:text-sage-400">Optimal Nutrition</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-poppins">
                                Dive deep into the science of nutrition with comprehensive coverage of all aspects of healthy eating and metabolic health.
                            </p>
                        </div>

                        <div className="space-y-12 lg:space-y-16">
                            {nutritionTopics.map((topic, index) => (
                                <div 
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-10 border border-sage-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex items-start space-x-6">
                                        <div className="w-16 h-16 flex-shrink-0 bg-sage-100 dark:bg-sage-700 rounded-xl flex items-center justify-center">
                                            <topic.icon className="h-8 w-8 text-sage-600 dark:text-sage-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-2">
                                                {topic.title}
                                            </h3>
                                            <p className="text-lg text-gray-600 dark:text-gray-300 font-poppins mb-6">
                                                {topic.description}
                                            </p>
                                            
                                    
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-sage-100 dark:border-gray-700">
                                                {topic.details.map((detail, detailIndex) => (
                                                    <div key={detailIndex} className="p-4 bg-sage-50 dark:bg-gray-700 rounded-lg">
                                                        <h4 className="text-base font-semibold text-sage-700 dark:text-sage-300 font-poppins mb-1">
                                                            {detail.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-400 font-poppins">
                                                            {detail.role}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

        
                <section className="py-16 bg-sage-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Nutrition <span className="text-sage-500 dark:text-sage-400">Insights</span>
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {nutritionFacts.map((section, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <h3 className="text-xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.facts.map((fact, factIndex) => (
                                            <li key={factIndex} className="flex items-start space-x-3">
                                                <ChevronRight className="h-5 w-5 text-sage-500 dark:text-sage-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 dark:text-gray-300 font-poppins">
                                                    {fact}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}