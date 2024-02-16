import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PRODUCT } from '@/components/my-const'
import Link from 'next/link'
//import ProductItem from './ProductItem'
import {
  BsChevronRight,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsChevronLeft,
} from 'react-icons/bs'

function ProductList() {

  const [data, setData] = useState({})
  const router = useRouter()

  //取page資料
  const getListData = async () => {
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const r = await fetch(PRODUCT + `?page=${page}`)
      const d = await r.json()
      setData(d)
    } catch (ex) {}
  }

  useEffect(() => {
    getListData()
  }, [router.query.page])

  console.log(data.rows);
  
  return (
    <>
      {data.rows &&
        data.rows.map((v, i) => {
          return (
            <div className="col" key={v.pid}>
              <Link href={`/product/${v.pid}`} className="noline">
                <div className="card border-primary">
                  <img
                    src="/images/product/638348807730300000 (1).jfif"
                    alt="name of product"
                    className="card-img-top"
                  />
                  <div className="card-body no-space-x">
                    <p className="card-text">{v.product_name}</p>
                    <span className="h-currency bold h-now">
                      <span>NT$ </span>
                      {v.product_price}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}

      {/* 頁碼 */}
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
                      background:
                        data.page === 1 ? 'transparent' : 'transparent',
                      border: 'none',
                      color: data.page === 1 ? '#B0B7C3' : '', // 新增此行
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
                      background:
                        data.page === 1 ? 'transparent' : 'transparent',
                      border: 'none',
                      color: data.page === 1 ? '#B0B7C3' : '', // 新增此行
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
                                  p === data.page ? '#f8723f' : 'transparent', // 新增此行
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
                      color: data.page === data.totalPages ? '#B0B7C3' : '', // 新增此行
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
                      color: data.page === data.totalPages ? '#B0B7C3' : '', // 新增此行
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
    </>
  )
}

export default ProductList
