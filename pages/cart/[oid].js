import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ONE_ORDER } from '@/components/my-const'
import { jwtDecode } from 'jwt-decode'
import ReverseLookup from './OrderSteps/sub-pages/Zipcode_to_city'
import { isError } from 'lodash'
export default function OrderUnderMember() {
  //跳轉用
  const router = useRouter()
  const [orderData, setOrderData] = useState([])
  const [isShowError, setIsShowError] = useState(true)

  // 刷進該頁面, 檢查token是否過期
  useEffect(() => {
    const token = localStorage.getItem('auther')
    if (token) {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000 //單位:毫秒轉秒
      if (decodedToken.exp < currentTime) {
        logout() // token 過期，自動登出
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const oid = +router.query.oid
      const authDataString = localStorage.getItem('auther')
      if (!authDataString) {
        // 未登入會直接跳轉回首頁
        router.push('/')
        return
      }
      const authData = JSON.parse(authDataString)
      if (!authData || !authData.sid) {
        router.push('/')
        // console.log('停權會員')
        return
      }
      const sid = authData.sid
      const token = JSON.parse(localStorage.getItem("auther"))?.token;
      try {
        // const response = await fetch(ONE_ORDER + `/${oid}`)
        const response = await fetch(ONE_ORDER + `/${oid}`, {
          body: JSON.stringify({ sid: sid, token }),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${authData.token}`,
          },
          method: 'POST',
        })
        const responseData = await response.json()

        // 確保 responseData 是一個陣列
        if (Array.isArray(responseData)) {
          setOrderData(responseData)
          setIsShowError(false)
        } else {
          // console.error('資料格式不是陣列')
          setIsShowError(true)
        }
      } catch (error) {
        // console.error('請求發生錯誤:', error)
        setIsShowError(true)
      }

    }

    // 呼叫 fetchData 以觸發資料載入
    if (router.query.oid) {
      fetchData()
    }
  }, [router.query.oid])

  useEffect(() => {
    console.log('IsShowError', isShowError);

  }, [isShowError])

  return (
    <>
      {isShowError ? (
        <>錯誤頁面</>
      ) : (
        <>
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <div className="list-form needs-validation" noValidate="">
              <div className="d-flex justify-content-center">
                <div className="direction-column">
                  <div
                    className="card border-primary mb-3"
                    style={{ width: '40rem' }}
                  >
                    <h5
                      className="card-header card-big-title border border-0"
                      style={{
                        backgroundColor: 'transparent ',
                        fontWeight: '500',
                        fontSize: '26px',
                      }}
                    >
                      購物明細
                    </h5>
                    <div className="card-body">
                      {orderData.map((v, i) => (
                        <div className="row extinct-product" key={v.oid}>
                          <div className="col-3">
                            <img
                              src={`../image/product/${v.product_img}`}
                              alt="name of product"
                              className="img-thumbnail"
                            />
                          </div>
                          <div className="col-6">
                            {v.product_name}
                            <div>
                              <span>數量：</span>
                              <span>{v.actual_amount}</span>
                            </div>
                            <div>
                              <span>單價：</span>
                              <span>{v.sale_price}</span>
                            </div>
                          </div>
                          <div className="col-3 text-end">
                            <div className="dollar">
                              <span>NT$</span>
                              <span>{v.sale_price * v.actual_amount}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* <div className="row card-padding12">
                    <div className="col-9">折扣金額</div>
                    <div className="col-3 text-end">
                      <div>
                        <span>NT$</span>
                        <span>{[setSelectedCouponId[0]]}</span>
                      </div>
                    </div>
                  </div> */}
                      <div className="row card-padding12">
                        <div className="col-9 dollar">本訂單總花費</div>
                        <div className="col-3 text-end">
                          {orderData.length > 0 && (
                            <div className="dollar">
                              <span>NT$</span>
                              <span>{orderData[0].total}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card border-primary mb-3"
                    style={{ width: '40rem' }}
                  >
                    <div
                      className="card-header card-big-title border border-0"
                      style={{ backgroundColor: 'transparent ' }}
                    >
                      取貨人資訊
                    </div>
                    <div className="card-body">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label font-grey-title"
                      >
                        姓名：
                      </label>
                      {orderData.length > 0 && (
                        <span>{orderData[0].order_name}</span>
                      )}
                      <br />
                      <label
                        htmlFor="validationCustom01"
                        className="form-label font-grey-title"
                      >
                        電話：
                      </label>
                      {orderData.length > 0 && (
                        <span>{orderData[0].order_phone}</span>
                      )}
                      <br />
                      <label
                        htmlFor="validationCustom01"
                        className="form-label font-grey-title"
                      >
                        Email：
                      </label>
                      {orderData.length > 0 && (
                        <span>{orderData[0].order_email}</span>
                      )}
                    </div>
                    <div
                      className="card-header card-big-title border border-0"
                      style={{ backgroundColor: 'transparent ' }}
                    >
                      取貨資訊
                    </div>
                    <div className="card-body">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label font-grey-title"
                      >
                        取貨地址：
                      </label>
                      <span>
                        {orderData.length > 0 && (
                          <span>
                            <ReverseLookup
                              postcode={orderData[0].shipping_zipcode}
                            />
                            {orderData[0].shipping_zipcode}
                            {orderData[0].shipping_address}
                          </span>
                        )}
                      </span>
                    </div>
                    <div
                      className="card-header card-big-title border border-0"
                      style={{ backgroundColor: 'transparent ' }}
                    >
                      付款資訊
                    </div>
                    <div className="card-body">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label font-grey-title"
                      >
                        付款方式：
                      </label>
                      {orderData.length > 0 && <span>{orderData[0].pay_way}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              {' '}
              <button
                className="btn btn-danger btn-lg text-white mb-5"
                onClick={() => {
                  router.push(`../member/member-orderList`)
                }}
              >
                回到前一頁
              </button>
            </div>
          </div>
        </>
      )}

    </>
  )
}
