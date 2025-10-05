'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useMenu } from './layout';
import CountdownTimer from '../../src/components/CountdownTimer';
import { brittany, crimson } from '../lib/fonts'

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
      scrollToTop();
      setTimeout(() => {
        setIsMenuOpen(true);
      }, 600);
    } else {
      scrollToTop();
    }
  };

  return (
    <main className="min-h-screen bg-transparent">
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

        {/* Troue se naam */}
        <div className="max-w-[100vw] md:max-w-[60vw] mx-auto mb-6 bg-white rounded-xl  p-2">
          <h1 className={`text-2xl md:text-5xl text-[#3d251e] ${brittany.className} `}>Welkom by die van der Merwe Troue</h1>
        </div>

        {/* Datum Fotos */}
        <div className="max-w-[90vw] md:max-w-[60vw] mx-auto grid grid-cols-3 md:gap-4 gap-0 md:mb-8 mb-1">
          <div className="bg-white rounded-2xl shadow-lg border-1 border-white p-1">
            <Image
              src="/foto-1.jpg"
              alt="Foto 1"
              width={400}
              height={300}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-1 border-white p-1">
            <Image
              src="/foto-2.jpg"
              alt="Foto 2"
              width={400}
              height={300}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-1 border-white p-1">
            <Image
              src="/foto-3.jpg"
              alt="Foto 3"
              width={400}
              height={300}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Name in mooi boksie */}
        <div className="max-w-[100vw] md:max-w-[60vw] mx-auto mb-8 bg-white rounded-2xl  p-8">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl text-[#3d251e] ${brittany.className} `}>Chané & Nickie</h1>
        </div>

        {/* Decorative lines between name and photo */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto mb-12 px-1">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Decorative lines */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>

        {/* Main Photo met border */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto mb-16 px-4">
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

        

        {/* Een blok vir meer inligting */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto mt-20 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8 text-center">
            <h3 className="text-3xl font-bold text-[#3d251e] mb-4">Meer Inligting</h3>
            <p className="text-xl text-[#5c4033] mb-6">
              Vir volledige besonderhede oor ons troudag, besoek die ander bladsye deur die Navigasie Menu te gebruik.
            </p>
            <button
              onClick={handleMenuButtonClick}
              className="bg-[#3d251e] text-xl text-white px-6 py-3 rounded-lg hover:bg-[#5c4033] transition-colors font-semibold"
            >
              {typeof window !== 'undefined' && window.innerWidth < 768 ? 'Navigasie Menu' : 'Sien Meer Inligting'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}