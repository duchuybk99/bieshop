import { Suspense } from 'react'

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
      <div className="rounded-md border border-[#e8c7b6] bg-[#fff4eb] p-6 text-sm font-medium text-[#7a3f2a]">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b75b3b]">
            Bộ sưu tập handmade
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#3f2c20] md:text-6xl">Sản phẩm</h1>
        </div>
        <p className="text-sm font-bold text-[#6b4b37]">{total} sản phẩm</p>
      </div>
      <ProductListClient products={products} />
    </>
  )
}

export default function ProductsPage() {
  return (
    <section className="container py-12 md:py-16">
      <Suspense
        fallback={
          <div className="rounded-md border border-[#ead8c3] bg-white p-6 text-sm text-[#6b4b37]">
            Đang tải danh sách sản phẩm...
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </section>
  )
}
