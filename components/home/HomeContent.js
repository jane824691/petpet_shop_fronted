'use client'

import { useRouter } from 'next/navigation'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import styles from '@/css/home.module.css'
import Link from 'next/link'
import ProductList from '@/components/product/ProductList'

export default function HomeContent({ products }) {
  const router = useRouter()
  const intl = useIntl()

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.keyVisualWithText}>
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
              <ProductList products={products} />
            </div>

            <div className="d-flex justify-content-center p-4 mt-4">
              <button
                type="button"
                className="btn btn-success btn-lg rounded-5 text-white fs-3  px-5 py-2"
                onClick={() => {
                  router.push('/product/list')
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
