import { useState, useEffect } from 'react'
import { useCart } from '@/components/hooks/use-cart-state'
import { useRouter } from 'next/router'
import { ONE_ORDER } from '@/components/my-const'
import ReverseLookup from './OrderSteps/sub-pages/Zipcode_to_city'
export default function OrderUnderMember() {
  //跳轉用
  const router = useRouter()
  const [data, setData] = useState([])
  const [orderData, setOrderData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const oid = +router.query.oid
      console.log(oid)
      try {
        const response = await fetch(ONE_ORDER + `/${oid}`)
        const responseData = await response.json()

        console.log('Response Data:', responseData) // 添加此行输出

        // 確保 responseData 是一個陣列
        if (Array.isArray(responseData)) {
          console.log('orderData:', responseData)
          setOrderData(responseData)
        } else {
          console.error('Error: Data is not an array')
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
      }
    }

    // 呼叫 fetchData 以觸發資料載入
    fetchData()
  }, [router.query.oid])

  console.log(orderData)
  return (
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
  )
}
