'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clonePlan, getMarketPlan, type PublicPlan } from '@/lib/api'
import { useAuth } from '@/context/auth-context'
import { ItineraryTimeline } from './itinerary-timeline'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function MarketPlanDetail({
  planId,
  initialPlan,
}: {
  planId: string
  initialPlan?: PublicPlan
}) {
  const router = useRouter()
  const { user, status, signIn } = useAuth()
  const [plan, setPlan] = useState<PublicPlan | null>(initialPlan ?? null)
  const [isLoading, setIsLoading] = useState(initialPlan === undefined)
  const [error, setError] = useState<string | null>(null)
  const [isCloning, setIsCloning] = useState(false)
  const [cloneError, setCloneError] = useState<string | null>(null)

  async function handleClone() {
    if (!user) {
      signIn(`/market/${planId}`)
      return
    }
    setIsCloning(true)
    setCloneError(null)
    try {
      const clonedPlan = await clonePlan(planId)
      window.sessionStorage.setItem('planrcm_clone_notice', 'Sao chép plan thành công. Bạn có thể tùy chỉnh bản riêng của mình.')
      router.push(`/plans/${clonedPlan.id}`)
    } catch (caughtError) {
      setCloneError(caughtError instanceof Error ? caughtError.message : 'Không thể sao chép plan này.')
    } finally {
      setIsCloning(false)
    }
  }

  useEffect(() => {
    if (initialPlan !== undefined) {
      return
    }

    let active = true

    void getMarketPlan(planId)
      .then((response) => {
        if (active) {
          setPlan(response)
        }
      })
      .catch((caughtError) => {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Không thể tải plan này.')
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [initialPlan, planId])

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm" aria-live="polite" role="status">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Đang tải lịch trình chi tiết...</p>
        </div>
      </section>
    )
  }

  if (!plan || error) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center" role="alert">
        <span className="text-4xl">⛵</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Plan này không tồn tại hoặc đã gỡ</h1>
        {error && <p className="mt-2 text-xs text-slate-500">{error}</p>}
        <div className="mt-6">
          <a href="/market" className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all">
            <span>← Quay lại Market Plan</span>
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <a href="/market" className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors mb-6">
        <span>← Quay lại tất cả Market Plan</span>
      </a>

      {/* Author & Actions Card */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {plan.author.avatarUrl ? (
            <img src={plan.author.avatarUrl} alt="" className="h-12 w-12 rounded-full border border-sky-200 object-cover shadow-sm" referrerPolicy="no-referrer" />
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-sm" aria-hidden="true">
              {plan.author.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-sm font-bold text-slate-900">Plan của {plan.author.name}</p>
            <p className="text-xs text-slate-500">Đã đăng ngày {formatDate(plan.publishedAt)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <button
            type="button"
            onClick={() => void handleClone()}
            disabled={isCloning || status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600 active:scale-98 transition-all disabled:opacity-60"
          >
            <span>{isCloning ? 'Đang sao chép...' : user ? 'Sao chép về Plan của tôi 📋' : 'Đăng nhập để sao chép'}</span>
          </button>
          {cloneError && <p role="alert" className="text-xs text-rose-500">{cloneError}</p>}
        </div>
      </div>

      <ItineraryTimeline itinerary={plan.itinerary} eyebrow="Plan Cộng Đồng" />
    </section>
  )
}
