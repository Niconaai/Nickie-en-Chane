'use client'
import './globals.css'
import Link from 'next/link'
import { useState, createContext, useContext } from 'react'

// Create context for menu state
const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (open: boolean) => {}
})

// SVG Pictograms
const MenuIcons = {
  home: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  story: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M8 16l5-5 5 5z"/>
    </svg>
  ),
  details: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  rsvp: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
    </svg>
  ),
  photos: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
  ),
  accommodation: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  faq: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
    </svg>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <html lang="af">
      <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
        <body className="min-h-screen flex flex-col font-serif bg-[#E8DBC5]">
          <nav className="bg-[#E8DBC5] border-b border-[#BB9F88]">
            <div className="max-w-4xl mx-auto">
              {/* Desktop Navigation */}
              <div className="hidden md:flex flex-wrap justify-center gap-4 py-4 px-4 text-sm md:text-base md:gap-8">
                <Link href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.home} Tuis
                </Link>
                <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.story} Ons Storie
                </Link>
                <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.details} Besonderhede
                </Link>
                <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.rsvp} RSVP
                </Link>
                <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.photos} Foto&apos;s
                </Link>
                <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.accommodation} Akkomodasie
                </Link>
                <Link href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors flex items-center">
                  {MenuIcons.faq} FAQs
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex justify-between items-center py-4 px-4">
                <div className="text-[#67472C] text-lg">Nickie & Chane</div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#67472C] p-2"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    {isMenuOpen ? (
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    ) : (
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-[#BB9F88]">
                  <div className="flex flex-col py-4 space-y-4 px-4">
                    <Link href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.home} Tuis
                    </Link>
                    <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.story} Ons Storie
                    </Link>
                    <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.details} Besonderhede
                    </Link>
                    <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.rsvp} RSVP
                    </Link>
                    <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.photos} Foto&apos;s
                    </Link>
                    <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.accommodation} Akkomodasie
                    </Link>
                    <Link href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                      {MenuIcons.faq} FAQs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-[#E8DBC5] border-t border-[#BB9F88] py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="max-w-md mx-auto mb-6">
                <div className="h-1 bg-[#97A887] mb-2"></div>
                <div className="h-1 bg-[#BB9F88] mb-2"></div>
                <div className="h-1 bg-[#656E5D]"></div>
              </div>
              <div className="text-center text-[#656E5D] text-sm">
                <p className="mb-2">Ontwerp deur Nickie • Gebou met Liefde</p>
                <p>© 2025 Nickie & Chane • Hosted on Vercel</p>
              </div>
            </div>
          </footer>
        </body>
      </MenuContext.Provider>
    </html>
  )
}

// Export hook to use menu context
export const useMenu = () => useContext(MenuContext)