'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type ProductStatus = 'available' | 'preorder' | 'soldout'

export interface ProductMedia {
  url?: string
  alt?: string
}

export interface ProductImage {
  image?: ProductMedia | string
}

export interface ProductListItem {
  id: string
  name: string
  slug: string
  images?: ProductImage[]
  status: ProductStatus
  price?: number | null
  createdAt?: string
}

interface ProductListClientProps {
  products: ProductListItem[]
}

type FilterValue = 'all' | ProductStatus
type SortValue = 'newest' | 'name-asc'

const filters: { label: string; value: FilterValue }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Pre-order', value: 'preorder' },
  { label: 'Available', value: 'available' },
  { label: 'Hết hàng', value: 'soldout' },
]

const statusLabels: Record<ProductStatus, string> = {
  available: 'Còn hàng',
  preorder: 'Pre-order',
  soldout: 'Hết hàng',
}

const statusClasses: Record<ProductStatus, string> = {
  available: 'bg-[#1A7A4A] text-white',
  preorder: 'bg-[#2E5FA3] text-white',
  soldout: 'bg-[#9CA3AF] text-white',
}

const formatPrice = (price?: number | null) => {
  if (!price) return null
  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    style: 'currency',
  }).format(price)
}

const getProductImage = (product: ProductListItem) => {
  const firstImage = product.images?.[0]?.image
  if (firstImage && typeof firstImage === 'object') return firstImage.url
  return undefined
}

export default function ProductListClient({ products }: ProductListClientProps) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sort, setSort] = useState<SortValue>('newest')

  const visibleProducts = useMemo(() => {
    const filtered =
      filter === 'all' ? products : products.filter((product) => product.status === filter)

    return [...filtered].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name, 'vi')
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    })
  }, [filter, products, sort])

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-[#D0DCF0] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                filter === item.value
                  ? 'bg-[#2E5FA3] text-white shadow-sm shadow-[#2E5FA3]/20'
                  : 'bg-[#EEF4FB] text-[#5A6A8A] hover:bg-[#D0DCF0] hover:text-[#1A1A2E]'
              }`}
              key={item.value}
              onClick={() => setFilter(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-[#5A6A8A]">
          Sắp xếp
          <select
            className="rounded-full border border-[#D0DCF0] bg-[#EEF4FB] px-4 py-2 text-[#1A1A2E] outline-none transition-all duration-300 ease-in-out focus:border-[#2E5FA3] focus:bg-white"
            onChange={(event) => setSort(event.target.value as SortValue)}
            value={sort}
          >
            <option value="newest">Mới nhất</option>
            <option value="name-asc">Tên A-Z</option>
          </select>
        </label>
      </div>

      {visibleProducts.length ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const imageUrl = getProductImage(product)
            const price = formatPrice(product.price)

            return (
              <Link
                className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-[#1B2B4B]/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1B2B4B]/20"
                href={`/products/${product.slug}`}
                key={product.id}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#D0DCF0]">
                  {imageUrl ? (
                    <Image
                      alt={product.name}
                      className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                      src={imageUrl}
                      fill
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#5A6A8A]">
                      Hình ảnh sản phẩm
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                  <div>
                    <h2 className="font-heading text-xl font-semibold italic text-[#1A1A2E]">
                      {product.name}
                    </h2>
                    {price ? <p className="mt-2 font-semibold text-[#2E5FA3]">{price}</p> : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-[#5A6A8A] shadow-sm">
          Chưa có sản phẩm phù hợp với bộ lọc này.
        </div>
      )}
    </div>
  )
}