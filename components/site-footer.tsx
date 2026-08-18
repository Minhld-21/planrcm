export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <span className="text-lg font-bold text-white tracking-tight">PlanRCM</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
              Trợ lý lập kế hoạch du lịch thông minh bằng AI. Biến mọi chuyến đi mơ ước thành hành trình thực tế chi tiết từng ngày.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
            <a href="/market" className="hover:text-sky-400 transition-colors">
              Market Plan
            </a>
            <a href="/#phuong-phap" className="hover:text-sky-400 transition-colors">
              Phương pháp
            </a>
            <a href="/#tao-ke-hoach" className="hover:text-sky-400 transition-colors">
              Tạo kế hoạch
            </a>
            <a
              href="#main-content"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-white hover:bg-slate-800 transition-colors"
            >
              <span>Về đầu trang</span>
              <span>↑</span>
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 PlanRCM. Lập lịch trình thông minh với Gemini AI.</p>
          <p>Thiết kế dành riêng cho trải nghiệm du lịch tuyệt vời.</p>
        </div>
      </div>
    </footer>
  )
}
