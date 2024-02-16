import React from 'react';
import Link from 'next/link';
import {
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleRight,
} from 'react-icons/bs';

function PagesBar({ data }) {
  const renderPageLink = (page) => (
    <li
      key={page}
      className={page === data.page ? 'page-item active' : 'page-item'}
      style={{ marginRight: '6px' }}
    >
      <Link
        className={`page-link ${page === data.page ? 'active-link' : ''}`}
        href={`?page=${page}`}
        style={{
          borderRadius: '10px',
          border: page === data.page ? '1px solid #FFB44F' : '1px solid ',
          backgroundColor: page === data.page ? '#f8723f' : 'transparent',
          color: page === data.page ? '#fff' : '',
          width: '38px',
          textAlign: 'center',
        }}
      >
        {page}
      </Link>
    </li>
  );

  return (
    <div className="pages" style={{marginLeft: '18vw', marginTop: '5vh'}}>
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
                    .map((_, i) => {
                      const page = data.page - 3 + i;
                      if (page < 1 || page > data.totalPages) return null;
                      return renderPageLink(page);
                    })
                : null}
              <li>
                <Link
                  className={`page-link ${
                    data.page === data.totalPages ? 'disabled' : ''
                  }`}
                  href={`?page=${data.page + 1}`}
                  style={{
                    background: data.page === data.totalPages ? 'transparent' : 'transparent',
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
                    background: data.page === data.totalPages ? 'transparent' : 'transparent',
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
  );
}

export default PagesBar;
