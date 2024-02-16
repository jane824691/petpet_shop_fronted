import React from 'react'
import Link from 'next/link'
import {
  BsChevronRight,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsChevronLeft,
} from 'react-icons/bs'

function PagesBar({ data }) {
  return (
    <div className="pages mx-auto">
      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li>
                <Link
                  className={`page-link ${data.page === 1 ? 'disabled' : ''}`}
                  href={data.page !== 1 ? `?page=${1}` : '#'}
                  style={{
                    background: data.page === 1 ? 'transparent' : 'transparent',
                    border: 'none',
                    color: data.page === 1 ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronDoubleLeft />
                </Link>
              </li>
              <li>
                <Link
                  className={`page-link ${data.page === 1 ? 'disabled' : ''}`}
                  href={`?page=${data.page - 1}`}
                  style={{
                    background: data.page === 1 ? 'transparent' : 'transparent',
                    border: 'none',
                    color: data.page === 1 ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronLeft />
                </Link>
              </li>
              {data.success && data.totalPages
                ? Array(7)
                    .fill(1)
                    .map((v, i) => {
                      const p = data.page - 3 + i
                      if (p < 1 || p > data.totalPages) return null
                      return (
                        <li
                          key={p}
                          className={
                            p === data.page ? 'page-item active' : 'page-item'
                          }
                          style={{ marginRight: '6px' }}
                        >
                          <Link
                            className={`page-link ${
                              p === data.page ? 'active-link' : ''
                            }`}
                            href={'?page=' + p}
                            style={{
                              borderRadius: '10px',
                              border:
                                p === data.page
                                  ? '1px solid #FFB44F'
                                  : '1px solid ',
                              backgroundColor:
                                p === data.page ? '#f8723f' : 'transparent',
                              color: p === data.page ? '#fff' : '',
                              width: '38px',
                              textAlign: 'center',
                            }}
                          >
                            {p}
                          </Link>
                        </li>
                      )
                    })
                : null}
              <li>
                <Link
                  className={`page-link ${
                    data.page === data.totalPages ? 'disabled' : ''
                  }`}
                  href={`?page=${data.page + 1}`}
                  style={{
                    background:
                      data.page === data.totalPages
                        ? 'transparent'
                        : 'transparent',
                    border: 'none',
                    color: data.page === data.totalPages ? '#B0B7C3' : '',
                  }}
                >
                  <BsChevronRight />
                </Link>
              </li>
              <li>
                <Link
                  className={`page-link ${
                    data.page === data.totalPages ? 'disabled' : ''
                  }`}
                  href={
                    data.page !== data.totalPages
                      ? `?page=${data.totalPages}`
                      : '#'
                  }
                  style={{
                    background:
                      data.page === data.totalPages
                        ? 'transparent'
                        : 'transparent',
                    border: 'none',
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
