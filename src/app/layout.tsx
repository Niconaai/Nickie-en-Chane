'use client'
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useState, createContext, useContext } from 'react'

// Create context for menu state
const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (open: boolean) => {}
})

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
                <Link href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors">Tuis</Link>
                <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Ons Storie</Link>
                <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors">Besonderhede</Link>
                <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors">RSVP</Link>
                <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors">Foto&apos;s</Link>
                <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Akkomodasie</Link>
                <Link href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors">FAQs</Link>
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
                    <Link href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Tuis</Link>
                    <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Ons Storie</Link>
                    <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Besonderhede</Link>
                    <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>RSVP</Link>
                    <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Foto&apos;s</Link>
                    <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Akkomodasie</Link>
                    <Link href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
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