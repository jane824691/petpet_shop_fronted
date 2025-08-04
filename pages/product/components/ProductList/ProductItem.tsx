// ProductItem.js
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/css/ProductItem.module.css'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/contexts/LanguageContext'

interface ProductItemProps {
  product: {
    pid: string;
    product_name: string;
    product_name_en?: string;
    product_price: number;
    category_id: string;
    product_img?: string;
  };
}

function ProductItem(props: ProductItemProps) {
  const intl = useIntl()
  const { locale } = useLanguage()
  const { pid, product_name, product_name_en, product_price, category_id, product_img } =
    props.product || {}

  const imagePath = product_img
    ? `/image/product/${product_img}`
    : '/images/product/638348807730300000 (1).jfif'

  return (
    <div className="col" key={pid}>
      <Link href={`/product/${pid}`} className="noline">
        <div className="card border-primary h-100">
          <div className={styles.imgContainer}>
            <Image
              src={imagePath}
              alt="product"
              fill
              className="card-img-top object-fit-cover bg-white"
              loading="lazy"
            />
          </div>
          <div className="card-body with-space">
            <p className="card-text cardTitle">{locale === 'zh-TW' ? (product_name || '') : (product_name_en || product_name || '')}</p>
            <div className="h-currency bold h-now" style={{ display: 'none' }}>
              {category_id}
            </div>
            <span className="h-currency bold h-now">
              <span>NT$ </span>
              {product_price}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem
