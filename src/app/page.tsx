'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useMenu } from './layout';

export default function Home() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
      
      setShowScrollIndicator(distanceFromBottom > 100);
      setShowScrollToTop(distanceFromBottom < 300 && scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuButtonClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Op mobiel: maak hamburger menu oop
      scrollToTop();
      setTimeout(() => {
        setIsMenuOpen(true);
      }, 600);  
    } else {
      // Op desktop: scroll na bo
      scrollToTop();
    }
  };

  return (
    <main className="min-h-screen bg-[#E8DBC5]">
      {/* Floating Scroll Down Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-white rounded-full shadow-lg border border-[#BB9F88] p-3">
            <div className="text-center text-[#656E5D]">
              <p className="text-xs mb-1">Scroll af</p>
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Floating Scroll To Top Button */}
      {showScrollToTop && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={scrollToTop}
            className="bg-white rounded-full shadow-lg border border-[#BB9F88] p-3 hover:bg-[#FFF7E3] transition-colors"
          >
            <div className="text-center text-[#656E5D]">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <p className="text-xs mt-1">Terug op</p>
            </div>
          </button>
        </div>
      )}

      <div className="text-center py-12 px-4">
        {/* Name in mooi boksie */}
        <div className="max-w-lg mx-auto mb-8 bg-white rounded-2xl shadow-lg border border-[#BB9F88] p-8">
          <h1 className="text-4xl sm:text-5xl md:text-5xl text-[#67472C]">Nickie & Chané</h1>
        </div>

        {/* Datum */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#67472C] mb-8 font-semibold">28 Maart 2026</p>

        {/* Decorative lines between name and photo */}
        <div className="max-w-md mx-auto mb-12 px-4">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>
        
        {/* Main Photo met border */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <div className="rounded-2xl shadow-2xl border-4 border-white p-4 bg-white">
            <Image 
              src="/hoof-foto.jpg" 
              alt="Nickie en Chané"
              width={800}
              height={500}
              className="rounded-lg mx-auto w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Hashtag */}
        <p className="text-base sm:text-lg md:text-xl text-[#656E5D] mb-12">#thunderMerwe</p>

        {/* Een blok vir meer inligting */}
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-lg border border-[#BB9F88] p-8 text-center">
            <h2 className="text-2xl text-[#67472C] mb-4">Meer Inligting</h2>
            <p className="text-[#656E5D] mb-6">
              Vir volledige besonderhede oor ons troudag, besoek die ander bladsye deur die Navigasie Menu te gebruik.
            </p>
            <button 
              onClick={handleMenuButtonClick}
              className="bg-[#67472C] text-white px-6 py-3 rounded-lg hover:bg-[#99735A] transition-colors font-semibold"
            >
              {typeof window !== 'undefined' && window.innerWidth < 768 ? 'Navigasie Menu' : 'Sien Meer Inligting'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}