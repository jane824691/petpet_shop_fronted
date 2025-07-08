import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { ONE_ORDER } from '@/components/my-const'
import { jwtDecode } from 'jwt-decode'
import ReverseLookup from './OrderSteps/sub-pages/Zipcode_to_city'
import AuthContext from '@/components/contexts/AuthContext'
import { CatLoader } from '@/components/hooks/use-loader/components'
import { useIntl } from 'react-intl'

export default function OrderUnderMember({ oid: propsOid, onStatusChange }) {
  const intl = useIntl()
  //跳轉用
  const router = useRouter()
  const [orderData, setOrderData] = useState([])
  const [isShowError, setIsShowError] = useState(true)
  const { logout } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)


  // 刷進該頁面, 檢查token是否過期
  useEffect(() => {
    setIsLoading(true)
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
    if (!router.isReady) return;
    const resolvedOid = propsOid || router.query.oid;
    if (!resolvedOid) return;
    
    const fetchData = async () => {
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
        const response = await fetch(ONE_ORDER + `/${resolvedOid}`, {
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
          if (onStatusChange && typeof onStatusChange === 'function') {
            onStatusChange(responseData[0].order_status)
          }
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
    fetchData()
  }, [router.isReady, propsOid])

  useEffect(() => {
    console.log('IsShowError', isShowError);

  }, [isShowError])

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center w-100 mb-5 vh-100">
          <CatLoader />
        </div>
      ) : (
        <>
          {isShowError ? (
            <>
              <div className='d-flex m-5' style={{ height: '50vh' }}>
                <h2 className='mx-auto my-auto text-center'>
                  {intl.formatMessage({ id: 'cart.errorOrNoAccess' })}
                  <br />
                  {intl.formatMessage({ id: 'cart.contactAdmin' })}
                </h2>
              </div>
            </>
          ) : (
            <>
              <div className="container" style={{ paddingTop: '2.5rem' }}>
                <div className="list-form mx-4">
                  <div className="d-flex justify-content-center">
                    <div className="direction-column">
                      <div
                        className="card border-primary mb-3"
                        style={{ maxWidth: '40rem' }}
                      >
                        <h5
                          className="card-header card-big-title border border-0"
                          style={{
                            backgroundColor: 'transparent ',
                            fontWeight: '500',
                            fontSize: '26px',
                          }}
                        >
                          {intl.formatMessage({ id: 'cart.orderDetails' })}
                        </h5>
                        <div className="card-body mx-3">
                          {orderData.map((v, i) => (
                            <div className="row extinct-product" key={v.oid}>
                              <div className="col-3">
                                <img
                                  src={`/image/product/${v.product_img}`}
                                  alt="name of product"
                                  className="img-thumbnail"
                                />
                              </div>
                              <div className="col-6">
                                {v.product_name}
                                <div>
                                  <span>{intl.formatMessage({ id: 'product.quantity' })}：</span>
                                  <span>{v.actual_amount}</span>
                                </div>
                                <div>
                                  <span>{intl.formatMessage({ id: 'cart.unitPrice' })}：</span>
                                  <span>{v.sale_price}</span>
                                </div>
                              </div>
                              <div className="col-3 text-end">
                                <div className="dollar">
                                  <span>NT$ </span>
                                  <span>{v.sale_price * v.actual_amount}</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="row card-padding12">
                            <div className="col-9">{intl.formatMessage({ id: 'cart.shipping' })}</div>
                            <div className="col-3 text-end">
                              <div>
                                <span>NT$ 30</span>
                              </div>
                            </div>
                          </div>
                          <div className="row card-padding12">
                            <div className="col-9">{intl.formatMessage({ id: 'cart.discount' })}</div>
                            <div className="col-3 text-end">
                              <div>
                                <span>{orderData[0].discount_coins ? ' - ' : ''}NT$ </span>
                                <span>{orderData[0]?.discount_coins || 0} </span>
                              </div>
                            </div>
                          </div>
                          <br/>
                          <div className="row card-padding12 mb-3">
                            <div className="col-9 dollar">{intl.formatMessage({ id: 'cart.totalAmount' })}</div>
                            <div className="col-3 text-end">
                              {orderData.length > 0 && (
                                <div className="dollar">
                                  <span>NT$ </span>
                                  <span>{orderData[0].total}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card border-primary mb-3"
                        style={{ maxWidth: '40rem' }}
                      >
                        <div
                          className="card-header card-big-title border border-0"
                          style={{ backgroundColor: 'transparent ' }}
                        >
                          {intl.formatMessage({ id: 'cart.pickupPersonInfo' })}
                        </div>
                        <div className="card-body mx-3">
                          <label
                            htmlFor="validationCustom01"
                            className="form-label font-grey-title"
                          >
                            {intl.formatMessage({ id: 'member.firstName' })}：
                          </label>
                          {orderData.length > 0 && (
                            <span>{orderData[0].order_name}</span>
                          )}
                          <br />
                          <label
                            htmlFor="validationCustom01"
                            className="form-label font-grey-title"
                          >
                            {intl.formatMessage({ id: 'common.tel' })}：
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
                          {intl.formatMessage({ id: 'cart.pickupInfo' })}
                        </div>
                        <div className="card-body mx-3 mb-3">
                          <label
                            htmlFor="validationCustom01"
                            className="form-label font-grey-title"
                          >
                            {intl.formatMessage({ id: 'cart.pickupAddress' })}：
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
                          {intl.formatMessage({ id: 'cart.paymentInfo' })}
                        </div>
                        <div className="card-body mx-3 mb-3">
                          <label
                            htmlFor="validationCustom01"
                            className="form-label font-grey-title"
                          >
                            {intl.formatMessage({ id: 'cart.paymentMethod' })}：
                          </label>
                          {orderData.length > 0 && <span>{orderData[0].pay_way}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {router.query.oid && (
                  <div className="d-flex justify-content-center">
                    {' '}
                    <button
                      className="btn btn-danger btn-lg text-white mb-5"
                      onClick={() => {
                        router.push(`../member/member-orderList`)
                      }}
                    >
                      {intl.formatMessage({ id: 'common.back' })}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
