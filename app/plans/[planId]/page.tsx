import type { Metadata } from 'next'
import { PlanEditor } from '@/components/plan-editor'

export const metadata: Metadata = {
  title: 'Chỉnh sửa plan',
  robots: { index: false, follow: false },
}

export default async function PlanEditorPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  return <main id="main-content" className="organic-page py-8 sm:py-12 lg:py-16"><div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12"><PlanEditor planId={planId} /></div></main>
}
