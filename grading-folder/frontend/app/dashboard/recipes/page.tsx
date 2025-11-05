'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search,
    ChefHat,
    Clock,
    Users,
    ArrowLeft,
    Loader2,
    Heart,
    Star,
    Filter,
    X,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Header from "../../components/header";

interface Recipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    healthScore?: number;
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  
    extendedIngredients?: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
        original: string;
    }>;
    instructions?: string;
    sourceUrl?: string;
}

interface SearchFilters {
    diet?: string;
    intolerances?: string;
    type?: string;
    maxReadyTime?: number;
}

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());

    const popularSearches = [
        "Healthy breakfast",
        "Quick dinner", 
        "Vegetarian meals",
        "Low carb recipes",
        "Pasta dishes",
        "Chicken recipes",
        "Desserts",
        "Salads"
    ];

    const dietOptions = [
        { value: '', label: 'Any Diet' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'ketogenic', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' },
        { value: 'gluten-free', label: 'Gluten Free' }
    ];

    const mealTypes = [
        { value: '', label: 'Any Type' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' },
        { value: 'snack', label: 'Snack' },
        { value: 'dessert', label: 'Dessert' }
    ];

    const searchRecipes = async (query: string, searchFilters: SearchFilters = {}) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        setError(null);

        try {
           
            const params = new URLSearchParams({
                query: query.trim(),
                number: '12'
            });

          
            Object.entries(searchFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    params.append(key, String(value));
                }
            });

            const apiUrl = `https://snackandtrack.onrender.com/recipes/search?${params}`;
            console.log('Calling API:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API responded with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
           
            const recipeResults = data.results || [];
            setRecipes(Array.isArray(recipeResults) ? recipeResults : []);
            
        } catch (error) {
            console.error('Error searching recipes:', error);
            
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setError('Unable to connect to the recipe service. Please make sure the server is running on port 5000.');
            } else if (error instanceof Error) {
                if (error.message.includes('404')) {
                    setError('Recipe search endpoint not found. Please check if the backend server is properly configured.');
                } else if (error.message.includes('500')) {
                    setError('Server error occurred. This might be due to API key configuration or external service issues.');
                } else {
                    setError(error.message);
                }
            } else {
                setError('An unexpected error occurred while searching for recipes.');
            }
            
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchRecipes(searchQuery, filters);
    };

    const handlePopularSearch = (search: string) => {
        setSearchQuery(search);
        searchRecipes(search, filters);
    };

    const toggleFavorite = (recipeId: number) => {
        setFavoriteRecipes(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(recipeId)) {
                newFavorites.delete(recipeId);
            } else {
                newFavorites.add(recipeId);
            }
            return newFavorites;
        });
    };

    const toggleRecipeExpansion = (recipeId: number) => {
        setExpandedRecipes(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(recipeId)) {
                newExpanded.delete(recipeId);
            } else {
                newExpanded.add(recipeId);
            }
            return newExpanded;
        });
    };

    const applyFilters = () => {
        searchRecipes(searchQuery, filters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({});
        setShowFilters(false);
        if (hasSearched) {
            searchRecipes(searchQuery, {});
        }
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const parseInstructions = (instructions: string) => {
        if (!instructions) return [];
        

        const steps = instructions
            .split(/\d+\.|\n/)
            .filter(step => step.trim().length > 0)
            .map(step => step.trim());
            
        return steps.length > 0 ? steps : [instructions];
    };

    const retrySearch = () => {
        if (searchQuery.trim()) {
            searchRecipes(searchQuery, filters);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://via.placeholder.com/400x300?text=Recipe+Image';
    };

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
                                fill="url(#gradient-recipe-1)"
                            />
                            <path
                                d="M0,480 C300,440 400,520 600,480 C800,440 900,520 1200,480 L1200,800 L0,800 Z"
                                fill="url(#gradient-recipe-2)"
                            />
                            <defs>
                                <linearGradient id="gradient-recipe-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.3"/>
                                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.1"/>
                                </linearGradient>
                                <linearGradient id="gradient-recipe-2" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                <ChefHat className="h-5 w-5" />
                                <span className="text-sm font-medium font-poppins">Recipe Discovery</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-montserrat font-bold leading-tight text-gray-800 dark:text-gray-100 mb-4">
                                Discover Delicious <span className="text-sage-500 dark:text-sage-300">Recipes</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins leading-relaxed mb-8">
                                Find the perfect recipe for any occasion. Search by ingredients, dietary preferences, or meal type.
                            </p>

                         
                            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for recipes, ingredients, or cuisines..."
                                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 font-poppins"
                                        >
                                            <Filter size={20} />
                                            <span className="hidden sm:inline">Filters</span>
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!searchQuery.trim() || isLoading}
                                            className="px-6 py-4 bg-sage-600 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-poppins flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <Search size={20} />
                                            )}
                                            <span className="hidden sm:inline">Search</span>
                                        </button>
                                    </div>
                                </div>
                            </form>

                          
                            {showFilters && (
                                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-sage-200 dark:border-gray-700 max-w-2xl mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-montserrat">
                                            Filters
                                        </h3>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="diet-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                Diet Type
                                            </label>
                                            <select
                                                id="diet-type-select"
                                                value={filters.diet || ''}
                                                onChange={(e) => setFilters({...filters, diet: e.target.value || undefined})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                            >
                                                {dietOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="meal-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                Meal Type
                                            </label>
                                            <select
                                                id="meal-type-select"
                                                value={filters.type || ''}
                                                onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                            >
                                                {mealTypes.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                Max Cooking Time (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                value={filters.maxReadyTime || ''}
                                                onChange={(e) => setFilters({...filters, maxReadyTime: parseInt(e.target.value) || undefined})}
                                                placeholder="e.g., 30"
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-500 dark:focus:border-sage-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 font-poppins"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={applyFilters}
                                            className="flex-1 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-colors duration-200 font-poppins"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-poppins"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}

                           
                            {!hasSearched && (
                                <div className="mt-8">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-poppins">
                                        Popular searches:
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {popularSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(search)}
                                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-sage-50 dark:hover:bg-gray-700 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200 border border-sage-200 dark:border-gray-600 font-poppins"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            
                {hasSearched && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                          
                            {error && (
                                <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2 font-montserrat">
                                                Search Error
                                            </h3>
                                            <p className="text-red-700 dark:text-red-300 font-poppins">
                                                {error}
                                            </p>
                                        </div>
                                        <button
                                            onClick={retrySearch}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-poppins"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="animate-spin text-sage-600 mr-3" size={24} />
                                    <span className="text-gray-600 dark:text-gray-400 font-poppins">
                                        Searching for delicious recipes...
                                    </span>
                                </div>
                            ) : !error && recipes.length > 0 ? (
                                <>
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-montserrat">
                                            Found {recipes.length} recipes for &quot;{searchQuery}&quot;
                                        </h2>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        {recipes.map((recipe) => {
                                            const isExpanded = expandedRecipes.has(recipe.id);
                                            const instructions = parseInstructions(stripHtml(recipe.instructions || ''));
                                            
                                            return (
                                                <div
                                                    key={recipe.id}
                                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-sage-100 dark:border-gray-700"
                                                >
                                                   
                                                    <div className="flex flex-col lg:flex-row">
                                                     
                                                        <div className="lg:w-1/3 relative">
                                                            <img
                                                                src={recipe.image || 'https://via.placeholder.com/400x300?text=Recipe+Image'}
                                                                alt={recipe.title}
                                                                className="w-full h-64 lg:h-full object-cover"
                                                                onError={handleImageError}
                                                            />
                                                            <button
                                                                onClick={() => toggleFavorite(recipe.id)}
                                                                className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
                                                                    favoriteRecipes.has(recipe.id)
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-white/80 text-gray-600 hover:bg-white'
                                                                }`}
                                                            >
                                                                <Heart size={16} fill={favoriteRecipes.has(recipe.id) ? 'currentColor' : 'none'} />
                                                            </button>
                                                        </div>
                                                        
                                                        
                                                        <div className="lg:w-2/3 p-6">
                                                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 font-montserrat">
                                                                {recipe.title}
                                                            </h3>
                                                            
                                                            <div className="flex flex-wrap items-center gap-6 mb-4">
                                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                    <Clock size={18} />
                                                                    <span className="font-poppins">{recipe.readyInMinutes} min</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                    <Users size={18} />
                                                                    <span className="font-poppins">{recipe.servings} servings</span>
                                                                </div>
                                                                {recipe.healthScore && (
                                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                        <Star size={18} />
                                                                        <span className="font-poppins">Health Score: {recipe.healthScore}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                       
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {recipe.vegetarian && (
                                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm rounded-full font-poppins">
                                                                        Vegetarian
                                                                    </span>
                                                                )}
                                                                {recipe.vegan && (
                                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm rounded-full font-poppins">
                                                                        Vegan
                                                                    </span>
                                                                )}
                                                                {recipe.glutenFree && (
                                                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full font-poppins">
                                                                        Gluten Free
                                                                    </span>
                                                                )}
                                                                {recipe.dairyFree && (
                                                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full font-poppins">
                                                                        Dairy Free
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                
                                                            <p className="text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-4">
                                                                {stripHtml(recipe.summary)}
                                                            </p>
                                                            
                                                    
                                                            <button
                                                                onClick={() => toggleRecipeExpansion(recipe.id)}
                                                                className="flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200 font-poppins"
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        <ChevronUp size={20} />
                                                                        Hide Details
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ChevronDown size={20} />
                                                                        Show Ingredients & Instructions
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                            
                                                    {isExpanded && (
                                                        <div className="border-t border-sage-100 dark:border-gray-700 p-6">
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                                {/* Ingredients */}
                                                                {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
                                                                    <div className="lg:col-span-1">
                                                                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 font-montserrat flex items-center gap-2">
                                                                            <ChefHat size={20} />
                                                                            Ingredients
                                                                        </h4>
                                                                        <ul className="space-y-2">
                                                                            {recipe.extendedIngredients.map((ingredient, ingredientIndex) => (
                                                                                <li key={`${recipe.id}-ingredient-${ingredientIndex}`} className="flex items-start gap-3">
                                                                                    <div className="w-2 h-2 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
                                                                                    <span className="text-gray-700 dark:text-gray-300 font-poppins text-sm">
                                                                                        {ingredient.original || `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                
                                                            
                                                                <div className={`${recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                                                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                                                                        Instructions
                                                                    </h4>
                                                                    {instructions.length > 0 ? (
                                                                        <div className="space-y-3">
                                                                            {instructions.map((step, index) => (
                                                                                <div key={`${recipe.id}-step-${index}`} className="flex gap-4">
                                                                                    <div className="flex-shrink-0 w-6 h-6 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 rounded-full flex items-center justify-center text-sm font-semibold">
                                                                                        {index + 1}
                                                                                    </div>
                                                                                    <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm leading-relaxed">
                                                                                        {step}
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-gray-500 dark:text-gray-400 font-poppins italic">
                                                                            Instructions not available for this recipe.
                                                                        </p>
                                                                    )}
                                                                    
                                                        
                                                                    {recipe.sourceUrl && (
                                                                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                                            <a
                                                                                href={recipe.sourceUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 font-poppins text-sm"
                                                                            >
                                                                                <ExternalLink size={16} />
                                                                                View Original Recipe
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : !error && hasSearched ? (
                                <div className="text-center py-12">
                                    <ChefHat className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                        No recipes found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-poppins">
                                        Try adjusting your search terms or filters to find more recipes.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default RecipesPage;