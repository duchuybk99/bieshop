'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/about', label: 'Về chúng tôi' },
]

const contactLinks = [
  {
    href: 'https://zalo.me/0123456789',
    label: 'Zalo',
    className: 'bg-[#1aa260] text-white hover:bg-[#16874f]',
    icon: <MessageCircle aria-hidden className="h-4 w-4" />,
  },
  {
    href: 'https://m.me/pagename',
    label: 'Facebook',
    className: 'bg-[#1877f2] text-white hover:bg-[#1264cf]',
    icon: <span aria-hidden className="text-sm font-bold leading-none">f</span>,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#ead8c3] bg-[#fffaf2]/95 backdrop-blur">
      <nav className="container flex h-20 items-center justify-between">
        <Link
          aria-label="BIE SHOP"
          className="text-xl font-black tracking-[0.18em] text-[#7a3f2a]"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          BIE SHOP
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                className={`text-sm font-semibold transition ${
                  active ? 'text-[#b75b3b]' : 'text-[#6b4b37] hover:text-[#b75b3b]'
                }`}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {contactLinks.map((link) => (
            <a
              aria-label={link.label}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition ${link.className}`}
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target="_blank"
              title={link.label}
            >
              {link.icon}
            </a>
          ))}
          <a
            aria-label="Gọi điện"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7a3f2a] text-white shadow-sm transition hover:bg-[#5e2f1f]"
            href="tel:0123456789"
            title="Gọi điện"
          >
            <Phone aria-hidden className="h-4 w-4" />
          </a>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7bda2] text-[#7a3f2a] md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-[#ead8c3] bg-[#fffaf2] px-4 py-5 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                className="rounded-md px-3 py-3 text-base font-semibold text-[#4a3325] hover:bg-[#f6eadb]"
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            {contactLinks.map((link) => (
              <a
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold ${link.className}`}
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
