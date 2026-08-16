'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="texture-grid grid min-h-screen place-items-center bg-white px-5 text-center text-black">
      <div className="max-w-md border-4 border-black bg-white p-8 sm:p-12">
        <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">Lỗi tải trang / 500</p>
        <h1 className="font-display mt-6 text-5xl leading-none tracking-tight">Không thể tiếp tục.</h1>
        <p className="mt-5 text-lg leading-8 text-muted">Hãy tải lại trang để thử lại yêu cầu của bạn.</p>
        <button
          type="button"
          onClick={reset}
          className="font-mono mt-8 min-h-12 border-2 border-black bg-black px-6 py-3 text-xs font-medium tracking-[0.14em] text-white uppercase transition-none hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Thử lại —
        </button>
      </div>
    </main>
  )
}
