import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import FadeInSection from '@/components/FadeInSection'
import ProductGallery from '@/components/ProductGallery'
import RichText from '@/components/RichText'

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
  available: 'bg-[#1A7A4A] text-white',
  preorder: 'bg-[#2E5FA3] text-white',
  soldout: 'bg-[#9CA3AF] text-white',
}

const actionLabels: Record<ProductStatus, string> = {
  available: 'MUA NGAY',
  preorder: 'PRE-ORDER NGAY',
  soldout: 'HẾT HÀNG',
}

const contactLinks = [
  { href: 'https://zalo.me/0123456789', label: 'Zalo', className: 'bg-[#0068FF] hover:brightness-110' },
  { href: 'https://m.me/pagename', label: 'Facebook', className: 'bg-[#1877F2] hover:brightness-110' },
  { href: 'tel:0123456789', label: '0123456789', className: 'bg-[#2E5FA3] hover:bg-[#1B3F7A]' },
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
    <FadeInSection className="mt-16 pt-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
          Sản phẩm liên quan
        </h2>
        <Link
          className="font-semibold text-[#2E5FA3] transition-all duration-300 ease-in-out hover:text-[#1B3F7A]"
          href="/products"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid gap-7 md:grid-cols-3">
        {related.map((item) => {
          const image = getImages(item)[0]

          return (
            <Link
              className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-[#1B2B4B]/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1B2B4B]/20"
              href={`/products/${item.slug}`}
              key={item.id}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#D0DCF0]">
                {image ? (
                  <img
                    alt={image.alt}
                    className="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                    src={image.url}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#5A6A8A]">
                    Hình ảnh sản phẩm
                  </div>
                )}
              </div>
              <div className="p-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
                <h3 className="font-heading mt-4 text-xl font-semibold italic text-[#1A1A2E]">
                  {item.name}
                </h3>
                {formatPrice(item.price) ? (
                  <p className="mt-2 font-semibold text-[#2E5FA3]">{formatPrice(item.price)}</p>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>
    </FadeInSection>
  )
}

async function ProductContent({ slug }: { slug: string }) {
  const { product, error } = await getProduct(slug)

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm font-medium text-[#1B3F7A] shadow-sm">
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
      <FadeInSection className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductGallery images={images} productName={product.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.category ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5FA3]">
              {product.category}
            </p>
          ) : null}
          <h1 className="font-heading text-4xl font-semibold italic leading-tight tracking-[0.05em] text-[#1A1A2E] md:text-6xl">
            {product.name}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClasses[product.status]}`}
            >
              {statusLabels[product.status]}
            </span>
            {price ? <p className="text-2xl font-semibold text-[#2E5FA3]">{price}</p> : null}
          </div>

          {product.description ? (
            <RichText
              className="mt-8 font-light leading-[1.8] text-[#5A6A8A] prose-a:text-[#2E5FA3]"
              data={product.description}
              enableGutter={false}
            />
          ) : (
            <p className="mt-8 font-light leading-[1.8] text-[#5A6A8A]">
              Mô tả sản phẩm đang được cập nhật. Bạn có thể nhắn shop để biết thêm chất liệu,
              kích thước và thời gian hoàn thiện.
            </p>
          )}

          <a
            aria-disabled={!canOrder}
            className={`mt-9 inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-300 ease-in-out sm:w-auto ${
              canOrder
                ? 'bg-[#2E5FA3] shadow-lg shadow-[#2E5FA3]/20 hover:scale-[1.02] hover:bg-[#1B3F7A] hover:brightness-110'
                : 'pointer-events-none bg-[#9CA3AF]'
            }`}
            href={canOrder ? 'https://zalo.me/0123456789' : undefined}
            rel={canOrder ? 'noreferrer' : undefined}
            target={canOrder ? '_blank' : undefined}
          >
            {actionLabels[product.status]}
          </a>

          <div className="mt-9 rounded-2xl bg-white p-5 shadow-sm shadow-[#1B2B4B]/10">
            <h2 className="font-heading text-xl font-semibold italic text-[#1A1A2E]">
              Liên hệ để đặt hàng
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {contactLinks.map((link) => (
                <a
                  className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-[1.02] ${link.className}`}
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
      </FadeInSection>

      {youtubeEmbedUrl ? (
        <FadeInSection className="mt-16">
          <h2 className="font-heading mb-6 text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
            Video sản phẩm
          </h2>
          <div className="aspect-video overflow-hidden rounded-xl bg-[#1B2B4B] shadow-sm shadow-[#1B2B4B]/20">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              src={youtubeEmbedUrl}
              title={`Video ${product.name}`}
            />
          </div>
        </FadeInSection>
      ) : null}

      <Suspense
        fallback={
          <div className="mt-16 rounded-2xl bg-white p-6 text-sm text-[#5A6A8A] shadow-sm">
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
    <section className="container py-14 md:py-18">
      <Suspense
        fallback={
          <div className="rounded-2xl bg-white p-6 text-sm text-[#5A6A8A] shadow-sm">
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
