'use client';

import React, { useState, useEffect } from 'react';
import { 
    User,
    Edit3,
    Save,
    X,
    ArrowLeft,
    Target,
    Calendar,
    Ruler,
    Weight
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/header';

interface UserProfile {
    goal: string;
    age: string;
    height: string;
    weight: string;
    weightUnit: 'kg' | 'lbs';
}

const MePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        goal: '',
        age: '',
        height: '',
        weight: '',
        weightUnit: 'kg'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserProfile>({
        goal: '',
        age: '',
        height: '',
        weight: '',
        weightUnit: 'kg'
    });
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');

    const goalOptions = [
        'Lose Weight',
        'Gain Weight',
        'Maintain Weight',
        'Build Muscle',
        'Improve Fitness',
        'Eat Healthier'
    ];

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            const savedUser = localStorage.getItem('user');
            
            if (savedProfile && savedProfile !== 'null') {
                const profile = JSON.parse(savedProfile);
                if (profile && (profile.goal || profile.age || profile.height || profile.weight)) {
                    setUserProfile(profile);
                    setEditedProfile(profile);
                }
            }
            
            if (savedUser && savedUser !== 'null') {
                const user = JSON.parse(savedUser);
                setUserName(user.name || user.firstName || 'User');
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
        
        setLoading(false);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile({ ...userProfile });
        setSaveMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile({ ...userProfile });
        setSaveMessage('');
    };

    const handleSave = () => {
        if (!editedProfile.goal || !editedProfile.age || !editedProfile.height || !editedProfile.weight) {
            setSaveMessage('Please fill in all fields');
            return;
        }

        try {
            localStorage.setItem('userProfile', JSON.stringify(editedProfile));
            setUserProfile(editedProfile);
            setIsEditing(false);
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage('Failed to save profile. Please try again.');
        }
    };

    const handleInputChange = (key: keyof UserProfile, value: string) => {
        setEditedProfile(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const calculateBMI = () => {
        if (userProfile.height && userProfile.weight) {
            const height = parseFloat(userProfile.height);
            let weight = parseFloat(userProfile.weight);
            if (userProfile.weightUnit === 'lbs') {
                weight = weight * 0.453592;
            }
            const bmi = weight / (height * height);
            return bmi.toFixed(1);
        }
        return null;
    };

    const getBMICategory = (bmi: string) => {
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
        if (bmiValue < 25) return { category: 'Normal weight', color: 'text-green-600' };
        if (bmiValue < 30) return { category: 'Overweight', color: 'text-yellow-600' };
        return { category: 'Obese', color: 'text-red-600' };
    };

    const hasProfileData = userProfile.goal || userProfile.age || userProfile.height || userProfile.weight;

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-800 dark:text-gray-200 font-poppins">Loading...</div>
                </div>
            </div>
        );
    }

    const bmi = calculateBMI();
    const bmiInfo = bmi ? getBMICategory(bmi) : null;

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
            
            <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto bg-transparent p-4 lg:p-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-6">
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-4 font-poppins"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </Link>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 font-montserrat">
                                        My Nutrition Profile
                                    </h1>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2 font-poppins">
                                        Manage your personal information and health goals
                                    </p>
                                </div>
                                
                                {!isEditing && hasProfileData && (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-poppins"
                                        title="Edit profile"
                                        aria-label="Edit profile"
                                    >
                                        <Edit3 size={16} className="mr-2" />
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Success Message */}
                        {saveMessage && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                saveMessage.includes('successfully') 
                                    ? 'bg-green-100 border border-green-400 text-green-700'
                                    : 'bg-red-100 border border-red-400 text-red-700'
                            } font-poppins`}>
                                {saveMessage}
                            </div>
                        )}

                        {/* Profile Content */}
                        {!hasProfileData && !isEditing ? (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
                                <User size={64} className="mx-auto mb-4 text-sage-400" />
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                                    No Profile Data Found
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 font-poppins">
                                    It looks like you haven&apos;t completed your profile yet. 
                                    Please go back to the dashboard and complete the questionnaire.
                                </p>
                                <div className="space-y-4">
                                    <Link 
                                        href="/dashboard"
                                        className="inline-block px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-poppins"
                                    >
                                        Complete Profile
                                    </Link>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="block w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 font-poppins"
                                    >
                                        Or Create Profile Here
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Profile Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                                            Personal Information
                                        </h3>
                                        
                                        {/* Goal */}
                                        <div className="flex items-start space-x-3">
                                            <Target className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                    Health Goal
                                                </label>
                                                {isEditing ? (
                                                    <select
                                                        value={editedProfile.goal}
                                                        onChange={(e) => handleInputChange('goal', e.target.value)}
                                                        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                        title="Select your health goal"
                                                    >
                                                        <option value="">Select a goal</option>
                                                        {goalOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p className="text-gray-800 dark:text-gray-200 font-poppins">
                                                        {userProfile.goal || 'Not set'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div className="flex items-start space-x-3">
                                            <Calendar className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                    Age
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editedProfile.age}
                                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                                        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                        placeholder="Enter your age"
                                                        title="Enter your age"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 dark:text-gray-200 font-poppins">
                                                        {userProfile.age ? `${userProfile.age} years old` : 'Not set'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Height */}
                                        <div className="flex items-start space-x-3">
                                            <Ruler className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                    Height
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editedProfile.height}
                                                        onChange={(e) => handleInputChange('height', e.target.value)}
                                                        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                        placeholder="Height in meters (e.g., 1.75)"
                                                        title="Enter your height in meters"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 dark:text-gray-200 font-poppins">
                                                        {userProfile.height ? `${userProfile.height} meters` : 'Not set'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Weight */}
                                        <div className="flex items-start space-x-3">
                                            <Weight className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                    Weight
                                                </label>
                                                {isEditing ? (
                                                    <div className="flex gap-3">
                                                        <input
                                                            type="number"
                                                            value={editedProfile.weight}
                                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                                            className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                            placeholder="Enter your weight"
                                                            title="Enter your weight"
                                                        />
                                                        <select
                                                            value={editedProfile.weightUnit}
                                                            onChange={(e) => handleInputChange('weightUnit', e.target.value as 'kg' | 'lbs')}
                                                            className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                            title="Select weight unit"
                                                        >
                                                            <option value="kg">kg</option>
                                                            <option value="lbs">lbs</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-800 dark:text-gray-200 font-poppins">
                                                        {userProfile.weight ? `${userProfile.weight} ${userProfile.weightUnit}` : 'Not set'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Health Stats */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                                            Health Statistics
                                        </h3>
                                        
                                        {bmi && (
                                            <div className="bg-sage-100 dark:bg-sage-800 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                                    Body Mass Index (BMI)
                                                </h4>
                                                <div className="text-2xl font-bold text-sage-700 dark:text-sage-300 mb-1">
                                                    {bmi}
                                                </div>
                                                {bmiInfo && (
                                                    <div className={`text-sm font-medium ${bmiInfo.color} font-poppins`}>
                                                        {bmiInfo.category}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="bg-sage-100 dark:bg-sage-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">
                                                Profile Completion
                                            </h4>
                                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mb-2">
                                                <div 
                                                    className={`bg-sage-600 h-2 rounded-full transition-all duration-300 ${hasProfileData ? 'w-full' : 'w-0'}`}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-sage-700 dark:text-sage-300 font-poppins">
                                                Profile {hasProfileData ? '100%' : '0%'} complete
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex items-center px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 font-poppins"
                                            title="Cancel editing"
                                            aria-label="Cancel editing"
                                        >
                                            <X size={16} className="mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className="flex items-center px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-poppins shadow-lg hover:shadow-xl"
                                            title="Save changes"
                                            aria-label="Save changes"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MePage;