'use client';

import React from 'react';
import { Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const importantLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
   
    { name: 'Contact Us', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-br from-sage-50 to-beige-50 dark:from-gray-900 dark:to-gray-800 border-t border-sage-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
          
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <h2 className="text-2xl lg:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <span className="text-sage-500 dark:text-sage-300">Snack</span>
                  <span className="text-sage-900 dark:text-sage-100">And</span>
                  <span className="text-sage-500 dark:text-sage-400">Track</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-poppins leading-relaxed">
                  Your journey to better health starts with every snack you track.
                </p>
              </div>
            </div>

        
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-poppins mb-4">
                Important Links
              </h3>
              <ul className="space-y-3">
                {importantLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-sage-700 dark:hover:text-sage-300 text-sm font-poppins transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-poppins mb-4">
                Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-poppins mb-4">
                Subscribe for health tips and updates.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border border-sage-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400"
                />
                <button className="w-full px-4 py-2 bg-sage-500 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white text-sm font-medium font-poppins rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400">
                  Subscribe
                </button>
              </div>
            </div>

          
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-poppins mb-4">
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="text-gray-600 dark:text-gray-400 text-sm font-poppins">
                  <p> Oginga Street,Nairobi</p>
                  
                </div>
                <div className="space-y-2">
                  <a
                    href="mailto:hello@snackandtrack.com"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200"
                  >
                    <Mail className="h-4 w-4 mr-2 text-sage-600 dark:text-sage-400" />
                    <span className="text-sm font-poppins">snackandtrack@gmail.com</span>
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-poppins">
                    +254741769326
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

       
        <hr className="border-sage-200 dark:border-gray-700" />

       
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
            <div className="text-gray-600 dark:text-gray-400 text-sm font-poppins order-2 md:order-1">
              © {currentYear} SnackAndTrack. All rights reserved.
            </div>
            
           
            <div className="flex items-center space-x-4 order-1 md:order-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-sage-100 dark:bg-gray-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-gray-700 hover:text-sage-700 dark:hover:text-sage-300 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;