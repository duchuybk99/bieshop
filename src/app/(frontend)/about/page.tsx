import { Gem, HandHeart, Mail, PackageCheck } from 'lucide-react'

import FadeInSection from '@/components/FadeInSection'

const values = [
  {
    title: 'Thủ công tâm huyết',
    description: 'Mỗi sản phẩm được làm bằng tay với sự kiên nhẫn và cảm giác chăm chút.',
    icon: HandHeart,
  },
  {
    title: 'Chất lượng cao',
    description: 'BIE SHOP chọn chất liệu kỹ, hoàn thiện sạch và đóng gói cẩn thận.',
    icon: Gem,
  },
  {
    title: 'Giao hàng toàn quốc',
    description: 'Sản phẩm được tư vấn thời gian hoàn thiện và gửi đến bạn ở mọi tỉnh thành.',
    icon: PackageCheck,
  },
]

const contacts = [
  { href: 'https://zalo.me/0123456789', label: 'Zalo', value: 'zalo.me/0123456789' },
  { href: 'https://m.me/pagename', label: 'Facebook', value: 'm.me/pagename' },
  { href: 'tel:0123456789', label: 'Điện thoại', value: '0123456789' },
  { href: 'mailto:hello@bieshop.local', label: 'Email', value: 'hello@bieshop.local' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#EEF4FB] text-[#1A1A2E]">
      <FadeInSection className="container grid gap-12 py-14 md:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="min-h-[420px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#1B2B4B]/10">
          <div className="flex h-full min-h-[420px] items-end bg-[linear-gradient(135deg,#EEF4FB_0%,#FFFFFF_50%,#D0DCF0_100%)] p-8">
            <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5FA3]">
                Made by hand
              </p>
              <p className="font-heading mt-3 text-2xl font-semibold italic leading-[1.35] text-[#1A1A2E]">
                Một góc nhỏ dành cho chất liệu, màu sắc và những món quà có câu chuyện.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5FA3]">
            Về chúng tôi
          </p>
          <h1 className="font-heading mt-4 text-4xl font-semibold italic leading-tight tracking-[0.05em] text-[#1A1A2E] md:text-6xl">
            Chúng tôi tin đồ thủ công giữ được sự ấm áp của bàn tay người làm.
          </h1>
          <p className="mt-7 text-lg font-light leading-[1.8] text-[#5A6A8A]">
            BIE SHOP là một thương hiệu handmade nhỏ, nơi mỗi món đồ được tạo ra chậm rãi,
            tinh tế và đủ gần gũi để trở thành một phần trong đời sống hằng ngày.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-white py-16">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-heading text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
            Câu chuyện thương hiệu
          </h2>
          <div className="space-y-5 text-lg font-light leading-[1.8] text-[#5A6A8A]">
            <p>
              BIE SHOP bắt đầu từ những buổi tối ngồi thử chất liệu, phối màu và làm lại từng
              chi tiết nhỏ cho đến khi sản phẩm có cảm giác vừa vặn. Chúng tôi yêu những món
              đồ có dấu vết của thời gian và sự tập trung.
            </p>
            <p>
              Với mỗi đơn hàng, shop muốn gửi đi không chỉ một sản phẩm đẹp mà còn là cảm giác
              được lắng nghe: bạn cần quà cho ai, thích tông màu nào, muốn câu chuyện ấy nhẹ
              nhàng hay rực rỡ.
            </p>
            <p>
              Đây là nội dung placeholder để bạn có thể thay bằng câu chuyện thật của thương
              hiệu trong Payload hoặc trong mã nguồn khi sẵn sàng.
            </p>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="container py-16">
        <h2 className="font-heading text-3xl font-semibold italic text-[#1A1A2E] md:text-5xl">
          Giá trị cốt lõi
        </h2>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon

            return (
              <article
                className="rounded-2xl bg-white p-6 shadow-sm shadow-[#1B2B4B]/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1B2B4B]/20"
                key={value.title}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FB] text-[#2E5FA3]">
                  <Icon aria-hidden className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="font-heading text-xl font-semibold italic text-[#1A1A2E]">
                  {value.title}
                </h3>
                <p className="mt-4 font-light leading-[1.8] text-[#5A6A8A]">{value.description}</p>
              </article>
            )
          })}
        </div>
      </FadeInSection>

      <FadeInSection className="bg-[#1B2B4B] py-16 text-white">
        <div className="container">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
              <Mail aria-hidden className="h-5 w-5" strokeWidth={1.7} />
            </div>
            <h2 className="font-heading text-3xl font-semibold italic md:text-5xl">
              Liên hệ BIE SHOP
            </h2>
            <p className="font-light leading-[1.8] text-white/75">
              Nhắn cho shop để đặt hàng, hỏi mẫu riêng hoặc trao đổi về quà tặng handmade.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((contact) => (
              <a
                className="rounded-2xl bg-white/10 p-5 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-white/20"
                href={contact.href}
                key={contact.label}
                rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {contact.label}
                </p>
                <p className="mt-2 font-medium text-white">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </FadeInSection>
    </div>
  )
}
