import type { Metadata } from 'next'
import { HomeHero } from '@/components/home-hero'

export const metadata: Metadata = {
  title: 'Lập lịch trình du lịch với AI',
  description:
    'Cho phép vị trí để nhận lịch trình du lịch hợp lý, phù hợp với thời gian và phong cách của bạn.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PlanRCM | Lập lịch trình du lịch với AI',
    description: 'Biến vị trí hiện tại thành một hành trình có thể thực hiện.',
    locale: 'vi_VN',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PlanRCM',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  inLanguage: 'vi',
  description: 'Ứng dụng AI hỗ trợ tạo lịch trình du lịch từ vị trí hiện tại.',
}

const principles = [
  {
    number: '01',
    title: 'Từ điểm đến',
    detail: 'Chọn nơi bạn sắp đến để có một hành trình sẵn sàng ngay cả khi chưa khởi hành.',
  },
  {
    number: '02',
    title: 'Theo nhịp của bạn',
    detail: 'Chọn ẩm thực, trải nghiệm hình ảnh hoặc nhịp độ chậm để thay đổi trọng tâm.',
  },
  {
    number: '03',
    title: 'Theo từng ngày',
    detail: 'Mỗi điểm dừng có thời gian, địa điểm và thứ tự rõ ràng để dễ điều chỉnh.',
  },
]

export default function Home() {
  return (
    <main id="main-content" className="overflow-hidden bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeHero />

      <section id="tao-ke-hoach" className="scroll-mt-6 border-b-4 border-black bg-white">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-12">
          <div className="texture-diagonal border-b-2 border-black px-5 py-12 sm:px-8 lg:col-span-4 lg:border-r-2 lg:border-b-0 lg:px-12 lg:py-20">
            <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">01 / Điểm đến</p>
            <h2 className="font-display mt-6 text-5xl leading-[0.9] tracking-tight sm:text-6xl">Đặt nơi bạn muốn đi lên bàn.</h2>
          </div>
          <div className="px-5 py-12 sm:px-8 lg:col-span-8 lg:px-12 lg:py-20">
            <p className="font-display max-w-3xl text-4xl leading-[0.95] tracking-tight sm:text-6xl">Một hành trình đáng tin bắt đầu từ điểm đến rõ ràng.</p>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              Nhập thành phố, tỉnh hoặc một địa điểm cụ thể để PlanRCM sắp xếp kế hoạch trước khi bạn đến. Vị trí hiện tại vẫn là một lựa chọn khi bạn muốn khám phá quanh mình.
            </p>
            <a href="#main-content" className="font-mono mt-8 inline-block border-b-2 border-black pb-1 text-xs font-medium tracking-[0.14em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black">Chọn điểm đến ở đầu trang —</a>
          </div>
        </div>
      </section>

      <section id="phuong-phap" className="scroll-mt-6 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-7 border-b-2 border-black pb-12 lg:grid-cols-12 lg:items-end">
            <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase lg:col-span-3">02 / Phương pháp</p>
            <h2 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-6xl lg:col-span-7">Từ điểm đến sang một trật tự có thể kiểm chứng.</h2>
          </div>
          <div className="mt-0 grid border-l border-black md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number} className="group min-h-72 border-r border-b border-black bg-white p-6 transition-colors duration-100 hover:bg-black hover:text-white md:border-b-0 md:p-8">
                <p className="font-mono text-xs font-medium tracking-[0.15em]">{principle.number}</p>
                <h3 className="font-display mt-16 text-4xl leading-none tracking-tight">{principle.title}</h3>
                <p className="mt-5 max-w-xs leading-7 text-muted transition-colors duration-100 group-hover:text-white/75">{principle.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nguyen-tac" className="texture-invert bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-5 py-16 sm:px-8 md:flex-row md:items-end lg:px-12 lg:py-24">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">Bắt đầu từ một điểm đến</p>
            <h2 className="font-display mt-6 max-w-3xl text-5xl leading-[0.88] tracking-tight sm:text-7xl">Để chuyến đi tự tìm thấy nhịp của nó.</h2>
          </div>
          <a href="#main-content" className="font-mono inline-flex min-h-11 shrink-0 items-center border-2 border-white bg-white px-5 py-3 text-xs font-medium tracking-[0.14em] text-black uppercase transition-none hover:bg-black hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Khám phá ngay <span className="ml-3 text-base leading-none" aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
}
