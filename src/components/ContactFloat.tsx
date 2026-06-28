'use client'

import { MessageCircle, Phone, X } from 'lucide-react'
import { useState } from 'react'

const actions = [
  {
    href: 'https://zalo.me/0123456789',
    label: 'Zalo',
    className: 'bg-[#1aa260] hover:bg-[#16874f]',
    icon: <MessageCircle aria-hidden className="h-5 w-5" />,
  },
  {
    href: 'https://m.me/pagename',
    label: 'Facebook',
    className: 'bg-[#1877f2] hover:bg-[#1264cf]',
    icon: <span aria-hidden className="text-base font-black">f</span>,
  },
  {
    href: 'tel:0123456789',
    label: 'Gọi điện',
    className: 'bg-[#7a3f2a] hover:bg-[#5e2f1f]',
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
              className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold text-white shadow-lg transition ${action.className}`}
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c76b47] text-white shadow-xl shadow-[#7a3f2a]/20 transition hover:bg-[#b75b3b]"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X aria-hidden className="h-6 w-6" /> : <MessageCircle aria-hidden className="h-6 w-6" />}
      </button>
    </div>
  )
}
