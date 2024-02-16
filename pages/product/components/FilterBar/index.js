import React from 'react'
import PriceRangeRadio from './PriceRangeRadio'
import TagCheckbox from './TagCheckbox'

function FilterBar(props) {
  const {
    priceRangeTypes,
    priceRange,
    setPriceRange,
    tagTypes,
    tags,
    setTags,
  } = props

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
        {' '}
        <h5 className="mb-2">價格</h5>
        {priceRangeTypes.map((value, i) => (
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
        {' '}
        <h5>
          標籤
          <button
            className="btn btn-link btn-sm"
            onClick={() => setTags([])}
            style={{
              color: '#FFB44F',
              ':hover': { color: '#f8723f' },
              textDecoration: 'none',
            }}
          >
            {' '}
            重設
          </button>
        </h5>
        <p>有包含勾選標籤均會顯示</p>
        {tagTypes.map((value, i) => (
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
