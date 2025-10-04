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
    <main className="min-h-screen bg-white">
      {/* Floating Scroll Down Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-white rounded-full shadow-lg border border-gray p-3">
            <div className="text-center text-[#5c4033]">
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
            className="bg-white rounded-full shadow-lg border border-gray-300 p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center text-[#5c4033]">
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
          <h1 className="text-4xl sm:text-5xl md:text-5xl text-[#3d251e]">Nickie & Chané</h1>
        </div>

        {/* Datum */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#3d251e] mb-8 font-semibold">28 Maart 2026</p>

        {/* Decorative lines between name and photo */}
        <div className="max-w-md mx-auto mb-12 px-1">
          <div className="h-1 bg-[#8b6c5c] mb-2"></div>
          <div className="h-1 bg-[#5c4033] mb-2"></div>
          <div className="h-1 bg-[#3d251e]"></div>
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

        {/* Hashtag Social media corner*/}
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-300">
          {/* Hoof Titel */}
          <h3 className="text-2xl font-bold mb-2 text-[#3d251e]">Deel Ons Avontuur</h3>
          <p className="text-[#5c4033] mb-8">Gebruik die #hashtags en events om jou fotos en videos te deel</p>

          {/* Knoppies */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Instagram Knoppie */}
            <a
              href="https://www.instagram.com/explore/tags/thundermerwe/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 inline-flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              #ThunderMerwe
            </a>

            {/* Facebook Knoppie */}
            <a
              href="https://www.facebook.com/youreventpage"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Volg ons
            </a>
          </div>
        </div>

        {/* Een blok vir meer inligting */}
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8 text-center">
            <h2 className="text-2xl text-[#3d251e] mb-4">Meer Inligting</h2>
            <p className="text-[#5c4033] mb-6">
              Vir volledige besonderhede oor ons troudag, besoek die ander bladsye deur die Navigasie Menu te gebruik.
            </p>
            <button
              onClick={handleMenuButtonClick}
              className="bg-[#3d251e] text-white px-6 py-3 rounded-lg hover:bg-[#5c4033] transition-colors font-semibold"
            >
              {typeof window !== 'undefined' && window.innerWidth < 768 ? 'Navigasie Menu' : 'Sien Meer Inligting'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}