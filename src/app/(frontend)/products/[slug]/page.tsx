import type { Metadata } from 'next'

import RichText from '@/components/RichText'
import ProductGallery from '@/components/ProductGallery'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type ProductStatus = 'available' | 'preorder' | 'soldout'

interface MediaImage {
  url?: string
  alt?: string
}

interface ProductImage {
  image?: MediaImage | string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: DefaultTypedEditorState | null
  images?: ProductImage[]
  youtubeUrl?: string | null
  status: ProductStatus
  price?: number | null
  category?: string | null
}

interface ProductsResponse {
  docs: Product[]
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

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

const actionLabels: Record<ProductStatus, string> = {
  available: 'MUA NGAY',
  preorder: 'PRE-ORDER NGAY',
  soldout: 'HẾT HÀNG',
}

const contactLinks = [
  { href: 'https://zalo.me/0123456789', label: 'Zalo', className: 'bg-[#1aa260] hover:bg-[#16874f]' },
  { href: 'https://m.me/pagename', label: 'Facebook', className: 'bg-[#1877f2] hover:bg-[#1264cf]' },
  { href: 'tel:0123456789', label: '0123456789', className: 'bg-[#7a3f2a] hover:bg-[#5e2f1f]' },
]

const formatPrice = (price?: number | null) => {
  if (!price) return null
  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    style: 'currency',
  }).format(price)
}

const getImages = (product: Product) => {
  return (
    product.images
      ?.map((item) => {
        const image = item.image
        if (!image || typeof image === 'string' || !image.url) return null
        return {
          alt: image.alt || product.name,
          url: image.url,
        }
      })
      .filter((image): image is { alt: string; url: string } => Boolean(image)) ?? []
  )
}

const getYoutubeEmbedUrl = (url?: string | null) => {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop()
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }

  return null
}

async function fetchProducts(url: string) {
  const response = await fetch(url, { next: { revalidate: 60 } })
  if (!response.ok) return []
  const data = (await response.json()) as ProductsResponse
  return data.docs ?? []
}

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!baseUrl) return { product: null, error: 'Thiếu NEXT_PUBLIC_SERVER_URL để tải sản phẩm.' }

  try {
    const products = await fetchProducts(
      `${baseUrl}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`,
    )
    return { product: products[0] ?? null }
  } catch {
    return { product: null, error: 'Kết nối sản phẩm đang gián đoạn.' }
  }
}

async function getRelatedProducts(product: Product) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!baseUrl) return []

  try {
    const products = await fetchProducts(`${baseUrl}/api/products?limit=6&depth=2`)
    return products.filter((item) => item.slug !== product.slug).slice(0, 3)
  } catch {
    return []
  }
}

async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product)

  if (!related.length) return null

  return (
    <section className="mt-16 border-t border-[#ead8c3] pt-12">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-black text-[#3f2c20]">Sản phẩm liên quan</h2>
        <Link className="font-bold text-[#b75b3b] hover:text-[#7a3f2a]" href="/products">
          Xem tất cả
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((item) => {
          const image = getImages(item)[0]
          return (
            <Link
              className="group overflow-hidden rounded-md border border-[#ead8c3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7a3f2a]/10"
              href={`/products/${item.slug}`}
              key={item.id}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f3e3d2]">
                {image ? (
                  <img
                    alt={image.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={image.url}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#8a6b55]">
                    Hình ảnh sản phẩm
                  </div>
                )}
              </div>
              <div className="p-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClasses[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
                <h3 className="mt-4 text-xl font-black text-[#3f2c20]">{item.name}</h3>
                {formatPrice(item.price) ? (
                  <p className="mt-2 font-bold text-[#b75b3b]">{formatPrice(item.price)}</p>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

async function ProductContent({ slug }: { slug: string }) {
  const { product, error } = await getProduct(slug)

  if (error) {
    return (
      <div className="rounded-md border border-[#e8c7b6] bg-[#fff4eb] p-6 text-sm font-medium text-[#7a3f2a]">
        {error}
      </div>
    )
  }

  if (!product) notFound()

  const images = getImages(product)
  const price = formatPrice(product.price)
  const youtubeEmbedUrl = getYoutubeEmbedUrl(product.youtubeUrl)
  const canOrder = product.status !== 'soldout'

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductGallery images={images} productName={product.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.category ? (
            <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#b75b3b]">
              {product.category}
            </p>
          ) : null}
          <h1 className="text-4xl font-black leading-tight text-[#3f2c20] md:text-6xl">
            {product.name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-black ${statusClasses[product.status]}`}
            >
              {statusLabels[product.status]}
            </span>
            {price ? <p className="text-2xl font-black text-[#b75b3b]">{price}</p> : null}
          </div>

          {product.description ? (
            <RichText
              className="mt-7 text-[#5c4030] prose-a:text-[#b75b3b]"
              data={product.description}
              enableGutter={false}
            />
          ) : (
            <p className="mt-7 leading-8 text-[#6b4b37]">
              Mô tả sản phẩm đang được cập nhật. Bạn có thể nhắn shop để biết thêm chất liệu,
              kích thước và thời gian hoàn thiện.
            </p>
          )}

          <a
            aria-disabled={!canOrder}
            className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-sm font-black text-white transition sm:w-auto ${
              canOrder
                ? 'bg-[#b75b3b] shadow-lg shadow-[#b75b3b]/20 hover:bg-[#9f4b31]'
                : 'pointer-events-none bg-[#9c9188]'
            }`}
            href={canOrder ? 'https://zalo.me/0123456789' : undefined}
            rel={canOrder ? 'noreferrer' : undefined}
            target={canOrder ? '_blank' : undefined}
          >
            {actionLabels[product.status]}
          </a>

          <div className="mt-8 rounded-md border border-[#ead8c3] bg-white p-5">
            <h2 className="text-xl font-black text-[#3f2c20]">Liên hệ để đặt hàng</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {contactLinks.map((link) => (
                <a
                  className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-black text-white transition ${link.className}`}
                  href={link.href}
                  key={link.label}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {youtubeEmbedUrl ? (
        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black text-[#3f2c20]">Video sản phẩm</h2>
          <div className="aspect-video overflow-hidden rounded-md bg-[#3f2c20]">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              src={youtubeEmbedUrl}
              title={`Video ${product.name}`}
            />
          </div>
        </section>
      ) : null}

      <Suspense
        fallback={
          <div className="mt-16 rounded-md border border-[#ead8c3] bg-white p-6 text-sm text-[#6b4b37]">
            Đang tải sản phẩm liên quan...
          </div>
        }
      >
        <RelatedProducts product={product} />
      </Suspense>
    </>
  )
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params

  return (
    <section className="container py-12 md:py-16">
      <Suspense
        fallback={
          <div className="rounded-md border border-[#ead8c3] bg-white p-6 text-sm text-[#6b4b37]">
            Đang tải chi tiết sản phẩm...
          </div>
        }
      >
        <ProductContent slug={slug} />
      </Suspense>
    </section>
  )
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!baseUrl) return []

  try {
    const products = await fetchProducts(`${baseUrl}/api/products?limit=100`)
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const { product } = await getProduct(slug)

  if (!product) {
    return {
      title: 'Sản phẩm',
    }
  }

  return {
    title: product.name,
    description: `Xem chi tiết ${product.name} tại BIE SHOP.`,
  }
}
