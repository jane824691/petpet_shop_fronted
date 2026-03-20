import { PRODUCT_RECOMMEND } from '@/components/my-const'
import HomeContent from '@/components/home/HomeContent'

async function getProducts(lang = 'zh-TW') {
  try {
    const res = await fetch(PRODUCT_RECOMMEND, {
      headers: {
        'Accept-Language': lang,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts('zh-TW')
  return <HomeContent products={products} />
}

