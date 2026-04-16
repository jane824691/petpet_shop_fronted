// ProductItem.js
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/css/ProductItem.module.css'
import { useLanguage } from '@/components/contexts/LanguageContext'
interface ProductItemProps {
  product: {
    pid: string
    nameZh: string
    nameEn?: string
    productPrice: number
    categoryId: string
    productImg: any
  },
  index: number
}

function ProductItem(props: ProductItemProps) {
  const { locale } = useLanguage()
  const { pid, nameZh, nameEn, productPrice, categoryId, productImg } =
    props.product || {}
  const { index } = props

  const urlImg = productImg?.includes('storage.googleapis')
  const imagePath = productImg
    ? `/image/product/${productImg}`
    : '/images/product/638348807730300000 (1).jfif'

  const isAboveTheFold = index < 6 // 考慮首屏進來容易先被看到的是前 6 張圖, 指定優先渲染
  return (
    <div className="col" key={pid}>
      <Link href={`/product/${pid}`} className="noline">
        <div className="card border-primary h-100">
          <div className={styles.imgContainer}>
            <Image
              src={urlImg ? productImg : imagePath}
              alt="product"
              fill
              className="card-img-top object-fit-cover bg-white"
              priority={isAboveTheFold}
            // loading="lazy" // Next 預設就是lazy load
            />
          </div>
          <div className="card-body with-space">
            <p className="card-text cardTitle">{locale === 'zh-TW' ? (nameZh || '') : (nameEn || nameZh || '')}</p>
            <div className="h-currency bold h-now" style={{ display: 'none' }}>
              {categoryId}
            </div>
            <span className="h-currency bold h-now">
              <span>NT$ </span>
              {productPrice}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem
