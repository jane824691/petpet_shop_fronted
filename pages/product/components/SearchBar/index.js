import React from 'react'
import { BsSearch } from 'react-icons/bs'

function SearchBar(props) {
  const { searchWord, setSearchWord } = props
  return (
    <>
      {/* 搜尋bar */}
      <div>
        <form className="navbar-form navbar-left" role="search">
          <div className="search-group">
            <h5 className="mb-3">篩選</h5>
            <input
              type="text"
              className="form-control rounded-5 search-input search-bar mb-3"
              placeholder="以商品名稱搜尋"
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
