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
      <div className="flex aspect-[4/5] items-center justify-center rounded-md bg-[#f3e3d2] px-8 text-center text-[#8a6b55]">
        Hình ảnh sản phẩm đang được cập nhật.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] overflow-hidden rounded-md bg-[#f3e3d2]">
        <img
          alt={activeImage.alt || productName}
          className="h-full w-full object-cover"
          src={activeImage.url}
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              aria-label={`Xem hình ${index + 1}`}
              className={`aspect-square overflow-hidden rounded-md border-2 bg-[#f3e3d2] transition ${
                activeIndex === index ? 'border-[#b75b3b]' : 'border-transparent hover:border-[#d7bda2]'
              }`}
              key={`${image.url}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img
                alt={image.alt || `${productName} ${index + 1}`}
                className="h-full w-full object-cover"
                src={image.url}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
