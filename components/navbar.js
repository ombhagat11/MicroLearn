import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Common navigation links to avoid repetition
  const NavLinks = ({ mobile = false }) => (
    <>
      <a href="#" className={`hover:text-black transition ${mobile ? 'text-lg py-2' : 'text-sm font-medium text-gray-600'}`}>Courses</a>
      <a href="#" className={`hover:text-black transition ${mobile ? 'text-lg py-2' : 'text-sm font-medium text-gray-600'}`}>Mentors</a>
      <a href="#" className={`hover:text-black transition ${mobile ? 'text-lg py-2' : 'text-sm font-medium text-gray-600'}`}>Pricing</a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-8">
          
          {/* --- Left: Logo --- */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-black rounded-r-full rounded-tl-full flex items-center justify-center">
              {/* Optional: Add a small SVG icon inside the logo shape */}
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              MicroLearn<span className="text-xs align-top ml-0.5 text-gray-500 font-medium">AI</span>
            </span>
          </div>

          {/* --- Center: Desktop Navigation --- */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* --- Right: Actions & Auth --- */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Logic for Unauthenticated Users */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-gray-600 hover:text-black transition">
                  Log in
                </button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm hover:shadow-md">
                  Start Learning
                </button>
              </SignInButton>
            </SignedOut>

            {/* Logic for Authenticated Users */}
            <SignedIn>
              <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black mr-2">
                My Learning
              </a>
              {/* Clerk User Button with custom styling props if needed */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-gray-200"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden flex items-center">
            <SignedIn>
              <div className="mr-4">
                <UserButton />
              </div>
            </SignedIn>
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Dropdown Menu --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-6 flex flex-col gap-2">
            <NavLinks mobile />
            
            <div className="h-px bg-gray-100 my-2" />
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full text-left py-2 text-lg font-medium text-gray-600">
                  Log in
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="w-full mt-2 bg-black text-white py-3 rounded-full font-medium">
                  Start Learning
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
               <a href="/dashboard" className="text-lg py-2 font-medium text-gray-600">
                Dashboard
              </a>
              <div className="text-sm text-gray-400 pt-2">
                Manage your account via the profile icon above.
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}