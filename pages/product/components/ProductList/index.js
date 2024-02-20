import React, { useState, useEffect } from 'react'
import ProductItem from './ProductItem'
import PagesBar from './PagesBarTest'

function ProductList(props) {
  const { products } = props
  console.log({ products })
  if (products.length === 0) {
    return (
      <h4
        style={{
          width: '70vw',
          marginTop: '20vh',
          marginBottom: '10vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        搜尋無此結果
      </h4>
    )
  }
  return (
    <>
      {products.map((product, i) => {
        return <ProductItem key={i} product={product} />
      })}

      {/* <PagesBar data={data} /> */}
    </>
  )
}

export default ProductList
