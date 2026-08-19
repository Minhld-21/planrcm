import type { Metadata } from 'next'
import { HomeHero } from '@/components/home-hero'

export const metadata: Metadata = {
  title: 'Lập lịch trình du lịch thông minh với AI',
  description: 'Nhận lịch trình du lịch tối ưu, phù hợp với thời gian và ngân sách của bạn với trợ lý AI PlanRCM.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PlanRCM | Lập lịch trình du lịch với AI',
    description: 'Biến ước mơ du lịch thành kế hoạch chi tiết từng ngày.',
    locale: 'vi_VN',
    type: 'website',
  },
}

const principles = [
  {
    icon: '⌖',
    title: 'Bắt đầu từ một nơi chốn',
    detail: 'Chọn thành phố, hòn đảo hay góc quen bạn muốn ghé. PlanRCM biến mong muốn đó thành một khởi đầu rõ ràng.',
    shape: 'rounded-[2.5rem_1.5rem_2.5rem_1.5rem]',
  },
  {
    icon: '◌',
    title: 'Chọn nhịp điệu của riêng bạn',
    detail: 'Ăn ngon, chụp ảnh, hay thong thả nghỉ ngơi — mỗi hành trình được điều chỉnh theo điều bạn thật sự muốn làm.',
    shape: 'rounded-[1.5rem_2.75rem_1.5rem_2.75rem]',
  },
  {
    icon: '↝',
    title: 'Mang theo một kế hoạch dễ sống',
    detail: 'Mỗi chặng đều có thời gian, địa điểm và lý do hợp lý để bạn có thể theo hoặc chỉnh lại ngay trên đường đi.',
    shape: 'rounded-[2.75rem_2rem_1.5rem_2.5rem]',
  },
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PlanRCM',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  inLanguage: 'vi',
  description: 'Ứng dụng AI hỗ trợ tạo lịch trình du lịch thông minh.',
}

export default function Home() {
  return (
    <main id="main-content" className="organic-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeHero />

      <section id="tao-ke-hoach" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-20">
          <div>
            <span className="organic-kicker">Một kế hoạch có chỗ để thở</span>
            <h2 className="mt-5 max-w-lg font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Bớt phải lo tính. Thêm thời gian để đi.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              PlanRCM sắp xếp các điểm dừng theo một hành trình hợp lý, để chuyến đi không bị lấp đầy bởi những việc phải tự ghép nối.
            </p>
            <a href="#main-content" className="organic-secondary mt-7 text-sm">Chọn điểm đến của bạn ↑</a>
          </div>

          <div className="organic-card relative overflow-hidden p-6 sm:p-9">
            <div className="absolute -right-14 -top-14 h-48 w-48 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-sky-100" />
            <div className="relative border-b border-slate-200 pb-6">
              <p className="text-xs font-extrabold tracking-[0.04em] text-sky-700">HÀNH TRÌNH ĐƯỢC SẮP THEO BẠN</p>
              <h3 className="mt-2 font-display text-3xl font-bold text-slate-900">Từ ý định đến từng điểm dừng.</h3>
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem_1.25rem_2rem_1.25rem] bg-sky-50 p-5">
                <span className="text-xl" aria-hidden="true">⌖</span>
                <p className="mt-3 font-bold text-slate-900">Đúng tuyến đường</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">Điểm dừng được sắp xếp theo vị trí thực tế, không phải ngẫu nhiên.</p>
              </div>
              <div className="rounded-[1.25rem_2rem_1.25rem_2rem] bg-amber-50 p-5">
                <span className="text-xl" aria-hidden="true">◒</span>
                <p className="mt-3 font-bold text-slate-900">Đúng mức chi</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">Bạn biết trước khoảng chi phí để yên tâm tận hưởng chuyến đi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="phuong-phap" className="scroll-mt-24 bg-[var(--color-paper-deep)]/70 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="organic-kicker">Một hành trình, ba điều quan trọng</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl">Đi xa vẫn thấy nhẹ nhàng.</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <article key={principle.title} className={`travel-card group flex min-h-72 flex-col justify-between p-7 sm:p-8 ${principle.shape} ${index === 1 ? 'md:translate-y-8' : ''}`}>
                <div className="flex items-start justify-between gap-5">
                  <span className="grid h-14 w-14 place-items-center rounded-[1.25rem] bg-sky-50 text-2xl text-sky-700 transition-colors group-hover:bg-sky-500 group-hover:text-white" aria-hidden="true">{principle.icon}</span>
                  <span className="font-display text-2xl font-bold text-amber-800/70">0{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold leading-tight text-slate-900">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{principle.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nguyen-tac" className="relative overflow-hidden bg-sky-700 px-5 py-20 text-[var(--color-on-moss)] sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="absolute inset-0 dot-pattern opacity-35" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-amber-100/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-5xl gap-10 rounded-[3rem_1.75rem_3rem_1.75rem] border border-white/15 bg-white/7 p-8 backdrop-blur-sm sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-white/80">Chuyến đi tiếp theo đang chờ</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl">Để AI lo phần sắp xếp.</h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">Bạn chỉ cần giữ lại phần quan trọng nhất: sự háo hức được lên đường.</p>
          </div>
          <a href="#main-content" className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-on-moss)] px-6 text-sm font-extrabold text-sky-700 transition-transform hover:scale-105 active:scale-95">Tạo một hành trình →</a>
        </div>
      </section>
    </main>
  )
}
