import React from 'react'

function PriceRangeRadio(props) {
  const { priceRange, setPriceRange, value } = props

  return (
    <>
      <div className="form-check mx-3">
        <label className="form-check-label option-fcolor">
          <input
            className="form-check-input"
            type="radio"
            value={value}
            checked={priceRange === value}
            onChange={(e) => {
              setPriceRange(e.target.value)
            }}
          />
          {value}
        </label>
      </div>
    </>
  )
}

export default PriceRangeRadio
