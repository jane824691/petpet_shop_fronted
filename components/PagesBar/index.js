import React from 'react'
import Link from 'next/link'
import {
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleRight,
} from 'react-icons/bs'

function PagesBar({ data }) {
  // 若 data 為空或不存在，則返回 null
  if (!data || Object.keys(data).length === 0) {
    return null
  }
  const renderPageLink = (page) => (
    <li
      key={page}
      className={page === data.page ? 'page-item active' : 'page-item'}
      style={{ marginRight: '6px' }}
    >
      {/* 調整css樣式無效的頁數變灰色 */}
      <Link
        className={`page-link text-center ${page === data.page ? 'active-link' : ''}`}
        href={`?page=${page}`}
        style={{
          borderRadius: '10px',
          border: page === data.page ? '1px solid #FFB44F' : '1px solid ',
          backgroundColor: page === data.page ? '#f8723f' : 'transparent',
          color: page === data.page ? '#fff' : '',
          width: '38px',
        }}
      >
        {page}
      </Link>
    </li>
  )

  return (
    <div className="pages" style={{ marginTop: '5vh' }}>
      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example">
            <ul className="pagination d-flex justify-content-center">
              <li>
                <Link
                  className={`page-link px-0 border border-0 bg-transparent ${
                    data.page === 1 ? 'disabled' : ''
                  }`}
                  href={data.page !== 1 ? `?page=${1}` : '#'}
                  style={{
                    color: data.page === 1 ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronDoubleLeft />
                </Link>
              </li>
              <li>
                <Link
                  className={`page-link px-2 px-sm-3 border border-0 bg-transparent ${
                    data.page === 1 ? 'disabled' : ''
                  }`}
                  href={`?page=${data.page - 1}`}
                  style={{
                    color: data.page === 1 ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronLeft />
                </Link>
              </li>
              {data.success && data.totalPages
                ? Array(7)
                    .fill(1)
                    .map((_, i) => {
                      const page = data.page - 3 + i
                      if (page < 1 || page > data.totalPages) return null
                      return renderPageLink(page)
                    })
                : null}
              <li>
                <Link
                  className={`page-link px-2 px-sm-3 border border-0 bg-transparent ${
                    data.page === data.totalPages ? 'disabled' : ''
                  }`}
                  href={`?page=${data.page + 1}`}
                  style={{
                    color: data.page === data.totalPages ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronRight />
                </Link>
              </li>
              <li>
                <Link
                  className={`page-link px-0 border border-0 bg-transparent ${
                    data.page === data.totalPages ? 'disabled' : ''
                  }`}
                  href={
                    data.page !== data.totalPages
                      ? `?page=${data.totalPages}`
                      : '#'
                  }
                  style={{
                    color: data.page === data.totalPages ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronDoubleRight />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default PagesBar
