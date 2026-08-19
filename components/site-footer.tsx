export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-sky-700 text-[var(--color-on-moss)]">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute -left-32 top-8 h-72 w-72 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-[var(--color-clay)]/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-on-moss)] p-2">
                <img src="/brand/planrcm-logo-organic.png" width="1254" height="1254" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="font-display text-3xl font-bold tracking-tight">PlanRCM</span>
            </div>
            <p className="mt-6 max-w-xl font-display text-2xl leading-tight text-[var(--color-on-moss)] sm:text-3xl">
              Đi thật chậm để nhìn thấy nhiều hơn.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-on-moss)]/78">
              Trợ lý AI giúp biến một điểm đến thành hành trình vừa vặn với thời gian, ngân sách và nhịp điệu của riêng bạn.
            </p>
          </div>

          <nav aria-label="Liên kết chân trang" className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-extrabold">
            <a href="/market" className="whitespace-nowrap text-[var(--color-on-moss)]/88 transition-colors hover:text-white">Market Plan</a>
            <a href="/#phuong-phap" className="whitespace-nowrap text-[var(--color-on-moss)]/88 transition-colors hover:text-white">Cách PlanRCM làm việc</a>
            <a href="/#tao-ke-hoach" className="whitespace-nowrap text-[var(--color-on-moss)]/88 transition-colors hover:text-white">Tạo hành trình</a>
            <a href="#main-content" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-[var(--color-on-moss)]/35 px-4 text-[var(--color-on-moss)] transition-colors hover:bg-[var(--color-on-moss)] hover:text-sky-700">Về đầu trang ↑</a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-on-moss)]/20 pt-5 text-xs text-[var(--color-on-moss)]/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PlanRCM. Lập lịch trình thông minh với Gemini AI.</p>
          <p>Thiết kế cho những chuyến đi có chủ đích.</p>
        </div>
      </div>
    </footer>
  )
}
