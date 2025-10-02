import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nickie & Chane Troue',
  description: 'Ons spesiale dag',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="af">
      <body>
        <nav className="bg-[#FFF7E3] border-b border-[#BB9F88]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 py-4 px-4 text-sm md:text-base md:gap-8">
              <a href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors">Tuis</a>
              <a href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Ons Storie</a>
              <a href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors">Besonderhede</a>
              <a href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors">RSVP</a>
              <a href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors">Foto&apos;s</a>
              <a href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Akkomodasie</a>
              <a href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors">FAQs</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}