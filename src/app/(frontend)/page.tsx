import Link from 'next/link'
import { Suspense } from 'react'

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
  available: 'bg-[#dff2dc] text-[#276032]',
  preorder: 'bg-[#ffe3c2] text-[#9a4c17]',
  soldout: 'bg-[#e8e2dc] text-[#6f6258]',
}

const contactLinks = [
  { href: 'https://zalo.me/0123456789', label: 'Zalo', className: 'bg-[#1aa260] hover:bg-[#16874f]' },
  { href: 'https://m.me/pagename', label: 'Facebook', className: 'bg-[#1877f2] hover:bg-[#1264cf]' },
  { href: 'tel:0123456789', label: '0123456789', className: 'bg-[#7a3f2a] hover:bg-[#5e2f1f]' },
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
      <div className="rounded-md border border-[#e8c7b6] bg-[#fff4eb] p-6 text-sm font-medium text-[#7a3f2a]">
        {error}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-md border border-[#ead8c3] bg-white p-6 text-sm text-[#6b4b37]">
        Sản phẩm nổi bật sẽ xuất hiện tại đây khi bạn đánh dấu featured trong Payload.
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => {
        const imageUrl = getProductImage(product)
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
            <div className="space-y-3 p-4">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[product.status]}`}
              >
                {statusLabels[product.status]}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#3f2c20]">{product.name}</h3>
                {formatPrice(product.price) ? (
                  <p className="mt-1 text-sm font-semibold text-[#b75b3b]">
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
    <div className="bg-[#fffaf2]">
      <section className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.28em] text-[#b75b3b]">
            Handmade craft studio
          </p>
          <h1 className="text-5xl font-black leading-tight text-[#3f2c20] md:text-7xl">
            Những món đồ thủ công nhỏ, giữ lại cảm xúc thật.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b4b37]">
            BIE SHOP làm ra các sản phẩm handmade ấm áp, tinh tế và có thể đặt theo dịp
            riêng của bạn.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#b75b3b] px-7 py-4 text-sm font-black text-white shadow-lg shadow-[#b75b3b]/20 transition hover:bg-[#9f4b31]"
              href="/products"
            >
              Xem sản phẩm
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#caa98d] px-7 py-4 text-sm font-black text-[#7a3f2a] transition hover:bg-[#f6eadb]"
              href="https://zalo.me/0123456789"
              rel="noreferrer"
              target="_blank"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
        <div className="relative min-h-[440px] overflow-hidden rounded-md bg-[#e8c7b6]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,#fff4e6_0,#fff4e6_20%,transparent_21%),linear-gradient(135deg,#d99068,#f5ddc4_48%,#7a3f2a)]" />
          <div className="absolute bottom-8 left-8 right-8 rounded-md bg-[#fffaf2]/88 p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b75b3b]">
              Craft with care
            </p>
            <p className="mt-3 text-2xl font-black text-[#3f2c20]">
              Mỗi sản phẩm đều được làm chậm rãi, chăm chút từ chất liệu đến cách gói.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ead8c3] bg-[#fff4eb] py-16">
        <div className="container">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b75b3b]">
                Nổi bật
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#3f2c20] md:text-4xl">
                Sản phẩm được yêu thích
              </h2>
            </div>
            <Link className="font-bold text-[#b75b3b] hover:text-[#7a3f2a]" href="/products">
              Xem tất cả
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="rounded-md border border-[#ead8c3] bg-white p-6 text-sm text-[#6b4b37]">
                Đang tải sản phẩm nổi bật...
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-3xl font-black text-[#3f2c20] md:text-4xl">Một chút về BIE SHOP</h2>
        <div className="space-y-4 text-lg leading-8 text-[#6b4b37]">
          <p>
            BIE SHOP bắt đầu từ niềm vui làm những món đồ nhỏ bằng tay, nơi từng đường nét
            đều có thời gian và sự chú ý.
          </p>
          <p>
            Chúng tôi mong mỗi sản phẩm khi đến tay bạn sẽ trở thành một món quà có câu
            chuyện, dù dành cho chính mình hay cho người thương.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-black text-[#3f2c20] md:text-4xl">Khách hàng nói gì</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                className="rounded-md border border-[#ead8c3] bg-[#fffaf2] p-6"
                key={testimonial.name}
              >
                <div className="mb-4 text-lg tracking-[0.12em] text-[#d99068]">★★★★★</div>
                <p className="leading-7 text-[#5c4030]">"{testimonial.quote}"</p>
                <p className="mt-5 font-black text-[#3f2c20]">{testimonial.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-md bg-[#7a3f2a] p-8 text-white md:p-12">
          <h2 className="text-3xl font-black md:text-4xl">Bạn muốn đặt một món đồ riêng?</h2>
          <p className="mt-4 max-w-2xl text-[#f7dcc8]">
            Nhắn cho BIE SHOP để được tư vấn mẫu, màu sắc, thời gian hoàn thiện và cách giao
            hàng phù hợp.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {contactLinks.map((link) => (
              <a
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black text-white transition ${link.className}`}
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
      </section>
    </div>
  )
}
