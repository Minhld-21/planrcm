'use client'

import { useCallback, useEffect, useState } from 'react'
import { getMyPlans, type SavedPlan, updatePlanVisibility } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function MyPlansWorkspace() {
  const { user, status, signIn } = useAuth()
  const [plans, setPlans] = useState<SavedPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const cloneNotice = window.sessionStorage.getItem('planrcm_clone_notice')
    if (cloneNotice) {
      setNotice(cloneNotice)
      window.sessionStorage.removeItem('planrcm_clone_notice')
    }
  }, [])

  const loadPlans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setPlans(await getMyPlans())
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Không thể tải lịch sử plan.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      void loadPlans()
    }
  }, [loadPlans, status])

  async function toggleVisibility(plan: SavedPlan) {
    setUpdatingPlanId(plan.id)
    setError(null)

    try {
      const updatedPlan = await updatePlanVisibility(plan.id, plan.visibility !== 'public')
      setPlans((currentPlans) =>
        currentPlans.map((currentPlan) => (currentPlan.id === updatedPlan.id ? updatedPlan : currentPlan))
      )
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Không thể cập nhật trạng thái chia sẻ.')
    } finally {
      setUpdatingPlanId(null)
    }
  }

  if (status === 'loading') {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm" role="status">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Đang mở lịch sử plan của bạn...</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <span className="text-4xl">🔑</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Đăng nhập để xem lịch sử chuyến đi
        </h1>
        <p className="mt-3 text-sm text-slate-600 max-w-lg">
          Lịch trình ở chế độ khách không tự động lưu. Khi đăng nhập bằng tài khoản Google, các bản kế hoạch sẽ được lưu trữ an toàn trong kho cá nhân của bạn.
        </p>
        <button
          type="button"
          onClick={() => signIn('/plans')}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-all"
        >
          <span>Đăng nhập Google</span>
          <span>↗</span>
        </button>
      </section>
    )
  }

  return (
    <section className="py-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Bộ Sưu Tập Cá Nhân</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Plan Của Tôi</h1>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Bạn toàn quyền bật/tắt chia sẻ lên Market Plan. Gỡ bỏ bất kỳ lúc nào nếu muốn giữ riêng tư.
        </p>
      </header>

      {error && (
        <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          ⚠️ {error}
        </div>
      )}
      {notice && (
        <div role="status" className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs font-bold text-sky-800">
          ✨ {notice}
        </div>
      )}

      {isLoading && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-64 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="mt-6 h-8 w-48 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-32 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <span className="text-4xl">🧳</span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Chưa có plan nào được lưu</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Hãy tạo chuyến đi đầu tiên và bắt đầu lên kế hoạch khám phá!
          </p>
          <a
            href="/#tao-ke-hoach"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all"
          >
            <span>Tạo Lịch Trình Mới</span>
            <span>→</span>
          </a>
        </div>
      )}

      {!isLoading && plans.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isPublic = plan.visibility === 'public'
            const isUpdating = updatingPlanId === plan.id

            return (
              <article
                key={plan.id}
                className="travel-card flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400">
                      Tạo ngày {formatDate(plan.createdAt)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        isPublic
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isPublic ? '🌐 Công Khai (Market)' : '🔒 Riêng Tư'}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
                    {plan.itinerary.destination}
                  </h2>

                  <p className="mt-2 text-xs font-semibold text-sky-600">
                    {plan.itinerary.totalDays} ngày · {plan.itinerary.theme.join(' / ') || 'Hành trình tự do'}
                  </p>

                  {(plan.itinerary.budgetMin !== undefined || plan.itinerary.budgetMax !== undefined) && (
                    <p className="mt-2 text-xs text-slate-500">
                      Ngân sách: <strong className="text-slate-700">{formatBudget(plan.itinerary.budgetMin, plan.itinerary.budgetMax, plan.itinerary.currency)}</strong>
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/plans/${plan.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-4 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500 hover:text-white transition-all"
                    >
                      <span>Tùy chỉnh</span>
                      <span>✏️</span>
                    </a>
                    {isPublic && (
                      <a
                        href={`/market/${plan.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <span>Xem Market</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggleVisibility(plan)}
                    disabled={isUpdating}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:opacity-60 ${
                      isPublic
                        ? 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    {isUpdating ? 'Đang lưu...' : isPublic ? 'Gỡ khỏi Market' : 'Chia sẻ Market 🌐'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function formatBudget(min?: number, max?: number, currency = 'VND') {
  const format = (value: number) => new Intl.NumberFormat('vi-VN').format(value)
  if (min !== undefined && max !== undefined) return `${format(min)} – ${format(max)} ${currency}`
  if (min !== undefined) return `từ ${format(min)} ${currency}`
  return `tối đa ${format(max ?? 0)} ${currency}`
}
