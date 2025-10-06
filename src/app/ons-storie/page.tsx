'use client'
import { useState } from 'react'
import Image from 'next/image'
import { brittany, crimson } from '../../lib/fonts'

// Simple black SVG icons
const Icons = {
  school: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  ),
  message: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  ),
  heart: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  ring: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 2.97 2.16 5.44 5 5.92V18h-3v2h8v-2h-3v-4.08c2.84-.48 5-2.95 5-5.92 0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  ),
  star: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  computer: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
    </svg>
  ),
  teacher: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export default function OnsStorie() {
  const [currentPage, setCurrentPage] = useState(0)

  const storyPages = [
    {
      title: "Begin",
      icon: Icons.school,
      content: "Ons pad het baie jare gelede by Hoërskool Brits begin, waar ons mekaar ontmoet het. Nickie was Chané se Matriek in 2015. Die liefde het wel eers baie later geblom.",
      color: "bg-[#CBD0B5]",
      textColor: "text-[#656E5D]",
      photos: [
        { src: "/storie/skool-dae.jpg", alt: "Ons skool dae by Hoërskool Brits" }
      ]
    },
    {
      title: "Herontdekking",
      icon: Icons.message,
      content: "In Januarie 2022 het Chané 'n Facebook boodskap gestuur. Die gesprek het vinnig gevloei en ons het besef dat daar iets spesiaals is.",
      color: "bg-[#97A887]",
      textColor: "text-white",
      photos: [
        { src: "/storie/facebook-chat.jpg", alt: "Facebook boodskap begin" }
      ]
    },
    {
      title: "Reis Begin",
      icon: Icons.heart,
      content: "In April 2022 het ons amptelik begin uitgaan. Elke dag het ons liefde gegroei en ons het geweet hierdie is anders - hierdie is vir altyd.",
      color: "bg-[#BB9F88]",
      textColor: "text-white",
      photos: [
        { src: "/storie/vroeë-uitgaan.jpg", alt: "Ons begin uitgaan" },
        { src: "/storie/eerste-date.jpg", alt: "Eerste date" }
      ]
    },
    {
      title: "Verlowing",
      icon: Icons.ring,
      content: "Nickie, nie een vir groot romantiese gebare nie, het een aand impulsief uit die bloute gevra: 'Dit is tyd... Sal jy met my trou?' Geen kerslig, geen plan - net 'n opregte moment van liefde. Darem het hy al 'n ring gehad.",
      color: "bg-[#67472C]",
      textColor: "text-white",
      photos: [
        { src: "/storie/voorstel-oomblik.jpg", alt: "Die voorstel oomblik" },
        { src: "/storie/verloof-ring.jpg", alt: "Verloof ring" }
      ]
    },
    {
      title: "Vandag",
      icon: Icons.star,
      content: "Vandag is ons twee individue met passies wat ons deel. Nickie, die tegnologie-liefhebber, en Chané, die onderwys-engel, verenig deur ons liefde vir die buitelug, hardloop, en mekaar.",
      color: "bg-[#E8DBC5]",
      textColor: "text-[#67472C]",
      border: "border border-[#BB9F88]",
      photos: [
        { src: "/storie/hardloop-saam.jpg", alt: "Hardloop saam" },
        { src: "/storie/buitelug-avontuur.jpg", alt: "Buitelug avonture" },
        { src: "/storie/ons-vandag.jpg", alt: "Ons vandag" }
      ]
    }
  ]

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, storyPages.length - 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const SmartPhotoLayout = ({ photos }: { photos: { src: string; alt: string }[] }) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return null
    }

    if (photos.length === 1) {
      return (
        <div className="flex justify-center mb-6">
          <div className="relative rounded-lg overflow-hidden bg-[#E8DBC5] max-w-md">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              width={500}
              height={400}
              className="object-contain rounded-lg w-full h-auto"
            />
          </div>
        </div>
      )
    }

    // Vir 2 of meer fotos
    const gridCols = photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
    return (
      <div className={`grid ${gridCols} gap-3 sm:gap-4 mb-6`}>
        {photos.map((photo, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden bg-[#E8DBC5]">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={300}
              height={250}
              className="object-contain rounded-lg w-full h-auto"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <title>C&N | Meer oor Ons</title>
      <div className="min-h-screen bg-transparent py-8 px-4 sm:py-12">
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto">

          <div className="text-center mb-12">
            <h1 className="text-5xl font-semibold sm:text-4xl md:text-5xl  text-[#67472C] mb-4">Meer oor Ons</h1>
          </div>

          {/* Decorative Strips - Use between sections */}
          <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
            <div className="h-1 bg-[#97A887] mb-2"></div>
            <div className="h-1 bg-[#BB9F88] mb-2"></div>
            <div className="h-1 bg-[#656E5D]"></div>
          </div>
          {/* Character Profiles - Now at the top */}
          <div className="text-center mb-12">


            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-8 shadow-lg p-6 text-center">
                <div className="relative w-60 h-60 md:w-85 md:h-85 mx-auto mb-12 rounded-full overflow-hidden bg-[#E8DBC5]">
                  <Image
                    src="/storie/early-chané.jpg"
                    alt="Chané"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
                
                <h3 className={` text-[#67472C] text-5xl md:text-5xl mb-3 ${brittany.className} `}>Chané</h3>
                <h3 className="text-[#656E5D] text-xl md:text-xl">Onderwyser • Borrellend • Hardloop Maat</h3>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg p-6 text-center">
                <div className="relative w-60 h-60 md:w-85 md:h-85 mx-auto mb-12 rounded-full overflow-hidden bg-[#E8DBC5]">
                  <Image
                    src="/storie/early-nickie.jpg"
                    alt="Nickie"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
                <h3 className={` text-[#67472C] text-5xl md:text-5xl mb-3 ${brittany.className} `}>Nickie</h3>
                <h3 className="text-[#656E5D] text-xl md:text-xl">Sagteware Ingenieur • Padwedlope • Tegnologie</h3>
              </div>


            </div>
          </div>

          {/* Decorative Strips - Use between sections */}
          <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
            <div className="h-1 bg-[#97A887] mb-2"></div>
            <div className="h-1 bg-[#BB9F88] mb-2"></div>
            <div className="h-1 bg-[#656E5D]"></div>
          </div>

          {/* Storybook Header - Now comes after profiles */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl  text-[#67472C] mb-4">Storieboek</h1>
            <div className="flex justify-center space-x-2">
              {storyPages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentPage ? 'bg-[#67472C]' : 'bg-[#CBD0B5]'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Storybook Page */}
          <div className="relative">
            {/* Navigation Arrows */}
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-8 bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg border border-[#BB9F88] text-[#67472C] hover:bg-[#E8DBC5] transition-colors z-10"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            )}

            {currentPage < storyPages.length - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-8 bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg border border-[#BB9F88] text-[#67472C] hover:bg-[#E8DBC5] transition-colors z-10"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            )}

            {/* Current Page Content */}
            <div className={`${storyPages[currentPage].color} ${storyPages[currentPage].textColor} ${storyPages[currentPage].border || ''} rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-500`}>

              {/* Smart Photo Layout */}
              <SmartPhotoLayout photos={storyPages[currentPage].photos} />

              <div className="text-center">
                <div className="flex justify-center mb-4 text-black">
                  {storyPages[currentPage].icon}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl  mb-4">{storyPages[currentPage].title}</h2>

                <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
                  {storyPages[currentPage].content}
                </p>

                {/* Page Indicator */}
                <div className="opacity-70">
                  <p className="text-sm sm:text-base">
                    Bladsy {currentPage + 1} van {storyPages.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}