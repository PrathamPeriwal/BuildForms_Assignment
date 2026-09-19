import type { Metadata } from 'next'
import { Big_Shoulders, Archivo, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const display = Big_Shoulders({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  fallback: ['Impact', 'Arial Narrow', 'sans-serif'],
  display: 'swap',
})

const sans = Archivo({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['Courier New', 'monospace'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Production Control Dashboard',
  description: 'Factory operations dashboard — jobs, machines, issues.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}

