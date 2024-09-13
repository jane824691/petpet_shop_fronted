import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../css/home.module.css'
import ReactBsCarousel from '@/components/product/ReactBsCarousel'
import Link from 'next/link'
import ProductList from '@/pages/product/components/ProductList'
import { useRouter } from 'next/router'
import { PRODUCT_RECOMMEND } from '@/components/my-const'
import SwiperPhoto from '@/components/product/Swiper'

export default function Home() {
  const [products, setProducts] = useState([])
  const router = useRouter()

    const getRecommendProductData = async () => {
      try {
        const r = await fetch(PRODUCT_RECOMMEND)
        const d = await r.json()
        setProducts(d)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  
    useEffect(() => {
      getRecommendProductData()
    }, [])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.keyVisualWithText}>
        {/* Next.js 的 <Image> 組件要求明確指定 width, height 屬性 */}
          <Image
              src="/pics/homepage_act.gif"
              width={1000}
              height={700} 
              alt="key Visual Img"
              className={styles.keyVisualImg}
            />

            <div className={styles.descriptionPart}>
              <h2>專屬的寵物天堂!! <br/><span className='notify-info'>電商平台Demo</span></h2>
              <span>
              在這裡，我們為寵物提供一站式服務。從最新的寵物用品到專業的寵物日記和論壇,我們致力於打造一個暖暖的、有趣且充滿愛的線上社區。立即探索我們的寵物商城。與我們一同與毛孩享受愛與陪伴的美好。

              </span>
              <Link href="/member/login">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg pro-shadow rounded-5"
                  style={{ width: 250 }}
                >
                  加入我們
                </button>
              </Link>
            </div>
          </div>

          <SwiperPhoto />
          {/* <ReactBsCarousel /> */}
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-md-4 g-4 px-5 mx-5">
              <ProductList products={products} />
            </div>
              <div className='d-flex justify-content-center p-4 mt-4'>
                <button
                  type="button"
                  className="btn btn-danger btn-lg rounded-5 text-white fs-3  px-5 py-2"
                  onClick={() => {
                    router.push('../product/list')
                  }}>
                  商城購物去
                </button>
              </div>
          </div>

        </div>
      </main>
    </>
  )
}
