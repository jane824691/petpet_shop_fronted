import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../css/home.module.css'
import ReactBsCarousel from '@/components/product/ReactBsCarousel'
import ProductList from './OriginProductList'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <main>
        <div className="container ">
          <div style={{ display: 'flex' }}>

          <Image
              src="/pics/homepage_act.gif"
              width="1000"
              height="700"
              alt=""
              style={{borderRadius: '20%', marginRight: '40px'}}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '300px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              height="400"
            >
              <h2 style={{ marginBottom: '50px' }}>專屬的寵物天堂!!</h2>
              <span style={{ marginBottom: '50px' }}>
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

          <br></br>
          <br></br>
          <br></br>

          <ReactBsCarousel />
          <ProductList />
        </div>
      </main>
    </>
  )
}


