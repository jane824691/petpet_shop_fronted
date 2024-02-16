// ProductItem.js
import React from 'react'
import Link from 'next/link'

function ProductItem(props) {
  const { pid, product_name, product_price, category_id, product_img } =
    props.product

  const imagePath = product_img
    ? `/image/product/${product_img}`
    : '/images/product/638348807730300000 (1).jfif'

  return (
    <div className="col" key={pid}>
      <Link href={`/product/${pid}`} className="noline">
        <div className="card border-primary">
          <img src={imagePath} alt="name of product" className="card-img-top" />

          {/* 資料庫img實際存到180~204 */}

          <div className="card-body no-space-x">
            <p className="card-text">{product_name}</p>
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
