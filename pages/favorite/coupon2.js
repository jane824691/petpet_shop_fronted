import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { BsHighlighter } from 'react-icons/bs'
import { GET_COUPON_DATA } from '@/components/my-const'

//表格來源:(MFEE43-next)前端address資料夾底下的index.js
export default function Coupon() {
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
  return (
    <>
      <div>
        <h3 style={{ marginBottom: '50px' }}>優惠券管理</h3>
        <div
          className="row"
          style={{
            display: 'flex',
            width: '900px',
            margin: 'auto',
            marginBottom: '30px',
            alignItems: 'center', // 新增這一行以對齊中文字
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* <BsHighlighter /> */}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            優惠券編號
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            折價券種類
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            創建日期
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            折價券到期日
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            折價券狀態
          </span>
        </div>

        {/* 其他元素 */}
        {/* 使用 map 改成 div */}
        {/* Array處理異步[]沒抓到值的狀況 */}
        <div style={{ marginBottom: '80px' }}>
          {Array.isArray(mydata) &&
            mydata.map((coupon) => (
              <div
                key={coupon.coupon_id}
                style={{
                  display: 'flex',
                  backgroundColor: dayjs(coupon.expiry_date).isAfter(dayjs())
                    ? '#D2F9CF'
                    : '#FFF6F6',
                  height: '100px',
                  marginBottom: '50px',
                  width: '880px',
                  margin: 'auto',
                  marginTop: '15px',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '900px',
                  }}
                >
                  <span style={{ flex: 1, marginLeft: '15px' }}>
                    <BsHighlighter />
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      margin: '5px',
                    }}
                  >
                    {coupon.hash}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      margin: '5px',
                    }}
                  >
                    {coupon.discount_type}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      margin: '5px',
                    }}
                  >
                    {/* {dayjs(coupon.created_at2).format('YYYY-MM-DD')} */}
                    {dayjs(coupon.created_at3).format('YYYY-MM-DD HH:mm:ss')}
                    {/* 當下時間{dayjs().format('YYYY-MM-DD HH:mm:ss')} */}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      margin: '5px',
                    }}
                  >
                    {dayjs(coupon.expiry_date)
                      .add(15, 'day')
                      .format('YYYY-MM-DD')}
                  </span>
                  <span
                    style={{
                      flex: 1,

                      color: dayjs(coupon.expiry_date).isAfter(dayjs())
                        ? '#FFFFFF'
                        : '#F8723F',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: dayjs(coupon.expiry_date).isAfter(
                          dayjs()
                        )
                          ? '#90D2CE'
                          : '#F7BCC5',
                        width: '50px',
                      }}
                    >
                      {coupon.coupon_status}
                    </div>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}