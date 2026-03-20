import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ONE_PRODUCT } from '@/components/my-const'
import ProductDetailClient, { ProductData } from './ProductDetailClient'

interface ProductDetailPageProps {
  params: {
    pid: string
  }
}

async function fetchProduct(
  pid: number,
  acceptLanguage: string
): Promise<ProductData | null> {
  try {
    const response = await fetch(`${ONE_PRODUCT}/${pid}`, {
      headers: {
        'Accept-Language': acceptLanguage,
      },
      cache: 'no-store',
    })

    if (!response.ok) return null
    return (await response.json()) as ProductData
  } catch (error) {
    console.error('SSR fetchProduct failed:', error)
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const pid = Number(params.pid)
  if (!Number.isFinite(pid)) {
    notFound()
  }

  const acceptLanguage = headers().get('accept-language') ?? 'zh-TW'
  const product = await fetchProduct(pid, acceptLanguage)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient pid={pid} initialProduct={product} />
}

