import React from 'react'

function SortBar(props) {
  const { sortBy, setSortBy } = props
  return (
    <>
      <div className="d-flex p-2 justify-content-end align-items-center">
        <div className="dropdown">
          <select
            className="form-select form-select-sm"
            aria-label=".form-select-sm example"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">請選擇排序</option>
            <option value="1">價格：由低至高</option>
            <option value="2">價格：由高至低</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SortBar
