import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import React from 'react'

import ContactFloat from '@/components/ContactFloat'
import Navbar from '@/components/Navbar'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable} data-theme="light" lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#fffaf2] text-[#3f2c20] antialiased`}>
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
