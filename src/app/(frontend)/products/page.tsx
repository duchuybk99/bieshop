import { Suspense } from 'react'

import FadeInSection from '@/components/FadeInSection'
import ProductListClient, { type ProductListItem } from '@/components/ProductListClient'

interface ProductsResponse {
  docs: ProductListItem[]
  totalDocs: number
}

async function getProducts(): Promise<{ products: ProductListItem[]; total: number; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseUrl) {
    return { products: [], total: 0, error: 'Thiếu NEXT_PUBLIC_SERVER_URL để tải sản phẩm.' }
  }

  try {
    const response = await fetch(`${baseUrl}/api/products?limit=100&depth=2`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return { products: [], total: 0, error: 'Không thể tải danh sách sản phẩm.' }
    }

    const data = (await response.json()) as ProductsResponse
    return { products: data.docs ?? [], total: data.totalDocs ?? 0 }
  } catch {
    return { products: [], total: 0, error: 'Kết nối sản phẩm đang gián đoạn.' }
  }
}

async function ProductsContent() {
  const { products, total, error } = await getProducts()

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm font-medium text-[#1B3F7A] shadow-sm">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5FA3]">
            Bộ sưu tập handmade
          </p>
          <h1 className="font-heading mt-3 text-4xl font-semibold italic tracking-[0.05em] text-[#1A1A2E] md:text-6xl">
            Sản phẩm
          </h1>
        </div>
        <p className="text-sm font-medium text-[#5A6A8A]">{total} sản phẩm</p>
      </div>
      <ProductListClient products={products} />
    </>
  )
}

export default function ProductsPage() {
  return (
    <FadeInSection className="container py-14 md:py-18">
      <Suspense
        fallback={
          <div className="rounded-2xl bg-white p-6 text-sm text-[#5A6A8A] shadow-sm">
            Đang tải danh sách sản phẩm...
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </FadeInSection>
  )
}
