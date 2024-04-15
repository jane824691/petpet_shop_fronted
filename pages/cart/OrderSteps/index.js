// 子頁面(區域)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cart from './sub-pages/Cart'
import Payment from './sub-pages/Payment'
import OrderDetail from './sub-pages/OrderDetail'
import toast, { Toaster } from 'react-hot-toast'
import { ORDER_LIST_ADD } from '@/components/my-const'
import { GET_MEMBER_DATA } from '@/components/my-const'
import { useCart } from '@/components/hooks/use-cart-state'
import { totalPrice } from '@/components/hooks/cart-reducer-state'

// 進度條
import ProgressBar from './components/ProgressBar'

function OrderSteps() {
  const { items, clearCart } = useCart()

  //跳轉用
  const router = useRouter()

  const maxSteps = 3

  const [step, setStep] = useState(1)

  const [errors, setErrors] = useState([])

  // 狀態的範例，都集中在這裡接收
  const [cartData, setCartData] = useState([])

  // 狀態的範例，都集中在這裡接收
  const [selectedProducts, setSelectedProducts] = useState({})

  // console.log(selectedProducts);
  const [payment, setPaymentData] = useState({
    sid: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    pay_way: '',
  })
  const [netTotal, setNetTotal] = useState(0)
  console.log(payment)

  const [sid, setSid] = useState('') //抓到sid後存起來給後面抓取會員訂單資料用

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 檢查 localStorage 中是否存在 'auther'，以及 'auther' 是否有有效的 sid
        const authDataString = localStorage.getItem('auther')
        if (!authDataString) {
          console.log('No "auther" data found.')
          return
        }
        const authData = JSON.parse(authDataString)
        if (!authData || !authData.sid) {
          console.log('No valid "auther" data found.')
          return
        }
        const sid = authData.sid
        console.log('sid', sid)
        setSid(sid)
      } catch (error) {
        console.error('Error fetching mydata:', error)
      }
    }

    // 呼叫 fetchData 以觸發資料載入
    fetchData()
  }, [router.query.sid])

  // 動態元件語法
  const components = [Cart, Payment, OrderDetail]
  const BlockComponent = components[step - 1]

  // 進度條使用
  const progressNames = ['購物車', '付款', '明細']

  // 上一步 下一步按鈕
  const next = () => {
    if (step === 1) {
      if (!(items.length > 0)) {
        toast.error('至少有一項商品才可結帳!')
        return
      }
    }
    // 購物車用檢查
    if (step === 2) {
      const { name, address, phone, postcode } = payment

      // 有錯誤訊息會跳出警告，不會到"下一步"
      const errors = []

      if (!name) errors.push('姓名沒填~ ')

      if (!address) errors.push('住址沒填~ ')

      if (!postcode) errors.push('郵遞區號沒填~ ')

      if (!phone) errors.push('電話沒填~ ')

      if (errors.length > 0) {
        toast.error(errors.join(','))
        return
      }
    }

    // 沒錯誤才會到下一步
    if (step < maxSteps) setStep(step + 1)

    if (step === maxSteps) {
      setNetTotal(() => {
        return totalPrice(items)
      })
      console.log(netTotal, '要在這邊變更總金額')
      onSubmit()
    }
  }

  // 上一步按鈕
  const prev = () => {
    if (step > 1) setStep(step - 1)
    if (step === 1) router.push('../../product')
  }

  const requestData = {
    ...payment,
    sid: sid,
    netTotal: netTotal,
    pid: selectedProducts.pid,
    sale_price: selectedProducts.sale_price,
    actual_amount: selectedProducts.actual_amount,
    email: payment.email,
  }
  console.log(requestData)

  const onSubmit = async () => {
    const r = await fetch(ORDER_LIST_ADD, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      toast.success('恭喜完成訂單!! 3秒後跳轉回商城')
      setTimeout(() => {
        router.push('../../product')
        clearCart()
      }, 3000)
    } else {
      toast.error('訂單新增失敗, 請聯繫客服')
    }
  }

  return (
    <>
      {/* 子頁面區域 */}
      <div className="order-steps">
        <BlockComponent
          payment={payment}
          setPaymentData={setPaymentData}
          netTotal={netTotal}
          setNetTotal={setNetTotal}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          //pid={pid}
        />
      </div>
      {/* 按鈕 */}
      <div
        style={{
          margin: '0 auto',
          textAlign: 'center',
          paddingBottom: '3.75rem',
        }}
      >
        <button
          onClick={prev}
          style={{ width: 250, marginRight: 20 }}
          className="btn btn-outline-primary btn-lg"
        >
          {step === 1 ? '回到商城' : '回前一頁'}
        </button>
        <button
          className="btn btn-danger btn-lg text-white"
          onClick={next}
          style={{ width: 250 }}
        >
          {step === maxSteps ? '完成訂單' : '確認結帳'}
        </button>
      </div>
      <Toaster />
    </>
  )
}

export default OrderSteps
