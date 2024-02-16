import React from 'react'

function PriceRangeRadio(props) {
  const { priceRange, setPriceRange, value } = props

  return (
    <>
      <div className="form-check mx-3">
        <input
          className="form-check-input"
          type="radio"
          value={value}
          checked={priceRange === value}
          onChange={(e) => {
            setPriceRange(e.target.value)
          }}
        />
        <label className="form-check-label option-fcolor">{value}</label>
      </div>
    </>
  )
}

export default PriceRangeRadio
