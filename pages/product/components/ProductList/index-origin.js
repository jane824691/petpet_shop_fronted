import React, { useState, useEffect } from 'react'
import ProductItem from './ProductItem'
import PagesBar from './PagesBarTest'

function ProductList(props) {
  const { products } = props
  console.log({ products })
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