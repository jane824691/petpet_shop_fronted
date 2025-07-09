import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../css/home.module.css'
import Link from 'next/link'
import ProductList from '@/pages/product/components/ProductList'
import { useRouter } from 'next/router'
import { PRODUCT_RECOMMEND } from '@/components/my-const'
import { useIntl } from 'react-intl'

export default function Home() {
  const [products, setProducts] = useState([])
  const router = useRouter()
  const intl = useIntl()
  const lang = intl.locale

  const getRecommendProductData = async () => {
    try {
      const r = await fetch(PRODUCT_RECOMMEND + `?lang=${lang}`, {
        headers: {
          'Accept-Language': lang, // 很多後端（尤其是 Express、NestJS、Spring Boot 等）會優先判斷 Accept-Language header，而不是 query string 
        },
      })
      const d = await r.json()
      setProducts(d)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getRecommendProductData()
  }, [lang])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.keyVisualWithText}>
            {/* Next.js 的 <Image> 組件要求明確指定 width, height 屬性 */}
            <Image
              src="/pics/homepage_act.gif"
              width={700}
              height={525}
              alt="key Visual Img"
              className={`${styles.keyVisualImg} w-100`}
              style={{ height: 'auto' }} // 自動適應容器大小
              unoptimized
            />

            <div className={styles.descriptionPart}>
              <h2 className={styles.descriptionTitle}>
                {intl.formatMessage({ id: 'home.title' })} <br />
                <span className="notify-info">{intl.formatMessage({ id: 'home.subtitle' })}</span>
              </h2>
              <span className={styles.descriptionText}>
                {intl.formatMessage({ id: 'home.description' })}
              </span>
              <Link href="/member/login">
                <button
                  type="button"
                  className={`btn btn-outline-primary bg-white btn-lg pro-shadow rounded-5 px-2 px-sm-5 ${styles.joinUsBtn}`}
                >
                  {intl.formatMessage({ id: 'home.joinUs' })}
                </button>
              </Link>
            </div>
          </div>
          <div
            className={`container-fluid ${styles.cardPart} w-100`}
            style={{ padding: '0' }}
          >
            <h2 className='text-center mb-5 text-success'><i className="bi bi-cart fs-2 pe-2"></i>{intl.formatMessage({ id: 'home.featuredProducts' })}</h2>
            <div className={`row row-cols-2 row-cols-sm-4 g-4 px-2 px-sm-5 ${styles.cardBorder} d-flex justify-content-center align-items-center`} style={{ minWidth: '100vw' }}>
              <ProductList products={products} />
            </div>

            <div className="d-flex justify-content-center p-4 mt-4">
              <button
                type="button"
                className="btn btn-success btn-lg rounded-5 text-white fs-3  px-5 py-2"
                onClick={() => {
                  router.push('../product/list')
                }}
              >
                {intl.formatMessage({ id: 'home.goShopping' })}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
