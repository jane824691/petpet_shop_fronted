import { useCart } from '@/components/hooks/use-cart-state'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// 範例資料
// type: 'amount'相減，'percent'折扣
const coupons = [
  { id: 1, name: '折50元', value: 50, type: 'amount' },
  { id: 2, name: '折80元', value: 80, type: 'amount' },
]

export default function CartList() {
  // 使用hooks 解出所需的狀態與函式(自context)
  const { cart, items, addItem, decrement, increment, removeItem } = useCart()
  const [myProduct, setMyProduct] = useState({
    pid: '',
    img: '',
    name: '',
    price: '',
    info: '',
  })

  const [couponOptions, setCouponOptions] = useState(coupons)
  const [selectedCouponId, setSelectedCouponId] = useState(0)
  const [netTotal, setNetTotal] = useState(0)

  useEffect(() => {
    // 一開始沒套用折價券，netTotal和cart.totalPrice一樣
    if (!selectedCouponId) {
      setNetTotal(cart.totalPrice)
      return
    }

    const coupon = couponOptions.find((v) => v.id === selectedCouponId)
    console.log(coupon)
    // type: 'amount'相減，'percent'折扣
    const newNetTotal =
      coupon.type === 'amount'
        ? cart.totalPrice - coupon.value
        : Math.round(cart.totalPrice * (1 - coupon.value))

    setNetTotal(newNetTotal)
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
                <div className="col-md-2">
                  <div className="d-flex">
                    {/* <input
                      className="form-check-input cart-select-all"
                      type="checkbox"
                      defaultValue=""
                      id="SelectAll"
                    /> */}
                    <div className="btn-group-vertical d-flex cart-select-all">
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
                        }}
                      >
                        *
                      </button>
                    </div>
                    <div className="card-big-title w-120-120 text-end d-flex">
                      購物車{' '}
                    </div>
                  </div>
                </div>
                <div className="col-md-10">
                  <h5 className="card-body to-middle-title row">
                    <div className="col-5 text-center">

                      品名
                    </div>
                    <div className="col-2 text-end">數量</div>
                    <div className="col-2 text-end">價格</div>
                    <div className="col-2 text-end">小計</div>
                    <div className="col-1 text-end">刪除</div>
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
                    <div className="col-md-9">
                      <div className="card-body to-middle ">
                        <h5 className="card-title card-text align-items-center row">
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
                                  increment(v.pid)
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
              {/* <div className="d-flex justify-content-between align-items-center underline-w">
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
                    {couponOptions.map((v) => {
                      return (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div> */}

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
                <span className="dollar" style={{ fontSize: '24px' }}>
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
