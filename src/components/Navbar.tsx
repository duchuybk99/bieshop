'use client'

import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/about', label: 'Về chúng tôi' },
]

const contactLinks = [
  {
    href: 'https://zalo.me/0123456789',
    label: 'Zalo',
    className: 'text-white hover:scale-105 hover:bg-white/10',
    icon: <MessageCircle aria-hidden className="h-4 w-4" />,
  },
  {
    href: 'https://m.me/pagename',
    label: 'Facebook',
    className: 'text-white hover:scale-105 hover:bg-white/10',
    icon: (
      <span aria-hidden className="text-sm font-bold leading-none">
        f
      </span>
    ),
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 8)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-[#1B2B4B]/95 text-white transition-all duration-300 ease-in-out ${
        hasScrolled ? 'shadow-sm shadow-[#1B2B4B]/20 backdrop-blur-xl' : 'backdrop-blur-none'
      }`}
    >
      <nav className="container flex h-20 items-center justify-between">
        <Link
          aria-label="BIE SHOP"
          className="font-[var(--font-playfair-display)] text-2xl font-bold tracking-[0.18em] text-white transition-all duration-300 ease-in-out hover:scale-[1.02]"
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
                className={`group relative text-sm font-medium tracking-[0.08em] text-white/90 transition-all duration-300 ease-in-out hover:text-white ${
                  active ? 'text-white' : ''
                }`}
                href={link.href}
                key={link.href}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-300 ease-in-out ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {contactLinks.map((link) => (
            <a
              aria-label={link.label}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${link.className}`}
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/10"
            href="tel:0123456789"
            title="Gọi điện"
          >
            <Phone aria-hidden className="h-4 w-4" />
          </a>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-white/10 bg-[#1B2B4B] transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-5">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                className="rounded-xl px-3 py-3 text-base font-medium tracking-[0.04em] text-white transition-all duration-300 ease-in-out hover:bg-white/10"
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
                className={`flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-bold transition-all duration-300 ease-in-out ${link.className}`}
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
      </div>
    </header>
  )
}
