import { Mail } from 'lucide-react'

const values = [
  {
    title: 'Thủ công tâm huyết',
    description: 'Mỗi sản phẩm được làm bằng tay với sự kiên nhẫn và cảm giác chăm chút.',
  },
  {
    title: 'Chất lượng cao',
    description: 'BIE SHOP chọn chất liệu kỹ, hoàn thiện sạch và đóng gói cẩn thận.',
  },
  {
    title: 'Giao hàng toàn quốc',
    description: 'Sản phẩm được tư vấn thời gian hoàn thiện và gửi đến bạn ở mọi tỉnh thành.',
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
    <div className="bg-[#fffaf2]">
      <section className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="min-h-[420px] overflow-hidden rounded-md bg-[#e8c7b6]">
          <div className="flex h-full min-h-[420px] items-end bg-[linear-gradient(135deg,#f7dcc8_0%,#d99068_48%,#7a3f2a_100%)] p-8">
            <div className="rounded-md bg-[#fffaf2]/88 p-6 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b75b3b]">
                Made by hand
              </p>
              <p className="mt-3 text-2xl font-black text-[#3f2c20]">
                Một góc nhỏ dành cho chất liệu, màu sắc và những món quà có câu chuyện.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b75b3b]">
            Về chúng tôi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[#3f2c20] md:text-6xl">
            Chúng tôi tin đồ thủ công giữ được sự ấm áp của bàn tay người làm.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#6b4b37]">
            BIE SHOP là một thương hiệu handmade nhỏ, nơi mỗi món đồ được tạo ra chậm rãi,
            tinh tế và đủ gần gũi để trở thành một phần trong đời sống hằng ngày.
          </p>
        </div>
      </section>

      <section className="border-y border-[#ead8c3] bg-white py-16">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-[#3f2c20] md:text-4xl">Câu chuyện thương hiệu</h2>
          <div className="space-y-5 text-lg leading-8 text-[#6b4b37]">
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
      </section>

      <section className="container py-16">
        <h2 className="text-3xl font-black text-[#3f2c20] md:text-4xl">Giá trị cốt lõi</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article className="rounded-md border border-[#ead8c3] bg-white p-6" key={value.title}>
              <h3 className="text-xl font-black text-[#3f2c20]">{value.title}</h3>
              <p className="mt-4 leading-7 text-[#6b4b37]">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#7a3f2a] py-16 text-white">
        <div className="container">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7dcc8] text-[#7a3f2a]">
              <Mail aria-hidden className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-black md:text-4xl">Liên hệ BIE SHOP</h2>
            <p className="text-[#f7dcc8]">
              Nhắn cho shop để đặt hàng, hỏi mẫu riêng hoặc trao đổi về quà tặng handmade.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((contact) => (
              <a
                className="rounded-md border border-white/20 bg-white/10 p-5 transition hover:bg-white/15"
                href={contact.href}
                key={contact.label}
                rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
              >
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f7dcc8]">
                  {contact.label}
                </p>
                <p className="mt-2 font-bold text-white">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
