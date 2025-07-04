import React from 'react'
import PriceRangeRadio from './PriceRangeRadio'
import TagCheckbox from './TagCheckbox'
import { useIntl } from 'react-intl'

function FilterBar(props) {
  const {
    priceRangeTypes,
    priceRange,
    setPriceRange,
    tagTypes,
    tags,
    setTags,
  } = props
  const intl = useIntl()
  const handleChecked = (e) => {
    const value = e.target.value
    if (!tags.includes(value)) return setTags([...tags, value])
    if (tags.includes(value)) {
      const newTags = tags.filter((v) => v !== value)
      setTags(newTags)
    }
  }
  return (
    <>
      <div className="search-group">
        <h5 className="mb-2">{intl.formatMessage({ id: 'product.price' })}</h5>
        {priceRangeTypes && priceRangeTypes.map((value, i) => (
          <PriceRangeRadio
            key={i}
            value={value}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        ))}
        <hr />
      </div>
      <div className="search-group">
        <h5>
          {intl.formatMessage({ id: 'product.category' })}
          <button
            className="btn btn-link btn-sm"
            onClick={() => setTags([])}
            style={{
              color: '#FFB44F',
              ':hover': { color: '#f8723f' },
              textDecoration: 'none',
            }}
          >
            {intl.formatMessage({ id: 'product.reset' })}
          </button>
        </h5>
        <p>{intl.formatMessage({ id: 'product.includeHint' })}</p>
        {tagTypes && tagTypes.map((value, i) => (
          <TagCheckbox
            value={value}
            key={i}
            tags={tags}
            handleChecked={handleChecked}
          />
        ))}
      </div>
    </>
  )
}

export default FilterBar
