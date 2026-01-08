import React from 'react'
import { useIntl } from 'react-intl'

interface SortBarProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

function SortBar(props: SortBarProps) {
  const { sortBy, setSortBy } = props
  const intl = useIntl()
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
            <option value="">{intl.formatMessage({ id: 'product.sortPlaceholder' })}</option>
            <option value="cheap">{intl.formatMessage({ id: 'product.sortCheap' })}</option>
            <option value="expensive">{intl.formatMessage({ id: 'product.sortExpensive' })}</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SortBar
