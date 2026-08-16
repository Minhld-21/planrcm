import type { PublicPlan, PublicPlanSummary } from './api'

const backendUrl = (process.env.BACKEND_URL ?? 'http://localhost:3000').replace(/\/$/, '')

async function getPublicResource<T>(path: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${backendUrl}/api/v1${path}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return undefined
    }

    return response.json() as Promise<T>
  } catch {
    return undefined
  }
}

export function getMarketPlansForServer() {
  return getPublicResource<PublicPlanSummary[]>('/market/plans')
}

export function getMarketPlanForServer(planId: string) {
  return getPublicResource<PublicPlan>(`/market/plans/${encodeURIComponent(planId)}`)
}
