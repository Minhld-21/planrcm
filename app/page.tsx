import type { Metadata } from 'next'
import { HomeHero } from '@/components/home-hero'

export const metadata: Metadata = {
  title: 'Lập lịch trình du lịch thông minh với AI',
  description:
    'Nhận lịch trình du lịch tối ưu, phù hợp với thời gian và ngân sách của bạn với trợ lý AI PlanRCM.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PlanRCM | Lập lịch trình du lịch với AI',
    description: 'Biến ước mơ du lịch thành kế hoạch chi tiết từng ngày.',
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
  description: 'Ứng dụng AI hỗ trợ tạo lịch trình du lịch thông minh.',
}

const principles = [
  {
    number: '01',
    icon: '🎯',
    title: 'Từ điểm đến mơ ước',
    detail: 'Chọn thành phố hoặc nơi bạn sắp đến để nhận kế hoạch hoàn chỉnh ngay trước ngày khởi hành.',
  },
  {
    number: '02',
    icon: '☕',
    title: 'Theo nhịp cá nhân',
    detail: 'Lựa chọn trải nghiệm ẩm thực, check-in hoặc thư giãn nhịp độ chậm tùy theo ý thích.',
  },
  {
    number: '03',
    icon: '📅',
    title: 'Chi tiết theo thời gian',
    detail: 'Mỗi mốc lịch trình đều có thời gian, vị trí và gợi ý cụ thể để bạn dễ dàng tùy chỉnh.',
  },
]

export default function Home() {
  return (
    <main id="main-content" className="bg-[#F8FBFD] text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative z-20">
        <HomeHero />
      </div>

      {/* Feature Section 01 */}
      <section id="tao-ke-hoach" className="scroll-mt-10 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">01 / Định hướng chuyến đi</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Bắt đầu từ nơi bạn muốn đến.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Nhập thành phố hoặc danh thắng bạn dự định khám phá. Trợ lý AI PlanRCM sẽ tự động phân tích vị trí và lên lịch trình di chuyển hợp lý nhất cho chuyến đi của bạn.
              </p>
              <div className="mt-6">
                <a
                  href="#main-content"
                  className="inline-flex items-center gap-2 font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <span>Chọn điểm đến ở đầu trang</span>
                  <span>↑</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="travel-card rounded-3xl p-8 bg-white border border-slate-200 shadow-md">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-2xl text-sky-600">
                    🏔️
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Trải nghiệm du lịch thông minh</h3>
                    <p className="text-xs text-slate-500">Tiết kiệm thời gian lập kế hoạch thủ công</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-sky-50/70 p-4 border border-sky-100">
                    <span className="text-xs font-bold text-sky-700">📍 Đúng tọa độ địa lý</span>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">Các điểm dừng chân sắp xếp theo tuyến đường thuận tiện nhất.</p>
                  </div>
                  <div className="rounded-2xl bg-orange-50/70 p-4 border border-orange-100">
                    <span className="text-xs font-bold text-orange-700">💰 Dự toán ngân sách</span>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">Tối ưu chi phí ăn ở, đi lại trong hạn mức bạn đã chọn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 02 - Principles */}
      <section id="phuong-phap" className="scroll-mt-10 bg-white py-16 border-y border-slate-200/80 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">02 / Phương pháp thiết kế</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Từ ý tưởng tới kế hoạch thực tế
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              3 nguyên tắc giúp mọi hành trình du lịch diễn ra suôn sẻ và đáng nhớ.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="travel-card flex flex-col justify-between rounded-3xl bg-white p-7 border border-slate-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-100 text-xl">
                      {principle.icon}
                    </span>
                    <span className="text-xs font-bold text-sky-600">{principle.number}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{principle.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{principle.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="nguyen-tac" className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="hero-gradient rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-sky-500/20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                Bắt đầu hành trình của bạn
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Sẵn sàng cho chuyến đi tiếp theo?
              </h2>
              <p className="mt-3 text-sm text-white/90 leading-relaxed">
                Tạo lịch trình du lịch ngay bây giờ hoặc khám phá hàng trăm kế hoạch tuyệt vời từ cộng đồng.
              </p>
            </div>
            <a
              href="#main-content"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-sky-600 shadow-md hover:bg-sky-50 active:scale-98 transition-all"
            >
              <span>Lên Kế Hoạch Ngay</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
