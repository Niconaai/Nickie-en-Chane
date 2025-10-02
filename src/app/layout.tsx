import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

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
              <Link href="/" className="text-[#67472C] hover:text-[#99735A] transition-colors">Tuis</Link>
              <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Ons Storie</Link>
              <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A] transition-colors">Besonderhede</Link>
              <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A] transition-colors">RSVP</Link>
              <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A] transition-colors">Foto&apos;s</Link>
              <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A] transition-colors">Akkomodasie</Link>
              <Link href="/faq" className="text-[#67472C] hover:text-[#99735A] transition-colors">FAQs</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}