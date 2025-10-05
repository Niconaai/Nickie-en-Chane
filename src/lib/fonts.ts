import { Dancing_Script, Crimson_Pro } from 'next/font/google'

// Configure Brittany Signature
export const brittany = Dancing_Script({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-brittany',
})

// Configure Crimson Pro
export const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-crimson',
})