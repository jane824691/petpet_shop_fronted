// 子頁面(區域)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cart from './sub-pages/Cart'
import Payment from './sub-pages/Payment'
import OrderDetail from './sub-pages/OrderDetail'
import toast, { Toaster } from 'react-hot-toast'
import { ORDER_LIST_ADD, PAYMENT_CREATE } from '@/components/my-const'
import { useCart } from '@/components/hooks/use-cart-state'
import { totalPrice } from '@/components/hooks/cart-reducer-state'

function OrderSteps() {
  const { items, clearCart } = useCart()

  //跳轉用
  const router = useRouter()

  const maxSteps = 3

  const [step, setStep] = useState(1)

  // radio狀態都集中在這裡接收
  const [confirmedProductsInfo, setConfirmedProductsInfo] = useState({})

  const [paymentData, setPaymentData] = useState({
    sid: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    pay_way: '',
    pid: '',
    sale_price: '',
    actual_amount: '',
    coupon_id: '',
    discount_coins: '',
  })

  const [netTotal, setNetTotal] = useState(0)

  const [sid, setSid] = useState('') // 抓到sid後存起來給後面抓取會員訂單資料用
  // const [oid, setOid] = useState('') // 成立訂單取得oid, 丟給支付用

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 檢查 localStorage 中是否存在 'auther'，以及 'auther' 是否有有效的 sid
        const authDataString = localStorage.getItem('auther')
        if (!authDataString) {
          return
        }
        const authData = JSON.parse(authDataString)
        if (!authData || !authData.sid) {
          return
        }
        const sid = authData.sid
        setSid(sid)
      } catch (error) {
        // console.error('Error fetching mydata:', error)
      }
    }

    // 呼叫 fetchData 以觸發資料載入
    fetchData()
  }, [router.query.sid])

  // 動態元件語法
  const components = [Cart, Payment, OrderDetail]
  const BlockComponent = components[step - 1]

  // 進度條使用
  const progressNames = ['購物車', '付款', '明細'] // Cart, Payment, OrderDetail

  // 上一步 下一步按鈕
  const next = () => {
    if (step === 1) {
      if (!(items.length > 0)) {
        toast.error('至少有一項商品才可結帳!')
        return
      }
      const authDataString = localStorage.getItem('auther')
      if (!authDataString) {
        // console.log('No "auther" data found.')
        toast.error('煩請先登入才可結帳!')
        return
      }
    }
    // 購物車用檢查
    if (step === 2) {
      const { name, address, phone, postcode } = paymentData

      // 有錯誤訊息會跳出警告，不會到"下一步"
      const errors = []

      if (!name) errors.push('姓名沒填')

      if (!address) errors.push(' 住址沒填')

      if (!postcode) errors.push(' 郵遞區號沒填')

      if (!phone) errors.push(' 電話沒填')

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

      onSubmit()
    }
  }

  // 上一步按鈕
  const prev = () => {
    if (step > 1) setStep(step - 1)
    if (step === 1) router.push('../../product')
  }

  // 準備發api打回後端, 建立訂單
  const requestData = {
    ...paymentData,
    sid: sid,
    pid: confirmedProductsInfo.pid
      ? confirmedProductsInfo.pid.map((item) => Number(item)) // 確保陣列的內容皆為數字而非字串
      : [],
    actual_amount: confirmedProductsInfo.actual_amount
      ? confirmedProductsInfo.actual_amount
      : '',
  }

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
      toast.success('恭喜完成訂單!! 3秒後準備前往付款')
      setTimeout(() => {
        handlePayment(responseData.result.order_list.insertId)
        clearCart()
      }, 3000)
    } else {
      toast.error('訂單新增失敗, 請聯繫客服')
    }
  }

  // React 按鈕觸發付款
  const handlePayment = async (oid) => {
    const newWindow = window.open('', '_blank'); // 先開視窗，避免 popup 被攔截

    const res = await fetch(PAYMENT_CREATE  + `/${oid}`, {
      method: 'GET',
    });
    
    const html = await res.text();

    if (newWindow) {
      newWindow.document.write(html); // 將跳轉 HTML 寫入新視窗
      newWindow.document.close();     // 必須 close 才能執行內部的 <script>
    }
  };


  return (
    <>
      {/* 子頁面區域 */}
      <div className="order-steps">
        <BlockComponent
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          netTotal={netTotal}
          setNetTotal={setNetTotal}
          confirmedProductsInfo={confirmedProductsInfo}
          setConfirmedProductsInfo={setConfirmedProductsInfo}
        />
      </div>

      {/* 按鈕 */}
      <div className="btnPart">
        <button
          type="button"
          onClick={prev}
          className="btn btn-outline-primary btn-lg px-3 stepBtn"
        >
          {step === 1 ? '回到商城' : '回前一頁'}
        </button>
        <button
          type="button"
          className="btn btn-danger btn-lg text-white stepBtn"
          onClick={next}
        >
          {step === maxSteps ? '完成訂單' : '確認結帳'}
        </button>
      </div>
      <Toaster />
    </>
  )
}

export default OrderSteps
