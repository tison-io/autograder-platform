'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function PasswordReset() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'token' | 'password'>('email');
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const response = await fetch('https://snackandtrack.onrender.com/auth/password-reset/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Reset token: ${data.resetToken} (Valid for ${data.expiresIn})`);
                
                setFormData(prev => ({ ...prev, token: data.resetToken }));
                setStep('token');
            } else {
                setMessage(data.message || 'Failed to send reset token. Please try again.');
            }
        } catch (error) {
            setMessage('Network error. Please check if the backend server is running.');
            console.error('Password reset request error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTokenSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (formData.token.length < 6) {
                throw new Error('Invalid token');
            }
            setMessage('Token verified! Enter your new password.');
            setStep('password');
        } catch {
            setMessage('Invalid token. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://snackandtrack.onrender.com/auth/password-reset/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resetToken: formData.token,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setMessage(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            setMessage('Network error. Please check if the backend server is running.');
            console.error('Password reset error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
        
            <div className="hidden md:flex lg:w-1/2 bg-gradient-to-br from-sage-100 to-sage-300 items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="text-center max-w-sm lg:max-w-md">
                    <div className="mb-6 lg:mb-8">
                        <Image
                            src="/Images/login.jpg"
                            alt="SnackAndTrack"
                            width={250}
                            height={250}
                            className="mx-auto w-48 h-48 rounded-full sm:w-60 sm:h-60 lg:w-72 lg:h-72"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-4 font-montserrat">
                        <span className="text-sage-500">Snack</span>
                        <span className="text-sage-900">And</span>
                        <span className="text-sage-500">Track</span>
                    </h1>
                    <p className="text-sage-900 text-sm sm:text-base font-poppins">
                        Reset your password to continue your health journey
                    </p>
                </div>
            </div>

           
            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white min-h-screen lg:min-h-auto">
                <div className="w-full max-w-sm sm:max-w-md">
             
                    <div className="md:hidden text-center mb-6">
                        <h1 className="text-2xl font-bold mb-4 font-montserrat">
                            <span className="text-sage-700">Snack</span>
                            <span className="text-gray-800">And</span>
                            <span className="text-sage-400">Track</span>
                        </h1>
                    </div>

               
                    <div className="text-center mb-6 lg:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-montserrat">
                            Reset Your Password
                        </h2>
                        <p className="text-sm sm:text-base text-gray-700 px-2 font-poppins">
                            {step === 'email' && 'Enter your email to receive a reset token'}
                            {step === 'token' && 'Enter the reset token sent to your email'}
                            {step === 'password' && 'Create a new secure password'}
                        </p>
                    </div>

              
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-poppins ${
                            message.includes('Failed') || 
                            message.includes('Invalid') || 
                            message.includes('do not match') || 
                            message.includes('must be') || 
                            message.includes('Network error')
                                ? 'bg-red-100 border border-red-400 text-red-700'
                                : 'bg-green-100 border border-green-400 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}

             
                    {step === 'email' && (
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleEmailSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 text-sm sm:text-base font-poppins shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Sending...' : 'Send Reset Token'}
                            </button>
                        </form>
                    )}

                 
                    {step === 'token' && (
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleTokenSubmit}>
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                                    Reset Token
                                </label>
                                <input
                                    id="token"
                                    name="token"
                                    type="text"
                                    required
                                    value={formData.token}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter the reset token"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 text-sm sm:text-base font-poppins shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Verifying...' : 'Verify Token'}
                            </button>
                        </form>
                    )}

                   
                    {step === 'password' && (
                        <form className="space-y-4 sm:space-y-6" onSubmit={handlePasswordSubmit}>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 text-sm sm:text-base font-poppins shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

              
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-700 bg-white font-poppins">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

               
                    <div className="flex justify-center space-x-4 mb-6">
                        <button 
                            className="w-10 h-10 bg-sage-100 hover:bg-sage-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label="Login with Twitter"
                        >
                            <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
                            </svg>
                        </button>
                        
                        <button 
                            className="w-10 h-10 bg-sage-100 hover:bg-sage-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label="Login with Facebook"
                        >
                            <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </button>
                        
                        <button 
                            className="w-10 h-10 bg-sage-100 hover:bg-sage-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label="Login with Apple"
                        >
                            <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </button>
                    </div>

                
                    <div className="text-center">
                        <Link 
                            href="/login"
                            className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200 underline decoration-sage-400 hover:decoration-sage-600 font-poppins"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}