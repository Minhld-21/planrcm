'use client'

import { useEffect, useState } from 'react'
import { getPlan, updatePlan, type SavedPlan } from '@/lib/api'
import type { Activity, ItineraryResponse } from '@/shared/interfaces'

const activityTypes: Activity['type'][] = ['food', 'sightseeing', 'relax', 'transport']

export function PlanEditor({ planId }: { planId: string }) {
  const [plan, setPlan] = useState<SavedPlan | null>(null)
  const [draft, setDraft] = useState<ItineraryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void getPlan(planId).then((value) => {
      setPlan(value)
      setDraft(structuredClone(value.itinerary))
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Không thể mở plan này.')).finally(() => setIsLoading(false))
  }, [planId])

  function update(next: ItineraryResponse) { setDraft(next); setMessage(null) }

  function setDuration(totalDays: number) {
    if (!draft) return
    const days = [...draft.days]
    while (days.length < totalDays) days.push({ dayNumber: days.length + 1, activities: [] })
    update({ ...draft, totalDays, durationDays: totalDays, days: days.slice(0, totalDays).map((day, index) => ({ ...day, dayNumber: index + 1 })) })
  }

  function changeActivity(dayIndex: number, activityIndex: number, patch: Partial<Activity>) {
    if (!draft) return
    update({ ...draft, days: draft.days.map((day, index) => index !== dayIndex ? day : { ...day, activities: day.activities.map((activity, activityPosition) => activityPosition === activityIndex ? { ...activity, ...patch } : activity) }) })
  }

  function addActivity(dayIndex: number) {
    if (!draft) return
    const activity: Activity = { id: crypto.randomUUID(), time: '09:00', title: 'Hoạt động mới', description: '', type: 'sightseeing', locationName: '', location: { name: '', googleMapsUrl: 'https://www.google.com/maps' } }
    update({ ...draft, days: draft.days.map((day, index) => index === dayIndex ? { ...day, activities: [...day.activities, activity] } : day) })
  }

  function removeActivity(dayIndex: number, activityIndex: number) {
    if (!draft) return
    update({ ...draft, days: draft.days.map((day, index) => index === dayIndex ? { ...day, activities: day.activities.filter((_, position) => position !== activityIndex) } : day) })
  }

  async function save() {
    if (!draft) return
    setIsSaving(true); setMessage(null)
    try {
      const saved = await updatePlan(planId, draft)
      setPlan(saved); setDraft(structuredClone(saved.itinerary)); setMessage('Đã lưu thay đổi.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể lưu thay đổi.') }
    finally { setIsSaving(false) }
  }

  if (isLoading) return <section className="texture-grid grid min-h-80 place-items-center border-2 border-black"><p className="font-display text-3xl">Đang mở plan...</p></section>
  if (!plan || !draft) return <section className="border-2 border-black p-8" role="alert"><p className="font-display text-3xl">Không thể mở plan.</p><p className="mt-3 text-muted">{message}</p><a className="mt-6 inline-block border-b-2 border-black" href="/plans">Về Plan của tôi</a></section>

  return <section>
    <a href="/plans" className="font-mono inline-flex min-h-11 items-center border-b-2 border-black py-2 text-[10px] font-medium tracking-[0.1em] uppercase">← Plan của tôi</a>
    <header className="mt-7 border-b-4 border-black pb-7"><p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">Plan riêng tư · có thể chỉnh sửa</p><h1 className="font-display mt-3 text-5xl leading-none tracking-tight sm:text-6xl">Tùy chỉnh hành trình</h1><p className="mt-4 max-w-2xl leading-7 text-muted">Thay đổi chỉ áp dụng cho bản của bạn. Plan Market gốc không bị ảnh hưởng.</p></header>
    <div className="mt-7 grid gap-4 border-b-2 border-black pb-7 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Điểm đến"><input value={draft.destination} onChange={(event) => update({ ...draft, destination: event.target.value })} /></Field>
      <Field label="Thời lượng"><select value={draft.totalDays} onChange={(event) => setDuration(Number(event.target.value))}>{[1,2,3,4,5,6,7].map((days) => <option key={days} value={days}>{days} ngày</option>)}</select></Field>
      <Field label="Ngân sách tối thiểu"><input type="number" min="0" value={draft.budgetMin ?? ''} onChange={(event) => update({ ...draft, budgetMin: event.target.value === '' ? undefined : Number(event.target.value) })} /></Field>
      <Field label="Ngân sách tối đa"><input type="number" min="0" value={draft.budgetMax ?? ''} onChange={(event) => update({ ...draft, budgetMax: event.target.value === '' ? undefined : Number(event.target.value) })} /></Field>
      <Field label="Tiền tệ"><input maxLength={3} value={draft.currency ?? 'VND'} onChange={(event) => update({ ...draft, currency: event.target.value.toUpperCase() })} /></Field>
      <Field label="Sở thích"><input value={draft.theme.join(', ')} onChange={(event) => update({ ...draft, theme: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></Field>
    </div>
    <div className="divide-y-2 divide-black border-b-2 border-black">
      {draft.days.map((day, dayIndex) => <section key={day.dayNumber} className="py-7"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-3xl">Ngày {day.dayNumber}</h2><button type="button" onClick={() => addActivity(dayIndex)} className="font-mono border-2 border-black px-3 py-2 text-[10px] font-medium tracking-[0.1em] uppercase hover:bg-black hover:text-white">+ Thêm hoạt động</button></div>
        <div className="mt-5 grid gap-4">{day.activities.map((activity, activityIndex) => <article key={activity.id} className="grid gap-3 border-2 border-black p-4 lg:grid-cols-[6rem_10rem_minmax(0,1fr)_auto]"><Field label="Giờ"><input value={activity.time} onChange={(event) => changeActivity(dayIndex, activityIndex, { time: event.target.value })} /></Field><Field label="Loại"><select value={activity.type} onChange={(event) => changeActivity(dayIndex, activityIndex, { type: event.target.value as Activity['type'] })}>{activityTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></Field><Field label="Tên hoạt động"><input value={activity.title} onChange={(event) => changeActivity(dayIndex, activityIndex, { title: event.target.value })} /></Field><button type="button" onClick={() => removeActivity(dayIndex, activityIndex)} className="font-mono self-end border-2 border-black px-3 py-2 text-[10px] font-medium uppercase hover:bg-black hover:text-white">Xóa</button><div className="lg:col-span-2"><Field label="Địa điểm"><input value={activity.locationName ?? activity.location.name} onChange={(event) => changeActivity(dayIndex, activityIndex, { locationName: event.target.value, location: { ...activity.location, name: event.target.value } })} /></Field></div><div className="lg:col-span-2"><Field label="Ghi chú"><textarea rows={2} value={activity.description} onChange={(event) => changeActivity(dayIndex, activityIndex, { description: event.target.value })} /></Field></div></article>)}</div>
      </section>)}
    </div>
    <div className="sticky bottom-4 mt-7 flex flex-wrap items-center gap-4 border-2 border-black bg-white p-4 shadow-sm"><button type="button" onClick={() => void save()} disabled={isSaving} className="font-mono min-h-11 border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.1em] text-white uppercase hover:bg-white hover:text-black disabled:opacity-60">{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>{message && <p role="status" className="text-sm">{message}</p>}</div>
  </section>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="font-mono grid gap-1 text-[10px] font-medium tracking-[0.1em] uppercase">{label}<span className="border-2 border-black bg-white px-3 py-2 [&>input]:w-full [&>input]:bg-transparent [&>input]:text-sm [&>input]:outline-none [&>select]:w-full [&>select]:bg-transparent [&>select]:text-sm [&>select]:outline-none [&>textarea]:w-full [&>textarea]:resize-y [&>textarea]:bg-transparent [&>textarea]:text-sm [&>textarea]:outline-none">{children}</span></label>
}
