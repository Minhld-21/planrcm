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
    <main id="main-content" className="bg-[#FAFAFA] text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <div className="relative z-20">
        <HomeHero />
      </div>

      {/* Feature Section 01 - Direction & Intelligence */}
      <section id="tao-ke-hoach" className="scroll-mt-10 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0052FF]/30 bg-[#0052FF]/5 px-4 py-1 font-mono text-xs uppercase tracking-[0.15em] text-[#0052FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF]" />
                <span>01 // Định hướng chuyến đi</span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-tight">
                Bắt đầu từ nơi bạn muốn đến.
              </h2>
              
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Nhập thành phố hoặc danh thắng bạn dự định khám phá. Trợ lý AI PlanRCM sẽ tự động phân tích vị trí và lên lịch trình di chuyển hợp lý nhất cho chuyến đi của bạn.
              </p>

              <div className="mt-7">
                <a
                  href="#main-content"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0052FF] hover:text-[#4D7CFF] transition-colors group"
                >
                  <span>Chọn điểm đến ở đầu trang</span>
                  <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Feature card with gradient border stroke effect */}
              <div className="gradient-border-card shadow-lg shadow-slate-900/5">
                <div className="gradient-border-inner p-8 sm:p-10">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-2xl text-white shadow-accent">
                      🏔️
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-sans">Trải nghiệm du lịch thông minh</h3>
                      <p className="text-xs text-slate-500 font-sans">Tự động hoá tối đa quy trình lập kế hoạch</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4.5 border border-slate-200/80 hover:border-[#0052FF]/30 transition-colors">
                      <span className="text-xs font-bold text-[#0052FF] font-sans">📍 Đúng tọa độ địa lý</span>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-sans">Các điểm dừng chân được sắp xếp tối ưu theo khoảng cách thực tế.</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4.5 border border-slate-200/80 hover:border-[#0052FF]/30 transition-colors">
                      <span className="text-xs font-bold text-[#0052FF] font-sans">💰 Dự toán ngân sách</span>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-sans">Kiểm soát và tối ưu chi phí ăn ở, đi lại trong hạn mức bạn đề ra.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 02 - Principles */}
      <section id="phuong-phap" className="scroll-mt-10 bg-white py-20 border-y border-slate-200/80 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0052FF]/30 bg-[#0052FF]/5 px-4 py-1 font-mono text-xs uppercase tracking-[0.15em] text-[#0052FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF]" />
              <span>02 // Phương pháp thiết kế</span>
            </div>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Từ ý tưởng tới kế hoạch thực tế
            </h2>

            <p className="mt-3 text-sm text-slate-600 font-sans">
              3 nguyên tắc giúp mọi hành trình du lịch diễn ra suôn sẻ và trọn vẹn nhất.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="travel-card group flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-xl text-white shadow-accent group-hover:scale-110 transition-transform">
                      {principle.icon}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#0052FF] tracking-widest">{principle.number}</span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 font-sans group-hover:text-[#0052FF] transition-colors">{principle.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 font-sans">{principle.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section (Inverted Contrast Dark Section) */}
      <section id="nguyen-tac" className="relative overflow-hidden bg-[#0F172A] py-20 lg:py-28 text-white">
        {/* Texture & Ambient Glows */}
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#0052FF]/20 blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-14 shadow-2xl backdrop-blur-md flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1 font-mono text-xs uppercase tracking-wider text-slate-300">
                <span>⚡ Bắt đầu hành trình</span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight">
                Sẵn sàng cho chuyến đi tiếp theo?
              </h2>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-sans">
                Tạo lịch trình du lịch cá nhân hoá ngay bây giờ hoặc khám phá hàng trăm kế hoạch tuyệt vời từ cộng đồng.
              </p>
            </div>

            <a
              href="#main-content"
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] px-8 py-4 text-sm font-bold text-white shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <span>Lên Kế Hoạch Ngay</span>
              <span aria-hidden="true" className="text-base">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
