'use client'
import './globals.css'
import Link from 'next/link'
import { useState, createContext, useContext, useEffect } from 'react'
import { brittany, crimson } from '../lib/fonts'

// Create context for menu state
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (open: boolean) => { },
  isLoading: false,
  setIsLoading: (loading: boolean) => { }
})

// SVG Pictograms
const MenuIcons = {
  home: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  story: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <path d="M8 16l5-5 5 5z" />
    </svg>
  ),
  details: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  rsvp: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
    </svg>
  ),
  photos: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  ),
  accommodation: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  faq: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
    </svg>
  )
}

//Custom link component met loading
const LoadingLink = ({ href, children, className, onClick }: {
  href: string,
  children: React.ReactNode,
  className?: string,
  onClick?: () => void
}) => {
  const { setIsLoading, setIsMenuOpen } = useMenu()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Start loading
    setIsLoading(true)

    // Close menu on mobile
    setIsMenuOpen(false)

    // Call custom onClick if provided
    if (onClick) onClick()

    // Navigate after delay
    setTimeout(() => {
      window.location.href = href
    }, 800)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const menuContextValue = {
    isMenuOpen,
    setIsMenuOpen,
    isLoading,
    setIsLoading
  }

  return (
    <html lang="af" className={`${brittany.variable} ${crimson.variable}`}>
      <head>
        <title>C&N | 28.03.2026</title>
      </head>
      <MenuContext.Provider value={menuContextValue}>
        <body className={`min-h-screen flex flex-col ${crimson.className} bg-white`}>
          {/* Initial Loading Screen */}
          {isInitialLoading && (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4" style={{ width: '200px', height: '125px' }}>
                  <img
                    src="/cow-walking.gif"
                    alt="Loading..."
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className={`text-3xl text-[#3d251e] mb-2 ${brittany.className} `}>Chané & Nickie</h1>
                <p className="text-[#5c4033]">28 Maart 2026</p>
              </div>
            </div>
          )}

          {/* Navigation Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4" style={{ width: '200px', height: '125px' }}>
                  <img
                    src="/cow-walking.gif"
                    alt="Loading..."
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className={`text-3xl text-[#3d251e] mb-2  ${brittany.className} `}>Chané & Nickie</h1>
                <p className="text-[#5c4033]">28 Maart 2026</p>
              </div>
            </div>
          )}

          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-[60vw] mx-auto">
              {/* Desktop Navigation */}
              <div className="hidden md:flex flex-wrap justify-center gap-4 py-4 px-4 text-sm md:text-base md:gap-8">
                <LoadingLink href="/" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.home} Tuis
                </LoadingLink>
                <LoadingLink href="/ons-storie" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.story} Meer oor Ons
                </LoadingLink>
                <LoadingLink href="/besonderhede" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.details} Besonderhede
                </LoadingLink>
                <LoadingLink href="/foto-gallery" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.photos} Foto&apos;s
                </LoadingLink>
                <LoadingLink href="/akkomodasie" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.accommodation} Akkomodasie
                </LoadingLink>
                <LoadingLink href="/faq" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors flex items-center">
                  {MenuIcons.faq} V en A
                </LoadingLink>
                <LoadingLink
                  href="/rsvp"
                  className="text-xl bg-[#3d251e] text-white hover:bg-[#5c4033] transition-colors flex items-center px-4 py-2 rounded-lg"
                >
                  {MenuIcons.rsvp} RSVP
                </LoadingLink>
              </div>

              {/* Mobile Navigation */}
              <div className="max-w-[80vw] md:hidden flex justify-between items-center py-4 px-4">
                <div className="text-[#3d251e] text-2xl">Chané & Nickie</div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#3d251e] p-2"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    {isMenuOpen ? (
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    ) : (
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMenuOpen && (
                <div className="max-w-[60vw] md:hidden bg-white border-t border-gray-200">
                  <div className="max-w-[60vw] flex flex-col py-4 space-y-4 px-4">
                    <LoadingLink href="/" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.home} Tuis
                    </LoadingLink>
                    <LoadingLink href="/ons-storie" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.story} Meer oor Ons
                    </LoadingLink>
                    <LoadingLink href="/besonderhede" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.details} Besonderhede
                    </LoadingLink>
                    <LoadingLink href="/foto-gallery" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.photos} Foto&apos;s
                    </LoadingLink>
                    <LoadingLink href="/akkomodasie" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.accommodation} Akkomodasie
                    </LoadingLink>
                    <LoadingLink href="/faq" className="text-xl text-[#3d251e] hover:text-[#5c4033] transition-colors py-2 flex items-center">
                      {MenuIcons.faq} V en A
                    </LoadingLink>
                    <LoadingLink
                      href="/rsvp"
                      className="text-xl bg-[#3d251e] text-white hover:bg-[#5c4033] transition-colors py-2 flex items-center px-4 rounded-lg"
                    >
                      {MenuIcons.rsvp} RSVP
                    </LoadingLink>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <main className="flex-grow bg-white">
            {children}
          </main>

          <footer className="bg-white border-t border-gray-200 py-8 px-4">
            <div className="max-w-[80vw] md:max-w-[60vw] mx-auto">
              <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
                <div className="h-1 bg-[#97A887] mb-2"></div>
                <div className="h-1 bg-[#BB9F88] mb-2"></div>
                <div className="h-1 bg-[#656E5D]"></div>
              </div>
              <div className="text-center text-[#5c4033] text-sm">
                <p className="mb-2">• Nick van der Merwe •</p>
                <p>© 2025 Nick&Co</p>
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