import { useCart } from '@/components/hooks/use-cart-state'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useHeaderAnimation } from '../contexts/HeaderAnimationContext'
import { debounce } from 'lodash'
import { GET_COUPON_DATA } from '@/components/my-const'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

export default function CartList(props) {
  const { paymentData, setPaymentData } = props

  // 使用hooks 解出所需的狀態與函式(自context)
  const { cart, items, addItem, decrement, increment, removeItem } = useCart()
  const [selectedCouponId, setSelectedCouponId] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [couponData, setCouponData] = useState([])
  const { setAddingProductAmount, addingCartAnimation } = useHeaderAnimation()

  //TODO: need to optimize debounced
  const debouncedAddAmount = useCallback(
    debounce(
      (clickedProduct) => {
        increment(clickedProduct)
        addingCartAnimation(true) // control whether isAnimate
        setAddingProductAmount(1) // props adding product amount
      },
      1000,
      { leading: true, trailing: false } // 確保第一個點擊即刻執行
    ),
    [increment]
  )
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
        const availableCoupons = couponData.filter(
          (couponData) => couponData.coupon_status === 0
        ) // coupon_status: 0 = init, 1 = used, 2 = expired

        setCouponData(availableCoupons) // 更新有效優惠券
      } catch (error) {
        // console.error('Error fetching mydata:', error)
      }
    }

    fetchData()
  }, [router.query.sid])

  useEffect(() => {
    // 一開始沒套用折價券，netTotal和cart.totalPrice一樣
    if (!selectedCouponId) {
      setNetTotal(cart.totalPrice)
      return
    }

    const coupon = couponData.find((v) => v.coupon_id === selectedCouponId)

    // type: 'discount'相減
    const newNetTotal =
      coupon.coupon_type === 'discount'
        ? cart.totalPrice - coupon.discount_coins
        : Math.round(cart.totalPrice * (1 - coupon.discount_coins))
    setNetTotal(Number(cart.totalPrice) > 30 ? newNetTotal : 0)

    setPaymentData({
      ...paymentData,
      coupon_id: selectedCouponId,
      discount_coins: coupon.discount_coins,
    })
  }, [cart.totalPrice, selectedCouponId])

  // 修正 Next hydration 問題
  // https://stackoverflow.com/questions/72673362/error-text-content-does-not-match-server-rendered-html
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return null
  }
  // 修正 end

  return (
    <div className="container">
      <div className="only-cart-padding">
        <div className="d-flex justify-content-center ">
          <img
            src="/images/product/paying_procedure_pic.png"
            alt=""
            style={{ paddingTop: '2.5rem' }}
          />
        </div>

        <div className="row list-form">
          <div className="cart-area">
            <div className="card mb-3 border-0">
              <div className="row">
                <div className="col-sm-3">
                  <div className="d-flex">
                    {/* <input
                      className="form-check-input cart-select-all"
                      type="checkbox"
                      defaultValue=""
                      id="SelectAll"
                    /> */}
                    <div className="btn-group-vertical d-flex cart-select-all flex-fill">
                      <button
                        style={{ border: 'none' }}
                        className="btn btn-outline-secondary d-flex"
                        onClick={() => {
                          addItem({
                            pid: '204',
                            img: '../../../image/product/d2a9f8e12b76b2aff433f62946427ab895c2de81.jpg',
                            quantity: 5,
                            name: 'tails&me 尾巴與我｜經典尼龍帶系列 雙色標準款多功能牽繩',
                            price: 550,
                          })
                          addingCartAnimation(true)
                          setAddingProductAmount(5)
                        }}
                      >
                        *
                      </button>
                    </div>
                    <div className="card-big-title w-120-120 text-center d-flex">
                      購物車{' '}
                    </div>
                  </div>
                </div>
                <div className="col-sm-9">
                  <h5 className="card-body to-middle-title row">
                    <div className="col-5 text-center">品名</div>
                    <div className="col-2 text-center">數量</div>
                    <div className="col-2 text-end">價格</div>
                    <div className="col-2 text-end">小計</div>
                    <div className="col-1 text-center">刪</div>
                  </h5>
                </div>
              </div>
              <hr />
            </div>

            {items.map((v, i) => {
              return (
                <div className="card mb-3 underline" key={v.pid}>
                  <div className="row g-0">
                    <div className="col-3">
                      <input
                        className="form-check-input cart-select"
                        type="checkbox"
                        defaultValue=""
                        id=""
                      />
                      <img
                        src={`../../../image/product/${v.img}`}
                        alt="name of product"
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-sm-9">
                      <div className="card-body to-middle ">
                        <h5 className="card-title card-text align-items-center row product-desc">
                          <div className="col-5">
                            <Link className="a-link" href={`/product/${v.pid}`}>
                              {v.name}
                            </Link>
                          </div>

                          <div className="col-2">
                            <div className="d-flex amount-btn-group">
                              <button
                                type="button"
                                className="btn btn-outline-secondary amount-btn-L"
                                onClick={() => {
                                  decrement(v.pid)
                                }}
                              >
                                -
                              </button>
                              <div className="form-control rounded-2 text-center amount-form">
                                {v.quantity}
                              </div>

                              <button
                                type="button"
                                className="btn btn-outline-secondary amount-btn-R"
                                onClick={() => {
                                  debouncedAddAmount(v.pid)
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="col-2 text-end">{v.price}</div>
                          <div className="col-2 text-end">{v.subtotal}</div>
                          <div className="col-1 text-center">
                            <button
                              type="button"
                              className="btn btn-outline-success amount-btn btn-X"
                              onClick={() => {
                                removeItem(v.pid)
                              }}
                            >
                              X
                            </button>
                          </div>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="card total-card border-0 mt-5">
              <h4 className="mb-3 underline-w">摘要</h4>
              <div className="d-flex justify-content-between align-items-center underline-w">
                <h5>折價券</h5>
                <div>
                  <select
                    className="form-select text-end border-0 coupon"
                    value={selectedCouponId}
                    onChange={(e) => {
                      setSelectedCouponId(Number(e.target.value))
                    }}
                  >
                    <option value="0">選擇折價券</option>
                    {/* 因option只接受純文字, 更複雜樣式建議改div + onClick 自訂下拉選單, 
                    可接受div加入html標籤dangerouslySetInnerHTML={{__html: '<span style="color: red;">紅色字</span> 文字'}} */}
                    {/* option title={} 滑鼠有懸浮註解 */}
                    {couponData.map((v) => {
                      return (
                        <option
                          key={v.coupon_id}
                          value={v.coupon_id}
                          title={`有效期至 ${dayjs(v.expiry_date)
                            .add(15, 'day')
                            .format('YYYY-MM-DD')}`}
                        >
                          【
                          {dayjs(v.expiry_date)
                            .add(15, 'day')
                            .format('YYYY-MM-DD')}
                          】 折價{v.discount_coins}元
                          {/* {dayjs(v.expiry_date).add(15, 'day').format('YYYY-MM-DD')} */}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <h5 className="card-text d-flex justify-content-between align-items-center underline-w mt-3">
                處理費/郵資 <span>NT$ 30</span>
              </h5>
              <h5 className="card-text d-flex justify-content-between align-items-center underline-w mt-3">
                總計商品{' '}
                <span>
                  <span>共計</span> {cart.totalItems} 項商品
                </span>
              </h5>

              <h4 className="card-text d-flex justify-content-between align-items-center mt-3">
                總計{' '}
                <span className="dollar">
                  <span>NT$</span> {netTotal}
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
