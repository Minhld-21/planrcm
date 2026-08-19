'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="organic-page grid min-h-screen place-items-center px-5 text-center">
      <div className="organic-card max-w-md p-8 sm:p-12">
        <p className="organic-kicker">Lỗi tải trang / 500</p>
        <h1 className="font-display mt-6 text-5xl font-bold leading-none tracking-tight text-slate-900">Không thể tiếp tục.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Hãy tải lại trang để thử lại yêu cầu của bạn.</p>
        <button
          type="button"
          onClick={reset}
          className="organic-primary mt-8 text-xs"
        >
          Thử lại →
        </button>
      </div>
    </main>
  )
}
