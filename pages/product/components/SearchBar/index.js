import React from 'react'
import { BsSearch } from 'react-icons/bs'
import { useIntl } from 'react-intl'

function SearchBar(props) {
  const { searchWord, setSearchWord } = props
  const intl = useIntl()
  return (
    <>
      {/* 搜尋bar */}
      <div>
        <form className="navbar-form navbar-left" role="search">
          <div className="search-group">
            <h5 className="mb-3">{intl.formatMessage({ id: 'product.filter' })}</h5>
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
