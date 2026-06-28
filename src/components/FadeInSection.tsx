'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

interface FadeInSectionProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section'
  children: ReactNode
}

export default function FadeInSection({
  as: Component = 'section',
  children,
  className = '',
  ...props
}: FadeInSectionProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.14 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const classes = `${className} transition-all duration-700 ease-in-out ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`

  if (Component === 'div') {
    return (
      <div
        className={classes}
        ref={(node) => {
          ref.current = node
        }}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <section
      className={classes}
      ref={(node) => {
        ref.current = node
      }}
      {...props}
    >
      {children}
    </section>
  )
}
