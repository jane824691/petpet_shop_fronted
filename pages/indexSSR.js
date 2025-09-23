import Image from 'next/image'
import styles from '../css/home.module.css'
import Link from 'next/link'
import ProductList from '@/pages/product/components/ProductList'
import { useRouter } from 'next/router'
import { PRODUCT_RECOMMEND } from '@/components/my-const'
import { useIntl } from 'react-intl'

// 1. Home 組件現在直接從 props 接收 products 資料
//    不再需要 useState 和 useEffect 來處理資料獲取
export default function Home({ products }) {
  const router = useRouter()
  const intl = useIntl()

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
              style={{ height: 'auto' }}
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
                  className={`btn btn-outline-primary bg-white btn-lg pro-shadow rounded-5 px-4 px-sm-5 ${styles.joinUsBtn}`}
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
              {/* ProductList 直接使用傳入的 products prop */}
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

// 2. 新增 getServerSideProps 函數
export async function getServerSideProps(context) {
  // 從 context 中獲取語系資訊，Next.js 會自動提供
  const lang = context.locale || context.defaultLocale

  try {
    // 3. 在伺服器端直接 fetch 資料
    // 注意：在伺服器端 fetch API 時，需要使用完整的 URL
    const res = await fetch(PRODUCT_RECOMMEND, {
      headers: {
        'Accept-Language': lang,
      },
    })
    const data = await res.json()

    // 4. 將獲取的資料透過 props 回傳給頁面組件
    return {
      props: {
        products: data,
      },
    }
  } catch (error) {
    console.error('Error fetching data in getServerSideProps:', error)
    // 如果出錯，可以回傳空的 props 或進行錯誤處理
    return {
      props: {
        products: [],
      },
    }
  }
}