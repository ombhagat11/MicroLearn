<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { 
  Search, 
  Cloud, 
  BarChart3, 
  Monitor, 
  Smartphone, 
  Lightbulb, 
  ArrowRight, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Briefcase, 
  Building2, 
  Rocket 
} from "lucide-react";
import Navbar from "../components/navbar";

export default function Home() {
  

  return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      {/* Main Container Card */}
      <div className="bg-white w-full max-w-[1300px] min-h-[85vh] rounded-[40px]  overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT SECTION (Main Content) */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
          
          {/* Header / Nav */}
          <Navbar />

          {/* Hero Content */}
          <div className="mb-10 mt-10">
            <p className="text-gray-500 font-medium mb-2">AI-Powered Growth</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              What do you want to <br /> learn today?
            </h1>

            {/* Search Bar */}
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className=" bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-full focus:ring-black focus:border-black block w-full pl-12 p-4 shadow-sm" 
                placeholder="Search for a skill, topic, or role..." 
              />
              <button className="absolute right-2 top-2 bottom-2 bg-black text-white rounded-full px-6 text-sm font-medium hover:bg-gray-800 transition">
                Search
              </button>
            </div>
          </div>

          {/* Bento Grid Services Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Column 1 (Left Stack) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex gap-4">
                {/* Box 1: Blue */}
                <div className="flex-1 bg-sky-300 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition">
                  <Cloud className="w-8 h-8 text-gray-800 mb-8" />
                  <span className="font-semibold text-gray-900">Cloud AI</span>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full"></div>
                </div>
                {/* Box 2: Salmon */}
                <div className="flex-1 bg-rose-400 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition">
                  <BarChart3 className="w-8 h-8 text-gray-800 mb-8" />
                  <span className="font-semibold text-gray-900">Analytics</span>
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/20 rounded-full"></div>
                </div>
              </div>
              
              {/* Box 3: Wide Light Blue (Tech Stack) */}
              <div className="bg-blue-100 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden flex-grow">
                <div className="flex gap-1 mb-2">
                  <div className="h-1 w-6 bg-gray-800 rounded-full"></div>
                  <div className="h-1 w-2 bg-gray-800 rounded-full"></div>
                </div>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                  Python / TensorFlow / <br/> 
                  React / NLP / <br/> 
                  Data Science
                </p>
                <div className="absolute bottom-4 right-4">
                   <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                     <div className="w-12 h-px bg-gray-400 -rotate-45"></div>
                   </div>
                </div>
              </div>
            </div>

            {/* Column 2 (Center Feature) */}
            <div className="md:col-span-4 bg-teal-100 rounded-3xl p-6 flex flex-col relative">
              <h3 className="text-lg font-bold text-gray-800 leading-tight mb-4">
                Get Personalized <br/> AI Study Plan
              </h3>
              
              {/* Illustration Placeholder */}
              <div className="flex-1 flex items-center justify-center relative mt-4">
                <div className="relative z-10">
                   <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-white mb-2">
                      <Lightbulb size={40} className="text-yellow-300" />
                   </div>
                   <div className="w-32 h-12 bg-gray-200 rounded-lg absolute -bottom-4 -left-4 -z-10"></div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-300 rounded-full"></div>
                <div className="absolute bottom-10 left-0 w-4 h-4 bg-blue-400 transform rotate-45"></div>
              </div>
              <div className="mt-4 border-t border-teal-200 pt-4">
                  <div className="h-2 w-24 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Column 3 (Right Stack) */}
            <div className="md:col-span-4 flex flex-col gap-4">
               {/* Box 5: Blue */}
               <div className="bg-blue-500 rounded-3xl p-6 text-white h-40 flex flex-col justify-between relative overflow-hidden hover:bg-blue-600 transition cursor-pointer">
                  <div className="flex justify-end">
                    <Monitor className="w-8 h-8 text-blue-200" />
                  </div>
                  <span className="font-semibold text-xl">UI/UX <br/> Design</span>
                  <div className="absolute left-4 bottom-8 flex gap-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <div className="w-10 h-2 bg-blue-300 rounded-full"></div>
                  </div>
               </div>

               {/* Box 6: Green */}
               <div className="bg-emerald-400 rounded-3xl p-6 h-full flex flex-col justify-between relative overflow-hidden hover:bg-emerald-500 transition cursor-pointer">
                 <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-800 rounded-tr-lg"></div>
                 </div>
                 <span className="font-semibold text-gray-900 text-lg mt-auto">Web / Mobile <br/> Development</span>
               </div>
            </div>

          </div>

          {/* Footer Area */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
             <div className="flex gap-4 mb-4 md:mb-0">
               <a href="#" className="hover:text-black">Facebook</a>
               <span className="text-gray-300">|</span>
               <a href="#" className="hover:text-black">Linkedin</a>
               <span className="text-gray-300">|</span>
               <a href="#" className="hover:text-black">Twitter</a>
             </div>
             <a href="#" className="hover:text-black">Privacy Policy</a>
          </div>

        </div>

        {/* RIGHT SIDEBAR (Booking) */}
        

        </div>
      </div>
    
  );
}
=======
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
    const [hoveredCard, setHoveredCard] = useState(null)

    const features = [
        {
            id: 1,
            title: 'AI-Powered Learning',
            description: 'Personalized learning paths generated by advanced AI to match your pace and style',
            icon: '🤖',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            id: 2,
            title: 'Bite-Sized Content',
            description: 'Learn in 5-minute chunks that fit perfectly into your busy schedule',
            icon: '⚡',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            id: 3,
            title: 'Track Progress',
            description: 'Visual analytics and insights to monitor your learning journey',
            icon: '📊',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            id: 4,
            title: 'Interactive Quizzes',
            description: 'Reinforce learning with engaging quizzes and instant feedback',
            icon: '🎯',
            gradient: 'from-green-500 to-emerald-500'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl">📚</span>
                        <h1 className="text-2xl font-bold text-white">MicroLearn</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn-secondary">Sign In</button>
                        <button className="btn-primary">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Content */}
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Learn Smarter,
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                Not Harder
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Master new skills with AI-powered micro-lessons designed for your busy life.
                            Just 5 minutes a day to unlock your potential.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button className="btn-primary text-lg px-8 py-4">
                                Start Learning Free
                            </button>
                            <button className="btn-secondary text-lg px-8 py-4">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            { number: '10K+', label: 'Active Learners' },
                            { number: '500+', label: 'Micro Lessons' },
                            { number: '95%', label: 'Success Rate' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="card-glass text-center transform hover:scale-105 transition-transform duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="mb-20">
                        <h3 className="text-4xl font-bold text-white text-center mb-12">
                            Why Choose MicroLearn?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={feature.id}
                                    className="card-glass group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                    onMouseEnter={() => setHoveredCard(feature.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className={`text-5xl mb-4 transform transition-transform duration-300 ${hoveredCard === feature.id ? 'scale-110 rotate-12' : ''
                                        }`}>
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-xl font-semibold text-white mb-3">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${feature.gradient} transform origin-left transition-transform duration-300 ${hoveredCard === feature.id ? 'scale-x-100' : 'scale-x-0'
                                        }`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="card-glass text-center py-16 px-8">
                        <h3 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Learning?
                        </h3>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of learners who are achieving their goals with just 5 minutes a day
                        </p>
                        <button className="btn-primary text-lg px-10 py-4">
                            Get Started Now - It's Free
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
                    <p>&copy; 2025 MicroLearn. Empowering learners worldwide.</p>
                </div>
            </footer>
        </div>
    )
}
>>>>>>> 45001726ba9145a13b49f8931da0eeb9698108fe
