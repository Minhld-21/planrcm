import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { getMarketPlansForServer } from '@/lib/market-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const marketPlans = await getMarketPlansForServer()
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/market`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const marketEntries: MetadataRoute.Sitemap = (marketPlans ?? []).map((plan) => ({
    url: `${siteUrl}/market/${plan.id}`,
    lastModified: new Date(plan.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...marketEntries]
}
