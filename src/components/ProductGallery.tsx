'use client'

import { useState } from 'react'

interface GalleryImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-[#D0DCF0] px-8 text-center text-[#5A6A8A] shadow-sm">
        Hình ảnh sản phẩm đang được cập nhật.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="group aspect-[4/5] overflow-hidden rounded-2xl bg-[#D0DCF0] shadow-sm shadow-[#1B2B4B]/10">
        <img
          alt={activeImage.alt || productName}
          className="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          src={activeImage.url}
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              aria-label={`Xem hình ${index + 1}`}
              className={`aspect-square overflow-hidden rounded-xl border bg-[#D0DCF0] transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                activeIndex === index
                  ? 'border-[#2E5FA3] shadow-sm shadow-[#2E5FA3]/20'
                  : 'border-transparent hover:border-[#D0DCF0]'
              }`}
              key={`${image.url}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img
                alt={image.alt || `${productName} ${index + 1}`}
                className="h-full w-full object-cover transition-all duration-300 ease-in-out hover:scale-105"
                src={image.url}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
