import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Editions Collection — Postgres with pg_search',
  description: 'View 53 million editions from Open Library.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} mn-h-lvh flex w-full flex-col items-center bg-black bg-cover px-4 font-sans sm:px-0`}>{children}</body>
    </html>
  )
}
