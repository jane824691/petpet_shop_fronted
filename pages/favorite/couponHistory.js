import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { BsHighlighter } from 'react-icons/bs'
import { GET_COUPON_DATA } from '@/components/my-const'
import style from '@/css/coupon.module.css'

//表格來源:(MFEE43-next)前端address資料夾底下的index.js
export default function CouponHistory() {
  const [mydata, setMydata] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const sid = JSON.parse(localStorage.getItem('auther')).sid
      try {
        const response = await fetch(GET_COUPON_DATA, {
          body: JSON.stringify({ sid: sid }),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
        })
        const couponData = await response.json()
        // console.log('couponData:', couponData)
        setMydata(couponData)
      } catch (error) {
        // console.error('Error fetching mydata:', error)
      }
    }

    fetchData()
  }, [router.query.sid])

  const statusStyles = {
    0: style.isValidText,
    2: style.isExpired,
  }

  return (
    <>
      <div className={style.container}>
        <h3 className="py-5">優惠券管理</h3>
        <div className={`row w-75 mb-3 ${style.title}`}>
          <div class="col ms-4">優惠券編號</div>
          <div class="col">折價券種類</div>
          <div class="col-2 ">創建日期</div>
          <div class="col">折價券到期日</div>
          <div class="col">折價券狀態</div>
        </div>

        {/* 其他元素 */}
        {/* 使用 map 改成 div */}
        {/* Array處理異步[]沒抓到值的狀況 */}
        {Array.isArray(mydata) &&
          mydata.map((coupon) => (
            <div
              key={coupon.coupon_id}
              className={`row w-75 ${style.eachCoupon} ${
                coupon.coupon_status === 0 ? style.isValidBg : ''
              }`}
            >
              <span className="col ps-5">{coupon.hash}</span>
              <span className="col">折價 {coupon.discount_coins} 元</span>
              <span className="col-2">
                {/* {dayjs(coupon.created_at).format('YYYY-MM-DD')} */}
                {dayjs(coupon.created_at3).format('YYYY-MM-DD HH:mm:ss')}
                {/* 當下時間{dayjs().format('YYYY-MM-DD HH:mm:ss')} */}
              </span>
              <span className="col">
                {dayjs(coupon.expiry_date).add(15, 'day').format('YYYY-MM-DD')}
              </span>
              <span className={`col `}>
                <span
                  className={`col ${style.state} ${
                    statusStyles[coupon.coupon_status] || ''
                  }`}
                >
                  {coupon.coupon_status === 0 && '未使用'}
                  {coupon.coupon_status === 1 && '已使用'}
                  {coupon.coupon_status === 2 && '已逾期'}
                </span>
              </span>
            </div>
          ))}
      </div>
    </>
  )
}
