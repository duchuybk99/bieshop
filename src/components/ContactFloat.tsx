'use client'

import { MessageCircle, Phone, X } from 'lucide-react'
import { useState } from 'react'

const actions = [
  {
    href: 'https://zalo.me/0123456789',
    label: 'Zalo',
    className: 'bg-[#0068FF] hover:brightness-110',
    icon: <MessageCircle aria-hidden className="h-5 w-5" />,
  },
  {
    href: 'https://m.me/pagename',
    label: 'Facebook',
    className: 'bg-[#1877F2] hover:brightness-110',
    icon: (
      <span aria-hidden className="text-base font-black">
        f
      </span>
    ),
  },
  {
    href: 'tel:0123456789',
    label: 'Gọi điện',
    className: 'bg-[#2E5FA3] hover:bg-[#1B3F7A]',
    icon: <Phone aria-hidden className="h-5 w-5" />,
  },
]

export default function ContactFloat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="flex flex-col items-end gap-2">
          {actions.map((action) => (
            <a
              className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1B2B4B]/20 transition-all duration-300 ease-in-out hover:scale-[1.02] ${action.className}`}
              href={action.href}
              key={action.label}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
              target={action.href.startsWith('http') ? '_blank' : undefined}
            >
              {action.icon}
              {action.label}
            </a>
          ))}
        </div>
      ) : null}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Thu gọn liên hệ' : 'Mở liên hệ'}
        className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-[#1B2B4B] text-white shadow-xl shadow-[#1B2B4B]/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:brightness-110"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X aria-hidden className="h-6 w-6" /> : <MessageCircle aria-hidden className="h-6 w-6" />}
      </button>
    </div>
  )
}
