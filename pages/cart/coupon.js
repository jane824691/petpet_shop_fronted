import { useCart } from '@/components/hooks/use-cart-state'
import List from '@/components/cart/list'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

// 範例資料
// type: 'amount'相減，'percent'折扣
const coupons = [
  { id: 1, name: '折100元', value: 100, type: 'amount' },
  { id: 2, name: '折300元', value: 300, type: 'amount' },
  { id: 3, name: '折550元', value: 300, type: 'amount' },
  { id: 4, name: '8折券', value: 0.2, type: 'percent' },
]

export default function Coupon() {
  //可從useCart中獲取的各方法與屬性，參考README檔中說明
  const {
    cart,
    // items,
    addItem,
    removeItem,
    // updateItem,
    updateItemQty,
    clearCart,
    isInCart,
    // increment,
    // decrement,
  } = useCart()

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

    // type: 'amount'相減，'percent'折扣
    const newNetTotal =
      coupon.type === 'amount'
        ? cart.totalPrice - coupon.value
        : Math.round(cart.totalPrice * (1 - coupon.value))

    setNetTotal(newNetTotal)
  }, [cart.totalPrice, selectedCouponId])

  return (
    <>
      <h5 className="card-text d-flex justify-content-between align-items-center">
        折價券
        <select
          className="form-select"
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
        <hr />
        <p>最後折價金額: {netTotal}</p>
      </h5>
      <hr />
    </>
  )
}
