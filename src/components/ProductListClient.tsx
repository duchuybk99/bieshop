'use client'

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
  available: 'bg-[#dff2dc] text-[#276032]',
  preorder: 'bg-[#ffe3c2] text-[#9a4c17]',
  soldout: 'bg-[#e8e2dc] text-[#6f6258]',
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
      <div className="mb-8 flex flex-col gap-4 rounded-md border border-[#ead8c3] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                filter === item.value
                  ? 'bg-[#b75b3b] text-white'
                  : 'bg-[#f6eadb] text-[#6b4b37] hover:bg-[#ead8c3]'
              }`}
              key={item.value}
              onClick={() => setFilter(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm font-bold text-[#6b4b37]">
          Sắp xếp
          <select
            className="rounded-full border border-[#d7bda2] bg-[#fffaf2] px-4 py-2 text-[#3f2c20] outline-none focus:border-[#b75b3b]"
            onChange={(event) => setSort(event.target.value as SortValue)}
            value={sort}
          >
            <option value="newest">Mới nhất</option>
            <option value="name-asc">Tên A-Z</option>
          </select>
        </label>
      </div>

      {visibleProducts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const imageUrl = getProductImage(product)
            const price = formatPrice(product.price)
            return (
              <Link
                className="group overflow-hidden rounded-md border border-[#ead8c3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7a3f2a]/10"
                href={`/products/${product.slug}`}
                key={product.id}
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#f3e3d2]">
                  {imageUrl ? (
                    <img
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#8a6b55]">
                      Hình ảnh sản phẩm
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClasses[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-[#3f2c20]">{product.name}</h2>
                    {price ? <p className="mt-2 font-bold text-[#b75b3b]">{price}</p> : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-md border border-[#ead8c3] bg-white p-8 text-center text-[#6b4b37]">
          Chưa có sản phẩm phù hợp với bộ lọc này.
        </div>
      )}
    </div>
  )
}
