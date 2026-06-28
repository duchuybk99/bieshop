import Link from 'next/link'
import { Suspense } from 'react'

import FadeInSection from '@/components/FadeInSection'

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
  images?: ProductImage[]
  status: ProductStatus
  price?: number | null
}

interface ProductsResponse {
  docs: Product[]
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

const contactLinks = [
  { href: 'https://zalo.me/0123456789', label: 'Zalo', className: 'bg-[#0068FF] hover:brightness-110' },
  { href: 'https://m.me/pagename', label: 'Facebook', className: 'bg-[#1877F2] hover:brightness-110' },
  { href: 'tel:0123456789', label: '0123456789', className: 'bg-[#2E5FA3] hover:bg-[#1B3F7A]' },
]

const testimonials = [
  {
    quote: 'Sản phẩm rất xinh, đóng gói chỉn chu và cảm giác như nhận một món quà nhỏ.',
    name: 'Minh Anh',
  },
  {
    quote: 'Mình đặt pre-order làm quà sinh nhật, shop tư vấn nhẹ nhàng và đúng hẹn.',
    name: 'Hoàng Linh',
  },
  {
    quote: 'Đồ thủ công có nét riêng, cầm trên tay thấy thật sự ấm áp.',
    name: 'Ngọc Hà',
  },
]

const formatPrice = (price?: number | null) => {
  if (!price) return null
  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    style: 'currency',
  }).format(price)
}

const getProductImage = (product: Product) => {
  const firstImage = product.images?.[0]?.image
  if (firstImage && typeof firstImage === 'object') return firstImage.url
  return undefined
}

async function getFeaturedProducts(): Promise<{ products: Product[]; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseUrl) {
    return { products: [], error: 'Thiếu NEXT_PUBLIC_SERVER_URL để tải sản phẩm.' }
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/products?where[featured][equals]=true&limit=4&depth=2`,
      { next: { revalidate: 60 } },
    )

    if (!response.ok) {
      return { products: [], error: 'Chưa thể tải sản phẩm nổi bật.' }
    }

    const data = (await response.json()) as ProductsResponse
    return { products: data.docs ?? [] }
  } catch {
    return { products: [], error: 'Kết nối sản phẩm đang gián đoạn.' }
  }
}

async function FeaturedProducts() {
  const { products, error } = await getFeaturedProducts()

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm font-medium text-[#1B3F7A] shadow-sm">
        {error}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-[#5A6A8A] shadow-sm">
        Sản phẩm nổi bật sẽ xuất hiện tại đây khi bạn đánh dấu featured trong Payload.
      </div>
    )
  }

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => {
        const imageUrl = getProductImage(product)

        return (
          <Link
            className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-[#1B2B4B]/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1B2B4B]/20"
            href={`/products/${product.slug}`}
            key={product.id}
          >
            <div className="aspect-[4/5] overflow-hidden bg-[#D0DCF0]">
              {imageUrl ? (
                <img
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                  src={imageUrl}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#5A6A8A]">
                  Hình ảnh sản phẩm
                </div>
              )}
            </div>
            <div className="space-y-3 p-5">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[product.status]}`}
              >
                {statusLabels[product.status]}
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold italic text-[#1A1A2E]">
                  {product.name}
                </h3>
                {formatPrice(product.price) ? (
                  <p className="mt-1 text-sm font-semibold text-[#2E5FA3]">
                    {formatPrice(product.price)}
                  </p>
                ) : null}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-[#EEF4FB] text-[#1A1A2E]">
      <FadeInSection className="bg-gradient-to-br from-[#EEF4FB] via-[#F7FAFE] to-white">
        <div className="container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#2E5FA3]">
              Handmade craft studio
            </p>
            <h1 className="font-heading text-5xl font-semibold italic leading-tight tracking-[0.05em] text-[#1A1A2E] md:text-7xl">
              Những món đồ thủ công nhỏ, giữ lại cảm xúc thật.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-[1.8] text-[#5A6A8A]">
              BIE SHOP làm ra các sản phẩm handmade ấm áp, tinh tế và có thể đặt theo dịp
              riêng của bạn.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[#2E5FA3] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2E5FA3]/20 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-[#1B3F7A] hover:brightness-110"
                href="/products"
              >
                Xem sản phẩm
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#2E5FA3] shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:brightness-105"
                href="https://zalo.me/0123456789"
                rel="noreferrer"
                target="_blank"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
          <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#1B2B4B]/10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#EEF4FB_0%,#FFFFFF_46%,#D0DCF0_100%)]" />
            <div className="absolute inset-x-8 bottom-8 rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E5FA3]">
                Craft with care
              </p>
              <p className="font-heading mt-3 text-2xl font-semibold italic leading-[1.35] text-[#1A1A2E]">
                Mỗi sản phẩm đều được làm chậm rãi, chăm chút từ chất liệu đến cách gói.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-white py-18">
        <div className="container py-16">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2E5FA3]">
                Nổi bật
              </p>
              <h2 className="font-heading mt-3 text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
                Sản phẩm được yêu thích
              </h2>
            </div>
            <Link
              className="font-semibold text-[#2E5FA3] transition-all duration-300 ease-in-out hover:text-[#1B3F7A]"
              href="/products"
            >
              Xem tất cả
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="rounded-2xl bg-white p-6 text-sm text-[#5A6A8A] shadow-sm">
                Đang tải sản phẩm nổi bật...
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </FadeInSection>

      <FadeInSection className="container grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="font-heading text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
          Một chút về BIE SHOP
        </h2>
        <div className="space-y-5 text-lg font-light leading-[1.8] text-[#5A6A8A]">
          <p>
            BIE SHOP bắt đầu từ niềm vui làm những món đồ nhỏ bằng tay, nơi từng đường nét
            đều có thời gian và sự chú ý.
          </p>
          <p>
            Chúng tôi mong mỗi sản phẩm khi đến tay bạn sẽ trở thành một món quà có câu
            chuyện, dù dành cho chính mình hay cho người thương.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-white py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
            Khách hàng nói gì
          </h2>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                className="rounded-2xl bg-white p-6 shadow-sm shadow-[#1B2B4B]/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1B2B4B]/20"
                key={testimonial.name}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FB] font-heading text-lg font-semibold italic text-[#2E5FA3]">
                  {testimonial.name.charAt(0)}
                </div>
                <p className="leading-[1.8] text-[#5A6A8A]">"{testimonial.quote}"</p>
                <p className="mt-5 font-semibold text-[#1A1A2E]">{testimonial.name}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="container py-16">
        <div className="rounded-2xl bg-[#1B2B4B] p-8 text-white shadow-xl shadow-[#1B2B4B]/20 md:p-12">
          <h2 className="font-heading text-3xl font-semibold italic md:text-5xl">
            Bạn muốn đặt một món đồ riêng?
          </h2>
          <p className="mt-5 max-w-2xl font-light leading-[1.8] text-white/75">
            Nhắn cho BIE SHOP để được tư vấn mẫu, màu sắc, thời gian hoàn thiện và cách giao
            hàng phù hợp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {contactLinks.map((link) => (
              <a
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-[1.02] ${link.className}`}
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
      </FadeInSection>
    </div>
  )
}
