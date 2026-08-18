export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-800 bg-[#0F172A] text-slate-400">
      {/* Subtle dot pattern texture */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white font-bold text-sm shadow-accent">
                ✈️
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">PlanRCM</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-slate-400 leading-relaxed font-sans">
              Trợ lý AI lập kế hoạch du lịch thông minh. Biến mọi ý tưởng chuyến đi thành hành trình thực tế chi tiết từng mốc thời gian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300 font-sans">
            <a href="/market" className="hover:text-[#4D7CFF] transition-colors">
              Market Plan
            </a>
            <a href="/#phuong-phap" className="hover:text-[#4D7CFF] transition-colors">
              Phương pháp
            </a>
            <a href="/#tao-ke-hoach" className="hover:text-[#4D7CFF] transition-colors">
              Tạo kế hoạch
            </a>
            <a
              href="#main-content"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-white hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              <span>Về đầu trang</span>
              <span>↑</span>
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 font-mono gap-3">
          <p>© 2026 PlanRCM. Lập lịch trình thông minh với Gemini AI.</p>
          <p className="text-slate-400">Minimalist Modern Design System</p>
        </div>
      </div>
    </footer>
  )
}
