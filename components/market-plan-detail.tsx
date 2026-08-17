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
      <section className="texture-grid grid min-h-80 place-items-center border-2 border-black px-6 py-12 text-center" aria-live="polite" role="status">
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">Market Plan</p>
          <p className="font-display mt-4 text-3xl leading-tight tracking-tight sm:text-5xl">Đang mở itinerary...</p>
        </div>
      </section>
    )
  }

  if (!plan || error) {
    return (
      <section className="texture-grid border-2 border-black p-8 sm:p-12" role="alert">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">Không thể mở plan</p>
        <h1 className="font-display mt-5 max-w-2xl text-4xl leading-[0.9] tracking-tight sm:text-6xl">Plan này đã được gỡ khỏi Market hoặc không tồn tại.</h1>
        {error && <p className="mt-5 max-w-xl leading-7 text-muted">{error}</p>}
        <a href="/market" className="font-mono mt-8 inline-flex min-h-11 items-center border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black">Về Market Plan ←</a>
      </section>
    )
  }

  return (
    <section>
      <a href="/market" className="font-mono mb-8 inline-flex min-h-11 items-center border-b-2 border-black py-2 text-[10px] font-medium tracking-[0.12em] uppercase hover:bg-black hover:px-2 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black">← Tất cả Market Plan</a>
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-y-2 border-black py-4">
        {plan.author.avatarUrl ? (
          <img src={plan.author.avatarUrl} alt="" className="h-10 w-10 border border-black object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="font-mono grid h-10 w-10 place-items-center border border-black text-[10px] font-medium" aria-hidden="true">{plan.author.name.slice(0, 1).toUpperCase()}</span>
        )}
        <p className="text-sm">Chia sẻ bởi <span className="font-medium">{plan.author.name}</span></p>
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted uppercase">Đăng {formatDate(plan.publishedAt)}</span>
        <button type="button" onClick={() => void handleClone()} disabled={isCloning || status === 'loading'} className="font-mono min-h-11 border-2 border-black bg-black px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-white uppercase hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-60">
          {isCloning ? 'Đang sao chép...' : user ? 'Sao chép plan' : 'Đăng nhập để sao chép'}
        </button>
        {cloneError && <p role="alert" className="w-full text-sm leading-6">{cloneError}</p>}
      </div>
      <ItineraryTimeline itinerary={plan.itinerary} eyebrow="Plan cộng đồng" />
    </section>
  )
}
