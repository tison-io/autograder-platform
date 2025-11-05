'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://snackandtrack.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully!');
                setFormData({
                    fullname: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                router.push('/login');
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
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
                        Track your nutrition and snacking habits with ease. Make healthier choices every day.
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
                            Start Your Health Journey
                        </h2>
                        <p className="text-sm sm:text-base text-gray-700 px-2 font-poppins">
                            Track your meals, stay hydrated, and reach your goals with SnackAndTrack.
                        </p>
                    </div>

            
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

            
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                                disabled={isLoading}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                                disabled={isLoading}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                disabled={isLoading}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                                disabled={isLoading}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-all duration-200 text-sm sm:text-base bg-sage-50 hover:bg-sage-100 text-gray-800 placeholder-gray-500 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 text-sm sm:text-base font-poppins shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                  
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-700 bg-white font-poppins">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                  
                    <div className="text-center mt-6 sm:mt-8">
                        <p className="text-sm sm:text-base text-gray-700 font-poppins">
                            Already have an account?{' '}
                            <Link 
                                href="/login" 
                                className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200 underline decoration-sage-400 hover:decoration-sage-600"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}