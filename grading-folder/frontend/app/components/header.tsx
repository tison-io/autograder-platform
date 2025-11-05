'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, UserPlus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavClick = (href: string) => {
    if (isDashboard) {
      // If on dashboard, navigate to home page with the section
      if (href.startsWith('#')) {
        router.push(`/${href}`);
      } else {
        router.push(href);
      }
    } else {
      // If on landing page, use smooth scroll
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(href);
      }
    }
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    // Navigate to signup page or handle signup logic
    router.push('/signup');
    setIsMenuOpen(false);
  };

  // Different navigation items based on context
  const navItems = isDashboard ? [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/dashboard/profile' },
  ] : [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sage-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-8 lg:gap-16">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavClick('/')}
                  className="text-2xl md:text-3xl font-montserrat font-bold text-gray-800 hover:opacity-80 transition-opacity"
                >
                  <span className="text-sage-500">Snack</span>
                  <span className="text-sage-900">And</span>
                  <span className="text-sage-500">Track</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 lg:space-x-6">
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className="text-gray-700 hover:text-sage-700 px-3 py-2 text-sm font-medium font-poppins transition-colors duration-200 relative group"
                    >
                      {item.name}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sage-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                    </button>
                  ))}
                </nav>

                {/* Signup Button - Desktop */}
                {!isDashboard && (
                  <button
                    onClick={handleSignup}
                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold transition-colors duration-200 font-poppins shadow-md hover:shadow-lg"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </button>
                )}

                {/* Theme Toggle Placeholder */}
                <div className="p-2 rounded-lg bg-sage-100 text-sage-700 w-10 h-10 flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen 
                ? 'max-h-80 opacity-100 visible' 
                : 'max-h-0 opacity-0 invisible overflow-hidden'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-sage-200">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-3 py-2 text-base font-medium font-poppins text-gray-700 hover:text-sage-700 hover:bg-sage-50 rounded-md transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                ))}
                {/* Signup Button - Mobile */}
                {!isDashboard && (
                  <button
                    onClick={handleSignup}
                    className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium font-poppins text-white bg-sage-600 hover:bg-sage-700 rounded-md transition-colors duration-200 mt-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-sage-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8 lg:gap-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick('/')}
                className="text-2xl md:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity"
              >
                <span className="text-sage-500 dark:text-sage-300">Snack</span>
                <span className="text-sage-900 dark:text-sage-100">And</span>
                <span className="text-sage-500 dark:text-sage-400">Track</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-gray-700 dark:text-gray-300 hover:text-sage-700 dark:hover:text-sage-300 px-3 py-2 text-sm font-medium font-poppins transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sage-600 dark:bg-sage-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </button>
                ))}
              </nav>

              {/* Signup Button - Desktop */}
              {!isDashboard && (
                <button
                  onClick={handleSignup}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-sage-600 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white rounded-lg font-semibold transition-colors duration-200 font-poppins shadow-md hover:shadow-lg"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-sage-100 dark:bg-gray-800 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg bg-sage-100 dark:bg-gray-800 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-80 opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible overflow-hidden'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-sage-200 dark:border-gray-700">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium font-poppins text-gray-700 dark:text-gray-300 hover:text-sage-700 dark:hover:text-sage-300 hover:bg-sage-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              {/* Signup Button - Mobile */}
              {!isDashboard && (
                <button
                  onClick={handleSignup}
                  className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium font-poppins text-white bg-sage-600 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 rounded-md transition-colors duration-200 mt-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;