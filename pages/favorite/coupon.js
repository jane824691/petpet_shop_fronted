import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { AB_LIST, AB_DEL_ONE } from '@/components/my-const'
import { BsHighlighter } from 'react-icons/bs'

//表格來源:(MFEE43-next)前端address資料夾底下的index.js
export default function Coupon() {
  const [data, setData] = useState({})
  const router = useRouter()

  const getListData = async () => {
    console.log('router.query:', router.query)
    let page = +router.query.page || 1 //+若非數值則為NaN,強制轉為1
    if (page < 1) page = 1
    try {
      const r = await fetch(AB_LIST + `?page=${page}`)
      const d = await r.json()

      setData(d)
    } catch (ex) {
      ;('error:')
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page]) //將router值放入相依性陣列，畫面呈現出第二次render結果
  const removeItemAndReload = async (sid) => {
    console.log({ sid })

    const r = await fetch(AB_DEL_ONE + '/' + sid, {
      method: 'DELETE',
    })
    const result = await r.json()

    if (result.success) {
      // alert("完成刪除")
      // router.reload(); 避免畫面重載
      getListData() //再要一次資料
    }
  }
  return (
    <>
      <div>
        <h3>優惠券管理</h3>
        <div className="row">
          <div className="col">
            {/* 字串相接bordered後面要空一格 */}
            <div style={{ maxWidth: '750px', margin: 'auto' }}>
              <table
                className={'table table-striped table-hover table-borderless'}
              >
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>
                      <BsHighlighter />
                    </th>
                    <th style={{ width: '15%' }}>優惠券編號</th>
                    <th style={{ width: '20%' }}>折價券種類</th>
                    <th style={{ width: '20%' }}>創建日期</th>
                    <th style={{ width: '20%' }}>折價券到期日</th>
                    <th style={{ width: '20%' }}>折價券狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 可以改成div */}
                  {data.rows &&
                    data.rows.map((i) => {
                      return (
                        <tr key={i.coupon_id} className="table-info">
                          <td></td>
                          <td style={{ height: '90px' }}>{i.coupon_id}</td>
                          <td style={{ height: '90px' }}>{i.discount_type}</td>
                          <td style={{ height: '90px' }}>
                            {dayjs(i.created_at).format('YYYY-MM-DD')}
                          </td>
                          <td style={{ height: '90px' }}>
                            {dayjs(i.expiry_date).format('YYYY-MM-DD')}
                          </td>
                          <td>{i.coupon_status}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
