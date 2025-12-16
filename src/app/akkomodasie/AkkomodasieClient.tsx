'use client';

import { useState, useEffect } from 'react';

export default function Akkomodasie() {
  const accommodations = {
    nearReception: [
      { name: "Blommelot", details: "Plaas akkomodasie naby die onthaal", mapsUrl: "https://maps.google.com/?q=Blommelot+Brits" },
      { name: "Van Rooyen Hall", details: "Plaas gastehuis", mapsUrl: "https://maps.google.com/?q=Van+Rooyen+Hall+Brits" },
      { name: "Kiepersol Lodge", details: "Lodge akkomodasie", mapsUrl: "https://maps.google.com/?q=Kiepersol+Lodge+Brits" },
      { name: "Klein Paradys", details: "Plaas verblyf", mapsUrl: "https://maps.google.com/?q=Klein+Paradys+Brits" },
      { name: "Model Akkomodasie", details: "Plaas verblyf", mapsUrl: "https://maps.google.com/?q=Model+Akkomodasie+Brits" },
      { name: "Arotin Game Lodge", details: "Wilds lodge", mapsUrl: "https://maps.google.com/?q=Arotin+Game+Lodge+Brits" },
      { name: "Dikhololo", details: "Wilds lodge", mapsUrl: "https://maps.google.com/?q=Dikhololo" }
    ],
    inTown: [
      { name: "Mahem Manor", details: "Gastehuis in Brits", mapsUrl: "https://www.google.com/maps/place/Mahem+Manor+Guesthouse/@-25.6261882,27.790615,791m/data=!3m2!1e3!4b1!4m9!3m8!1s0x1ebe31c95b45c517:0x3fe0608af7d21977!5m2!4m1!1i2!8m2!3d-25.6261882!4d27.790615!16s%2Fg%2F11lrg3m37x?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" },
      { name: "Maroela Gastehuis", details: "Gastehuis in Brits", mapsUrl: "https://maps.google.com/?q=Maroela+Gastehuis+Brits" },
      { name: "Wooden Door", details: "Gastehuis in Brits", mapsUrl: "https://maps.google.com/?q=Wooden+Door+Brits" },
      { name: "Grasdak Gastehuis", details: "Gastehuis in Brits", mapsUrl: "https://maps.google.com/?q=Grasdak+Gastehuis+Brits" }
    ]
  };

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);

      setShowScrollToTop(distanceFromBottom < 300 && scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-center">
      <div className="min-h-screen bg-transparent py-12 px-4">
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto">
          <h1 className="font-semibold text-5xl text-[#67472C] text-center mb-12">Akkomodasie</h1>

          {/* Decorative Strips - Use between sections */}
          <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
            <div className="h-1 bg-[#97A887] mb-2"></div>
            <div className="h-1 bg-[#BB9F88] mb-2"></div>
            <div className="h-1 bg-[#656E5D]"></div>
          </div>

          {/* Family Accommodation Notice */}
          <div className="bg-[#656E5D] text-white rounded-lg p-6 mb-12 text-center">
            <h2 className="text-2xl  mb-4">Groep-Akkomodasie</h2>
            <p className="text-lg">
              Belangstellende familie en gaste kan vir Chané teen einde Januarie 2026 kontak rakende groepakkommodasie.
            </p>
          </div>

          {/* Naby Onthaal */}
          <div className="mb-12">
            <h2 className="text-3xl  text-[#99735A] font-semibold mb-6 text-center">Naby Onthaal (KF49 Citrus Pakhuis)</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {accommodations.nearReception.map((place, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-[#BB9F88]">
                  <h3 className="text-xl  text-[#67472C] mb-2">{place.name}</h3>
                  <p className="text-[#656E5D] mb-4">{place.details}</p>
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#67472C] text-white px-4 py-2 rounded-lg hover:bg-[#99735A] transition-colors inline-block"
                  >
                    Sien op Kaart
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* In Dorp */}
          <div className="mb-12">
            <h2 className="text-3xl  text-[#99735A] font-semibold mb-6 text-center">Gastehuise in Brits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {accommodations.inTown.map((place, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-[#BB9F88]">
                  <h3 className="text-xl  text-[#67472C] mb-2">{place.name}</h3>
                  <p className="text-[#656E5D] mb-4">{place.details}</p>
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#67472C] text-white px-4 py-2 rounded-lg hover:bg-[#99735A] transition-colors inline-block"
                  >
                    Sien op Kaart
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#BB9F88] rounded-lg p-8 text-center text-white">
            <p className="text-lg mb-4">Maak gerus gebruik van akkomodasie van jou keuse. Die bogenoemde is net vir verwysing.</p>
          </div>
        </div>
      </div>

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
              <p className="text-xs mt-1">Terug Op</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}