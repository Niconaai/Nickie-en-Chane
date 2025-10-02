'use client'
import Image from 'next/image'
import { useState } from 'react'

interface GalleryClientProps {
  photos: string[]
}

export function GalleryClient({ photos }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {photos.map((src, index) => (
          <div 
            key={index} 
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setSelectedImage(src)}
          >
            <Image
              src={src}
              alt={`Foto ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Modal for enlarged view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button 
            className="absolute top-4 right-4 text-white text-2xl bg-[#67472C] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#99735A] transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}