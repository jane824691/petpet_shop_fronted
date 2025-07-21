import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { BsHighlighter } from 'react-icons/bs'
import { GET_COUPON_DATA } from '@/components/my-const'
import style from '@/css/coupon.module.css'
import { useIntl } from 'react-intl'

//表格來源:(MFEE43-next)前端address資料夾底下的index.js
export default function CouponHistory() {
  const [mydata, setMydata] = useState([])
  const router = useRouter()

  const intl = useIntl()

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
        <h3 className="py-5">{intl.formatMessage({ id: 'coupon.title' })}</h3>
        <div className={`row w-75 mb-3 ${style.title}`}>
          <div className="col ms-4">{intl.formatMessage({ id: 'coupon.id' })}</div>
          <div className="col">{intl.formatMessage({ id: 'coupon.createdAt' })}</div>
          <div className="col">{intl.formatMessage({ id: 'coupon.expiryDate' })}</div>
          <div className="col">{intl.formatMessage({ id: 'coupon.status' })}</div>
        </div>

        {/* 其他元素 */}
        {/* 使用 map 改成 div */}
        {/* Array處理異步[]沒抓到值的狀況 */}
        {Array.isArray(mydata) &&
          mydata.slice().reverse().map((coupon) => (
            <div
              key={coupon.coupon_id}
              className={`row w-75 ${style.eachCoupon} ${
                coupon.coupon_status === 0 ? style.isValidBg : ''
              }`}
            >
              <span className={`col ps-5 ${style.hash}`}>{coupon.hash}</span>
              <span className={`col ${style.startDate}`}>
                {dayjs(coupon.created_at3).format('YYYY-MM-DD')}
              </span>
              <span className={`col ${style.endDate}`}>
                {dayjs(coupon.expiry_date).add(15, 'day').format('YYYY-MM-DD')}
              </span>
              <span className={`col ${style.status}`}>
                <span
                  className={`col ${style.state} ${
                    statusStyles[coupon.coupon_status] || ''
                  }`}
                >
                  {coupon.coupon_status === 0 && intl.formatMessage({ id: 'coupon.status.valid' })}
                  {coupon.coupon_status === 1 && intl.formatMessage({ id: 'coupon.status.used' })}
                  {coupon.coupon_status === 2 && intl.formatMessage({ id: 'coupon.status.expired' })}
                </span>
              </span>
            </div>
          ))}
      </div>
    </>
  )
}
