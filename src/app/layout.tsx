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
          <div className="max-w-4xl mx-auto flex justify-center space-x-8 py-4">
            <Link href="/" className="text-[#67472C] hover:text-[#99735A]">Tuis</Link>
            <Link href="/ons-storie" className="text-[#67472C] hover:text-[#99735A]">Ons Storie</Link>
            <Link href="/besonderhede" className="text-[#67472C] hover:text-[#99735A]">Besonderhede</Link>
            <Link href="/rsvp" className="text-[#67472C] hover:text-[#99735A]">RSVP</Link>
            <Link href="/foto-gallery" className="text-[#67472C] hover:text-[#99735A]">Foto&apos;s</Link>
            <Link href="/akkomodasie" className="text-[#67472C] hover:text-[#99735A]">Akkomodasie</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
