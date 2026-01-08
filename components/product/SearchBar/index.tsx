import React from 'react'
import { BsSearch } from 'react-icons/bs'
import { useIntl } from 'react-intl'

interface SearchBarProps {
  searchWord: string
  setSearchWord: (searchWord: string) => void
}

function SearchBar(props: SearchBarProps) {
  const { searchWord, setSearchWord } = props
  const intl = useIntl()
  return (
    <>
      {/* 搜尋bar */}
      <div>
        <form className="navbar-form navbar-left" role="search">
          <div className="search-group">
            <div className="mb-3 fs-md-4">{intl.formatMessage({ id: 'product.filter' })}</div>
            <input
              type="search"
              className="form-control rounded-5 search-input search-bar mb-3"
              placeholder={intl.formatMessage({ id: 'product.searchPlaceholder' })}
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <BsSearch className="BsSearch" style={{ color: '#FFB44F' }} />
          </div>
        </form>
      </div>
    </>
  )
}

export default SearchBar
