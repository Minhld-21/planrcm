export function SiteFooter() {
  return (
    <footer className="border-t-4 border-black bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <p className="font-mono text-xs font-medium tracking-[0.18em] uppercase">PlanRCM / 2026</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Một công cụ để đưa quyết định từ ý định sang hành động có cấu trúc.
          </p>
        </div>
        <a
          href="/#tao-ke-hoach"
          className="font-mono self-start border-b border-white pb-1 text-xs font-medium tracking-[0.14em] uppercase transition-none hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
        >
          Lên đầu trang —
        </a>
      </div>
    </footer>
  )
}
