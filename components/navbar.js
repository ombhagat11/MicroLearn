import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X, ChevronRight } from "lucide-react";

export default function FloatingNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Add shadow only when scrolled slightly to keep it clean at the top
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const NavItem = ({ href, children, mobile }) => (
        <a
            href={href}
            className={`relative group transition-colors duration-200 
        ${mobile
                    ? 'text-lg font-medium text-gray-900 py-3 border-b border-gray-100 flex justify-between items-center'
                    : 'text-sm font-medium text-gray-600 hover:text-black px-3 py-2 rounded-full hover:bg-gray-100/50'
                }`}
        >
            {children}
            {mobile && <ChevronRight size={16} className="text-gray-400" />}
        </a>
    );

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
            <header
                className={`
          w-full max-w-5xl 
          bg-white/70 backdrop-blur-xl 
          border border-white/20 ring-1 ring-black/5
          rounded-3xl transition-all duration-300 ease-in-out
          ${scrolled ? 'shadow-lg shadow-black/5 py-1' : 'shadow-sm py-2'}
          ${isMobileMenuOpen ? 'rounded-b-none bg-white' : ''}
        `}
            >
                <div className="px-4 md:px-6">
                    <div className="flex justify-between items-center">

                        {/* --- Left: Logo --- */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-6 h-6 bg-black rounded-r-full rounded-tl-full flex items-center justify-center">
                                {/* Optional: Add a small SVG icon inside the logo shape */}
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                MicroLearn<span className="text-xs align-top ml-0.5 text-gray-500 font-medium">AI</span>
                            </span>
                        </div>

                        {/* --- Center: Desktop Navigation --- */}
                        <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-full border border-gray-100/50">
                            <NavItem href="#">Courses</NavItem>
                            <NavItem href="#">Mentors</NavItem>
                            <NavItem href="#">Pricing</NavItem>
                        </nav>

                        {/* --- Right: Actions & Auth --- */}
                        <div className="hidden md:flex items-center gap-3">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium text-gray-600 hover:text-black px-3 py-2 transition">
                                        Log in
                                    </button>
                                </SignInButton>

                                <SignInButton mode="modal">
                                    <button className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                                        Get Started
                                    </button>
                                </SignInButton>
                            </SignedOut>

                            <SignedIn>
                                <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black mr-2">
                                    My Learning
                                </a>
                                <div className="pl-2 border-l border-gray-200">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-9 h-9 ring-2 ring-white hover:scale-105 transition-transform"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>
                        </div>

                        {/* --- Mobile Menu Toggle --- */}
                        <div className="md:hidden flex items-center gap-4">
                            <SignedIn>
                                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                            </SignedIn>
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Mobile Dropdown (Attached to the floating bar) --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 animate-in slide-in-from-top-2 fade-in-20">
                        <div className="p-4 flex flex-col">
                            <NavItem href="#" mobile>Courses</NavItem>
                            <NavItem href="#" mobile>Mentors</NavItem>
                            <NavItem href="#" mobile>Pricing</NavItem>

                            <div className="mt-6 space-y-3">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 transition">
                                            Log in
                                        </button>
                                    </SignInButton>
                                    <SignInButton mode="modal">
                                        <button className="w-full py-3 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-gray-800 transition">
                                            Start Learning
                                        </button>
                                    </SignInButton>
                                </SignedOut>

                                <SignedIn>
                                    <a href="/dashboard" className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-gray-50 text-gray-900 font-medium">
                                        Go to Dashboard
                                        <ChevronRight size={16} />
                                    </a>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}