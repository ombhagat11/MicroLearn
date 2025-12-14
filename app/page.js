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