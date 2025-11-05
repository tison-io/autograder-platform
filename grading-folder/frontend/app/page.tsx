"use client";
import Header from "./components/header";
import Footer from "./components/footer";
import { useState } from "react";
import { Calculator, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <main className="flex-1">
     
        <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-8 lg:gap-12 relative">
       
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <svg 
                className="absolute w-full h-full"
                viewBox="0 0 1440 1000" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M0,-100 
                    C320,0 420,100 720,100 
                    C1020,100 1120,0 1440,100 
                    V600
                    C1120,700 1020,600 720,600
                    C420,600 320,700 0,600 
                    V-100 Z"
                  fill="#a3b5a3"
                  fillOpacity="0.1"
                  className="animate-wave"
                />
                <path 
                  d="M0,0
                    C320,100 420,200 720,200
                    C1020,200 1120,100 1440,200
                    V800
                    C1120,900 1020,800 720,800
                    C420,800 320,900 0,800
                    V0 Z"
                  fill="#7d937d"
                  fillOpacity="0.08"
                  className="animate-wave-slow"
                />
              </svg>
            </div>

          
            <div className="flex-1 text-center lg:text-left space-y-6 z-10">
              <h1 className="text-3xl sm:text-5xl lg:text-3xl xl:text-4xl font-montserrat font-bold leading-tight">
                <span className="text-sage-500 dark:text-sage-300">SnackAndTrack</span>
               
              </h1>
              <p className="text-sm sm:text-xl lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 font-poppins leading-relaxed">
                Track your nutrition and snacking habits with ease. Make healthier choices every day.
              </p>
            </div>

           
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/Images/hero.png"
                  alt="Snack & Track Hero"
                  width={384}
                  height={384}
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-700"
                />
          
                <div className="absolute inset-0 rounded-full bg-sage-100 dark:bg-sage-800 opacity-20 blur-xl scale-110 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

      
        <AboutSection />
        <ServicesSection />
        
      </main>
      <Footer />
    </div>
  );
}


function AboutSection() {
  const [activeTab, setActiveTab] = useState<'mission' | 'technology' | 'impact'>('mission');

  const tabs = [
    { id: 'mission' as const, label: 'Mission' },
    { id: 'technology' as const, label: 'Technology' },
    { id: 'impact' as const, label: 'Impact' }
  ];

  const tabContent = {
    mission: {
      title: "Our Mission",
      description: "Empowering healthier lifestyles through mindful eating and comprehensive nutrition tracking.",
      content: [
        "To make healthy eating accessible and enjoyable for everyone",
        "Provide tools that promote mindful consumption and nutritional awareness",
        "Create a supportive community focused on wellness and personal growth",
        "Bridge the gap between nutrition knowledge and daily eating habits"
      ]
    },
    technology: {
      title: "Our Technology",
      description: "Cutting-edge tools powered by advanced APIs to enhance your nutrition journey.",
      content: [
        {
          name: "Calorie Counter ",
          description: "Advanced calorie tracking system that provides accurate nutritional information for thousands of foods and recipes"
        },
        {
          name: "AI Chatbot",
          description: "Intelligent assistant ready to answer your nutrition questions, provide meal suggestions, and offer personalized guidance"
        },
        {
          name: "Recipe Search ",
          description: "Comprehensive database of healthy recipes with detailed nutritional breakdowns and dietary filters"
        }
      ]
    },
    impact: {
      title: "Our Impact",
      description: "Making a difference in people's lives through better nutrition awareness and healthier choices.",
      content: [
        "Planning to have users tracking their daily nutrition",
        "Food items logged and analyzed",
      
        "Community-driven approach to wellness and health"
      ]
    }
  };

  return (
    <section id="about" className="py-16 lg:py-24 relative overflow-hidden">
    
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg 
          className="absolute w-full h-full"
          viewBox="0 0 1440 1000" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,-100 
              C320,0 420,100 720,100 
              C1020,100 1120,0 1440,100 
              V600
              C1120,700 1020,600 720,600
              C420,600 320,700 0,600 
              V-100 Z"
            fill="#a3b5a3"
            fillOpacity="0.05"
            className="animate-wave"
          />
          <path 
            d="M0,0
              C320,100 420,200 720,200
              C1020,200 1120,100 1440,200
              V800
              C1120,900 1020,800 720,800
              C420,800 320,900 0,800
              V0 Z"
            fill="#7d937d"
            fillOpacity="0.04"
            className="animate-wave-slow"
          />
        </svg>
      </div>

      <div className="max-w-7xl mt-1 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
     
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-2">
            About <span className="text-sage-500 dark:text-sage-400">SnackAndTrack</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins">
            Discover our mission, explore our technology, and learn about the impact we&apos;re making in the world of nutrition and wellness.
          </p>
        </div>

        
        <div className="flex flex-col sm:flex-row justify-center mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row bg-sage-100 dark:bg-gray-800 rounded-lg p-1 max-w-md mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md text-sm font-medium font-poppins transition-all duration-200 flex-1 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-sage-700 dark:text-sage-300 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-sage-600 dark:hover:text-sage-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 border border-sage-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm lg:text-xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
              {tabContent[activeTab].title}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-poppins">
              {tabContent[activeTab].description}
            </p>

           
            {activeTab === 'mission' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tabContent.mission.content.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-sage-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-poppins">{item}</p>
                  </div>
                ))}
              </div>
            )}

           
            {activeTab === 'technology' && (
              <div className="space-y-8">
                {tabContent.technology.content.map((tech, index) => (
                  <div key={index} className="border-l-4 border-sage-500 pl-6">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 font-poppins">
                      {tech.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 font-poppins">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

         
            {activeTab === 'impact' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {tabContent.impact.content.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-sage-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-300 font-poppins text-lg">
                      {stat}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>
    );
  }
  
  function ServicesSection() {
  const services = [
    {
      icon: Calculator,
      title: "Calorie Counter",
      description: "Track calories and nutritional information for thousands of foods with our advanced API integration.",
      features: [
        "Real-time calorie tracking",
        "Food database with many items",
       
      ],
      color: "from-sage-400 to-sage-600"
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "Get instant answers to your nutrition questions and personalized meal recommendations 24/7.",
      features: [
        "24/7 availability",
        "Nutrition Q&A assistance",
      
      
      ],
      color: "from-sage-400 to-sage-500"
    },
    {
      icon: BookOpen,
      title: "Recipe Search",
      description: "Discover healthy recipes tailored to your dietary preferences and nutritional goals.",
      features: [
        "Healthy recipes",
        "Step-by-step instructions"
      ],
      color: "from-sage-400 to-sage-500"
    }
  ];
   return (
    <section id="services" className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-br from-sage-25 to-beige-25 dark:from-gray-800 dark:to-gray-900">
     
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg 
          className="absolute w-full h-full"
          viewBox="0 0 1440 1000" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,-100 
              C320,0 420,100 720,100 
              C1020,100 1120,0 1440,100 
              V600
              C1120,700 1020,600 720,600
              C420,600 320,700 0,600 
              V-100 Z"
            fill="#a3b5a3"
            fillOpacity="0.06"
            className="animate-wave"
          />
          <path 
            d="M0,0
              C320,100 420,200 720,200
              C1020,200 1120,100 1440,200
              V800
              C1120,900 1020,800 720,800
              C420,800 320,900 0,800
              V0 Z"
            fill="#7d937d"
            fillOpacity="0.04"
            className="animate-wave-slow"
          />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
     
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-1xl sm:text-3xl lg:text-3xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
            Our <span className="text-sage-500 dark:text-sage-400">Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins">
            Comprehensive tools designed to support your nutrition journey and help you achieve your health goals.
          </p>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-full shadow-xl p-6 lg:p-8 border border-sage-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group flex flex-col items-center text-center min-h-[400px] justify-center"
            >
             
              <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <service.icon className="h-6 w-6 text-white" />
              </div>

             
              <h3 className="text-lg lg:text-xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-3">
          {service.title}
              </h3>
          
              <p className="text-sm text-gray-600 dark:text-gray-300 font-poppins mb-4 leading-relaxed max-w-xs">
          {service.description}
              </p>

            
              <ul className="space-y-1">
          {service.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start space-x-2 justify-center">
              <div className="w-1 h-1 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-poppins max-w-xs">
                {feature}
              </span>
            </li>
          ))}
              </ul>

             
            </div>
          ))}
        </div>

        
        <div className="text-center mt-12 lg:mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 border border-sage-200 dark:border-gray-700">
            <h3 className="text-2xl lg:text-2xl font-montserrat font-bold text-gray-800 dark:text-gray-100 mb-4">
              Ready to Start Your Health Journey?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-poppins max-w-2xl mx-auto">
              Join thousands of users who are already tracking their nutrition and achieving their health goals with SnackAndTrack.
                 </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="px-8 py-3 bg-sage-500 hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600 text-white font-medium font-poppins rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-center">
                Get Started by creating an account
              </Link>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
