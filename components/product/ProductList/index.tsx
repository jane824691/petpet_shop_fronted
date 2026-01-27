import React from 'react'
import ProductItem from './ProductItem'
import { useIntl } from 'react-intl'

interface ProductListProps {
  products: Array<any>
}

function ProductList(props:ProductListProps) {
  const { products } = props
  const intl = useIntl()
  if (products && products.length === 0) {
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
        {intl.formatMessage({ id: 'product.noResult' })}
      </h4>
    )
  }
  return (
    <>
      {products && products.map((product, index) => {
        return <ProductItem key={product.pid} product={product} index={index} />
      })}

      {/* <PagesBar data={data} /> */}
    </>
  )
}

export default ProductList
