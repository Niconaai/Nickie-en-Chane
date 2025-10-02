import Image from 'next/image'
import fs from 'fs'
import path from 'path'

// Client component for the modal
import { GalleryClient } from './GalleryClient'

// Server component - can use fs
async function getPhotos() {
  const galleryPath = path.join(process.cwd(), 'public/gallery')
  
  try {
    const files = fs.readdirSync(galleryPath)
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/gallery/${file}`)
  } catch (error) {
    console.log('No gallery folder found')
    return []
  }
}

export default async function FotoGallery() {
  const photos = await getPhotos()

  return (
    <div className="min-h-screen bg-[#E8DBC5] py-8 px-4 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl  text-[#67472C] text-center mb-8 sm:mb-12">Ons Foto&apos;s</h1>

        {/* Decorative Strips - Use between sections */}
<div className="max-w-md mx-auto my-12">
  <div className="h-1 bg-[#97A887] mb-2"></div>
  <div className="h-1 bg-[#BB9F88] mb-2"></div>
  <div className="h-1 bg-[#656E5D]"></div>
</div>
        
        {photos.length === 0 ? (
          <div className="text-center text-[#656E5D] bg-white rounded-lg p-8 border border-[#BB9F88]">
            <p className="mb-4">Geen foto&apos;s gevind nie.</p>
            <p className="text-sm">Maak seker daar is &apos;n &apos;gallery&apos; folder in die &apos;public&apos; folder met foto&apos;s.</p>
          </div>
        ) : (
          <GalleryClient photos={photos} />
        )}
      </div>
    </div>
  )
}