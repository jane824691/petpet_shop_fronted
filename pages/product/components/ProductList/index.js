import React from 'react'
import ProductItem from './ProductItem'
import { useIntl } from 'react-intl'

function ProductList(props) {
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
      {products && products.map((product, i) => {
        return <ProductItem key={i} product={product} />
      })}

      {/* <PagesBar data={data} /> */}
    </>
  )
}

export default ProductList
