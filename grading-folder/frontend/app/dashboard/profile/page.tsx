'use client';

import React, { useState, useEffect } from 'react';
import { 
    User,
    Mail,
    Camera,
    LogOut,
    ArrowLeft,
    Save,
    X,
    Edit3,
    Check
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/header';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserData {
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
}

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        profilePicture: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<UserData>({
        name: '',
        email: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
     
        const initializeUserData = () => {
            try {
                const savedUser = localStorage.getItem('user');
                const accessToken = localStorage.getItem('access_token'); 
                
                if (savedUser && savedUser !== 'null') {
                    const user = JSON.parse(savedUser);
                    const userInfo: UserData = {
                        name: user.fullname || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
                        email: user.email || '',
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        profilePicture: user.profilePicture || ''
                    };
                    
                    setUserData(userInfo);
                    setEditedData(userInfo);
                } else if (accessToken) {
                  
                    const defaultUser: UserData = { name: 'New User', email: 'user@example.com', profilePicture: '' };
                    setUserData(defaultUser);
                    setEditedData(defaultUser);
                } else {
                 
                    router.replace('/login');
                    return;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
          
                router.replace('/login');
                return;
            }
            
            setLoading(false);
        };
        
        initializeUserData();
    }, [router]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData({ ...userData });
        setSaveMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({ ...userData });
        setSaveMessage('');
    };

    const handleSave = () => {
      
        if (!editedData.name.trim() || !editedData.email.trim()) {
            setSaveMessage('Please fill in all required fields');
            return;
        }

     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedData.email)) {
            setSaveMessage('Please enter a valid email address');
            return;
        }

        try {
           
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                name: editedData.name,
                fullname: editedData.name, 
                email: editedData.email,
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                profilePicture: editedData.profilePicture
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(editedData);
            setIsEditing(false);
            setSaveMessage('Profile updated successfully!');
        
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage('Failed to save profile. Please try again.');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

       

        setUploadingImage(true);
        setSaveMessage('');

       
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            
            const newPictureData = { profilePicture: base64String };

            if (isEditing) {
                setEditedData(prev => ({ ...prev, ...newPictureData }));
            } else {
            
                setUserData(prev => ({ ...prev, ...newPictureData }));
                
                
                try {
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const updatedUser = { ...currentUser, ...newPictureData };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setSaveMessage('Profile picture updated successfully!');
                    setTimeout(() => setSaveMessage(''), 3000);
                } catch (error) {
                    console.error('Error saving profile picture:', error);
                    setSaveMessage('Failed to save profile picture');
                }
            }
            setUploadingImage(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSignOut = () => {
        try {
         
            localStorage.removeItem('user');
            localStorage.removeItem('access_token'); 
            localStorage.removeItem('refresh_token'); 
            localStorage.removeItem('authToken'); 
            localStorage.removeItem('userProfile');
            
            router.push('/login'); 
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    const confirmSignOut = () => {
        setShowSignOutConfirm(true);
    };

    const cancelSignOut = () => {
        setShowSignOutConfirm(false);
    };

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

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
            <Header />
            
            <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto bg-sage-25 dark:bg-gray-900 p-4 lg:p-6 relative">
                
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

                    <div className="max-w-4xl mx-auto relative z-10">
                    
                        <div className="mb-6">
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-4 font-poppins"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </Link>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 font-montserrat">
                                        Account Settings
                                    </h1>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2 font-poppins">
                                        Manage your account information and preferences
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {!isEditing && (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center justify-center px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-poppins"
                                            title="Edit profile"
                                            aria-label="Edit profile"
                                        >
                                            <Edit3 size={16} className="mr-2" />
                                            Edit Profile
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={confirmSignOut}
                                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-poppins"
                                        title="Sign out"
                                        aria-label="Sign out"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>

                    
                        {saveMessage && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                saveMessage.includes('successfully') 
                                    ? 'bg-green-100 border border-green-400 text-green-700'
                                    : 'bg-red-100 border border-red-400 text-red-700'
                            } font-poppins`}>
                                {saveMessage}
                            </div>
                        )}

            
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                                <div className="lg:col-span-1">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-montserrat">
                                        Profile Picture
                                    </h3>
                                    
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            {(isEditing ? editedData.profilePicture : userData.profilePicture) ? (
                                                <Image
                                                    src={(isEditing ? editedData.profilePicture : userData.profilePicture) || '/default-avatar.png'}
                                                    alt="Profile"
                                                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-sage-200 dark:border-sage-600"
                                                    width={160}
                                                    height={160}
                                                />
                                            ) : (
                                                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-sage-200 dark:bg-sage-700 flex items-center justify-center border-4 border-sage-300 dark:border-sage-600">
                                                    <User size={48} className="text-sage-600 dark:text-sage-400" />
                                                </div>
                                            )}
                                            
                                            <label
                                                htmlFor="profile-upload"
                                                className="absolute bottom-0 right-0 bg-sage-600 hover:bg-sage-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200 shadow-lg"
                                                title="Upload profile picture"
                                            >
                                                {uploadingImage ? (
                                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                ) : (
                                                    <Camera size={20} />
                                                )}
                                            </label>
                                            
                                            <input
                                                id="profile-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploadingImage}
                                            />
                                        </div>
                                        
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-poppins">
                                                Click the camera icon to upload
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 font-poppins mt-1">
                                                Max size: 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-montserrat">
                                        Personal Information
                                    </h3>
                                    
                                
                                    <div className="flex items-start space-x-3">
                                        <User className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                Full Name *
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                    placeholder="Enter your full name"
                                                    title="Enter your full name"
                                                />
                                            ) : (
                                                <p className="text-gray-800 dark:text-gray-200 font-poppins text-lg">
                                                    {userData.name || 'Not set'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    
                                    <div className="flex items-start space-x-3">
                                        <Mail className="text-sage-600 mt-1 flex-shrink-0" size={20} />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                                                Email Address *
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={editedData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sage-400 focus:outline-none bg-sage-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-poppins"
                                                    placeholder="Enter your email address"
                                                    title="Enter your email address"
                                                />
                                            ) : (
                                                <p className="text-gray-800 dark:text-gray-200 font-poppins text-lg">
                                                    {userData.email || 'Not set'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                  
                                    <div className="bg-sage-100 dark:bg-sage-800 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat flex items-center">
                                            <Check className="text-green-600 mr-2" size={20} />
                                            Account Status
                                        </h4>
                                        <p className="text-sage-700 dark:text-sage-300 font-poppins">
                                            Your account is active and verified
                                        </p>
                                    </div>
                                </div>
                            </div>

                         
                            {isEditing && (
                                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center justify-center px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 font-poppins"
                                        title="Cancel editing"
                                        aria-label="Cancel editing"
                                    >
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center justify-center px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-poppins shadow-lg hover:shadow-xl"
                                        title="Save changes"
                                        aria-label="Save changes"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

          
            {showSignOutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 font-montserrat">
                            Confirm Sign Out
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 font-poppins">
                            Are you sure you want to sign out? You&apos;ll be redirected to the login page.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={cancelSignOut}
                                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 font-poppins"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-poppins"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;