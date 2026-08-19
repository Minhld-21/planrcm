'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useLocation } from '@/context/location-context'
import { PlaceAutocomplete } from './place-autocomplete'
import type { PlaceResult } from '@/lib/api'

export function HomeHero() {
  const router = useRouter()
  const { setLocation } = useLocation()
  const { user, status, signIn, error: authError, clearError } = useAuth()
  const [destination, setDestination] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [durationDays, setDurationDays] = useState(2)
  const [budgetRange, setBudgetRange] = useState('none')
  const [isRequesting, setIsRequesting] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  function clearErrors() {
    setLocationError(null)
    clearError()
  }

  function planForDestination(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearErrors()
    const selectedDestination = destination.trim()

    if (selectedDestination.length < 2) {
      setLocationError('Hãy nhập tên tỉnh, thành phố hoặc địa điểm bạn muốn đến')
      return
    }

    setLocation({
      kind: 'destination',
      label: selectedDestination,
      ...(selectedPlace
        ? { placeId: selectedPlace.placeId, lat: selectedPlace.lat, lng: selectedPlace.lng, googleMapsUrl: selectedPlace.googleMapsUrl }
        : {}),
      durationDays,
      ...budgetValues(budgetRange),
    })
    router.push('/itinerary')
  }

  function requestLocation() {
    clearErrors()
    if (!('geolocation' in navigator)) {
      setLocationError('Trình duyệt không hỗ trợ lấy vị trí hiện tại')
      return
    }

    setIsRequesting(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          kind: 'current',
          label: 'Vị trí hiện tại',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          durationDays,
          ...budgetValues(budgetRange),
        })
        router.push('/itinerary')
      },
      () => {
        setIsRequesting(false)
        setLocationError('Không thể lấy vị trí. Bạn vẫn có thể nhập điểm đến để lên kế hoạch trước.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-32">
      <div className="absolute -left-32 top-6 h-[28rem] w-[28rem] rounded-[58%_42%_67%_33%_/_45%_58%_42%_55%] bg-sky-100/70 blur-3xl" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-[35%_65%_47%_53%_/_50%_35%_65%_50%] bg-amber-100/80 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,.95fr)] lg:gap-16">
          <div className="max-w-2xl">
            <span className="organic-kicker">Trợ lý lập kế hoạch bằng AI</span>
            <h1 className="mt-6 font-display text-[clamp(3.1rem,6vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.055em] text-slate-900">
              Đi theo <span className="text-sky-600">nhịp của bạn.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Nói cho PlanRCM biết bạn muốn đi đâu. Chúng mình sẽ sắp xếp thời gian, chi phí và những trải nghiệm hợp gu thành một hành trình nhẹ tênh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-extrabold text-slate-600">
              <span className="organic-chip px-3.5 py-2">✦ Theo nhịp cá nhân</span>
              <span className="organic-chip px-3.5 py-2">✦ Có tuyến đường rõ ràng</span>
              <span className="organic-chip px-3.5 py-2">✦ Dễ chỉnh sửa</span>
            </div>
          </div>

          <form onSubmit={planForDestination} className="organic-card relative p-5 sm:p-7" aria-labelledby="destination-heading">
            <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-[56%_44%_31%_69%_/_52%_54%_46%_48%] bg-amber-100 sm:block" />
            <div className="relative">
              <span className="organic-kicker">Bắt đầu hành trình</span>
              <h2 id="destination-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900">
                Bạn muốn gặp nơi nào tiếp theo?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Chọn một điểm đến, khoảng thời gian và mức chi tiêu bạn thấy thoải mái.</p>

              <div className="mt-6 space-y-4">
                <PlaceAutocomplete
                  id="destination"
                  value={destination}
                  onChange={(value) => {
                    setDestination(value)
                    setSelectedPlace(null)
                  }}
                  onSelect={setSelectedPlace}
                  label="Điểm đến"
                  placeholder="Ví dụ: Đà Lạt, Phú Quốc..."
                  className="relative z-30 min-w-0"
                  inputClassName="organic-input w-full px-5 text-base font-bold placeholder:text-slate-400"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-[1.5rem] border border-slate-200 bg-white/60 px-4 py-3 transition-colors focus-within:border-sky-400 focus-within:bg-white">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Thời gian</span>
                    <select value={durationDays} onChange={(event) => setDurationDays(Number(event.target.value))} className="mt-1 w-full bg-transparent text-sm font-extrabold text-slate-900 outline-none">
                      {[1, 2, 3, 4, 5, 6, 7].map((days) => <option key={days} value={days}>{days} ngày {days > 1 ? `${days - 1} đêm` : ''}</option>)}
                    </select>
                  </label>
                  <label className="rounded-[1.5rem] border border-slate-200 bg-white/60 px-4 py-3 transition-colors focus-within:border-sky-400 focus-within:bg-white">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Ngân sách</span>
                    <select value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-extrabold text-slate-900 outline-none">
                      <option value="none">Chưa chọn</option>
                      <option value="under-1">Dưới 1 triệu VND</option>
                      <option value="1-3">1 – 3 triệu VND</option>
                      <option value="3-5">3 – 5 triệu VND</option>
                      <option value="5-10">5 – 10 triệu VND</option>
                      <option value="over-10">Trên 10 triệu VND</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className="organic-primary w-full text-sm sm:text-base">
                  <span>Tạo lịch trình cho tôi</span><span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-bold text-slate-600">Hoặc để AI gợi ý từ nơi bạn đang đứng.</p>
                <button type="button" onClick={requestLocation} disabled={isRequesting} className="organic-ghost min-h-0 self-start px-0 py-1 text-xs disabled:opacity-60">
                  <span>⌖ {isRequesting ? 'Đang lấy vị trí...' : 'Dùng vị trí hiện tại'}</span><span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {!user && status !== 'loading' && (
          <div className="relative mt-6 flex flex-col items-start justify-between gap-3 rounded-[1.5rem] border border-amber-200 bg-amber-50/80 px-5 py-4 text-xs text-amber-800 sm:flex-row sm:items-center">
            <p><strong>Chế độ xem thử.</strong> Đăng nhập Google để lưu và tùy chỉnh các kế hoạch riêng.</p>
            <button type="button" onClick={() => signIn('/')} className="organic-secondary min-h-10 px-4 text-xs">Đăng nhập Google ↗</button>
          </div>
        )}
      </div>

      {(locationError || authError) && (
        <div role="alert" className="fixed bottom-5 right-5 z-[65] flex max-w-sm items-center justify-between gap-4 rounded-[1.5rem] bg-slate-900 px-5 py-4 text-xs font-bold text-white shadow-2xl">
          <span>{locationError ?? authError}</span>
          <button type="button" onClick={clearErrors} className="rounded-full bg-white/15 px-3 py-2 text-white hover:bg-white/25">Đóng</button>
        </div>
      )}
    </section>
  )
}

function budgetValues(range: string) {
  const ranges: Record<string, { budgetMin?: number; budgetMax?: number; currency?: string }> = {
    'under-1': { budgetMax: 1_000_000, currency: 'VND' },
    '1-3': { budgetMin: 1_000_000, budgetMax: 3_000_000, currency: 'VND' },
    '3-5': { budgetMin: 3_000_000, budgetMax: 5_000_000, currency: 'VND' },
    '5-10': { budgetMin: 5_000_000, budgetMax: 10_000_000, currency: 'VND' },
    'over-10': { budgetMin: 10_000_000, currency: 'VND' },
  }
  return ranges[range] ?? {}
}
