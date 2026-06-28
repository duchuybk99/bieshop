import type { Metadata } from 'next'

import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google'
import React from 'react'

import ContactFloat from '@/components/ContactFloat'
import Navbar from '@/components/Navbar'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  weight: ['300', '400', '500', '600', '700'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair-display',
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
      data-theme="light"
      lang="vi"
      suppressHydrationWarning
    >
      <body
        className={`${beVietnamPro.className} bg-[#EEF4FB] text-[#1A1A2E] antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <ContactFloat />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'BIE SHOP | Đồ thủ công handmade',
    template: '%s | BIE SHOP',
  },
  description: 'BIE SHOP mang đến những sản phẩm thủ công ấm áp, tinh tế và giàu cảm xúc.',
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph({
    title: 'BIE SHOP | Đồ thủ công handmade',
    description: 'Đồ handmade và quà tặng thủ công dành cho những điều thật lòng.',
  }),
}
