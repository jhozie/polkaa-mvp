import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Polkaa Enterprise — Corporate Payout & Collection Suite',
  description: 'Enterprise B2B disbursement and collection suite built on MTN MoMo PSB Rails.',
  generator: 'polkaa.ng',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#004F71',
  colorScheme: 'light',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} w-full overflow-x-hidden`}>
      <body className={`${geist.className} antialiased bg-[#004F71] text-foreground min-h-screen w-full overflow-x-hidden font-sans m-0 p-0`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
