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
      setPlans((currentPlans) => currentPlans.map((currentPlan) => currentPlan.id === updatedPlan.id ? updatedPlan : currentPlan))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Không thể cập nhật trạng thái chia sẻ.')
    } finally {
      setUpdatingPlanId(null)
    }
  }

  if (status === 'loading') {
    return (
      <section className="texture-grid grid min-h-72 place-items-center border-2 border-black px-6 py-10 text-center" role="status">
        <p className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">Đang mở lịch sử plan...</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="texture-grid border-2 border-black p-8 sm:p-12">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">Plan của tôi</p>
        <h1 className="font-display mt-5 max-w-2xl text-4xl leading-[0.9] tracking-tight sm:text-6xl">Đăng nhập để xem và chia sẻ các plan đã lưu.</h1>
        <p className="mt-5 max-w-xl leading-7 text-muted">Lịch trình khách không được lưu. Khi đăng nhập Google, mỗi itinerary mới sẽ nằm trong lịch sử riêng của bạn.</p>
        <button type="button" onClick={() => signIn('/plans')} className="font-mono mt-8 min-h-11 border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black">Đăng nhập Google ↗</button>
      </section>
    )
  }

  return (
    <section>
      <header className="grid gap-6 border-b-4 border-black pb-8 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.16em] uppercase">Lịch sử riêng tư</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.86] tracking-tight sm:text-7xl">Plan của tôi</h1>
        </div>
        <p className="max-w-sm border-l-2 border-black pl-4 text-sm leading-6 text-muted">Bạn quyết định plan nào xuất hiện trong Market. Tắt chia sẻ để gỡ ngay khỏi danh sách công khai.</p>
      </header>

      {error && <div role="alert" className="mt-7 border-2 border-black bg-surface p-5"><p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase">Không thể cập nhật</p><p className="mt-2 leading-7">{error}</p></div>}

      {isLoading && <div className="grid gap-0 border-l-2 border-black md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="min-h-56 border-r-2 border-b-2 border-black bg-surface p-6 animate-pulse"><div className="h-3 w-24 bg-black/15" /><div className="mt-10 h-10 max-w-64 bg-black/15" /><div className="mt-10 h-10 w-36 bg-black/15" /></div>)}</div>}

      {!isLoading && plans.length === 0 && (
        <div className="texture-grid border-b-2 border-black px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">Chưa có lịch sử</p>
          <h2 className="font-display mt-5 max-w-2xl text-4xl leading-[0.9] tracking-tight sm:text-6xl">Tạo plan đầu tiên của bạn.</h2>
          <a href="/#tao-ke-hoach" className="font-mono mt-8 inline-flex min-h-11 items-center border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black">Tạo lịch trình →</a>
        </div>
      )}

      {!isLoading && plans.length > 0 && (
        <div className="grid border-l-2 border-black md:grid-cols-2">
          {plans.map((plan) => {
            const isPublic = plan.visibility === 'public'
            const isUpdating = updatingPlanId === plan.id

            return (
              <article key={plan.id} className={`flex min-h-72 flex-col border-r-2 border-b-2 border-black p-5 sm:p-7 ${isPublic ? 'bg-black text-white' : 'bg-white'}`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase">{formatDate(plan.createdAt)}</p>
                  <span className="font-mono border border-current px-2 py-1 text-[9px] font-medium tracking-[0.1em] uppercase">{isPublic ? 'Đang chia sẻ' : 'Riêng tư'}</span>
                </div>
                <h2 className="font-display mt-10 text-4xl leading-[0.9] tracking-tight sm:text-5xl">{plan.itinerary.destination}</h2>
                <p className={`font-mono mt-4 text-[10px] font-medium tracking-[0.1em] uppercase ${isPublic ? 'text-white/70' : 'text-muted'}`}>{plan.itinerary.totalDays} ngày · {plan.itinerary.theme.join(' / ') || 'Hành trình tự do'}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-current pt-5">
                  {isPublic ? <a href={`/market/${plan.id}`} className="font-mono min-h-11 border-b-2 border-current py-2 text-[10px] font-medium tracking-[0.1em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Xem công khai ↗</a> : <span />}
                  <button type="button" onClick={() => void toggleVisibility(plan)} disabled={isUpdating} className={`font-mono min-h-11 border-2 px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 disabled:cursor-wait disabled:opacity-60 ${isPublic ? 'border-white bg-white text-black hover:bg-black hover:text-white focus-visible:outline-white' : 'border-black bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black'}`}>{isUpdating ? 'Đang cập nhật' : isPublic ? 'Gỡ khỏi Market' : 'Chia sẻ lên Market'}</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
