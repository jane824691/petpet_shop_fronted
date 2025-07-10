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
import { useIntl } from 'react-intl'

function OrderSteps() {
  const intl = useIntl()
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
    name_en: '',
    phone: '',
    email: '',
    address: '',
    address_en: '',
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
  const progressNames = [
    intl.formatMessage({ id: 'cart.shoppingCart' }), 
    intl.formatMessage({ id: 'cart.payment' }), 
    intl.formatMessage({ id: 'cart.orderDetails' })
  ] // Cart, Payment, OrderDetail

  // 上一步 下一步按鈕
  const next = () => {
    if (step === 1) {
      if (!(items.length > 0)) {
        toast.error(intl.formatMessage({ id: 'cart.needAtLeastOneItem' }))
        return
      }
      const authDataString = localStorage.getItem('auther')
      if (!authDataString) {
        // console.log('No "auther" data found.')
        toast.error(intl.formatMessage({ id: 'cart.pleaseLoginFirst' }))
        return
      }
    }
    // 購物車用檢查
    if (step === 2) {
      const { name, address, phone, postcode } = paymentData

      // 有錯誤訊息會跳出警告，不會到"下一步"
      const errors = []

      if (!name) errors.push(intl.formatMessage({ id: 'cart.nameNotFilled' }))

      if (!address) errors.push(intl.formatMessage({ id: 'cart.addressNotFilled' }))

      if (!postcode) errors.push(intl.formatMessage({ id: 'cart.postcodeNotFilled' }))

      if (!phone) errors.push(intl.formatMessage({ id: 'cart.phoneNotFilled' }))

      if (errors.length > 0) {
        toast.error(errors.join(', '))
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
      if (paymentData.pay_way === intl.formatMessage({ id: 'cart.cashOnDelivery' })) {
        toast.success(intl.formatMessage({ id: 'cart.orderCompletedRedirect' }))
        setTimeout(() => {
          router.push('/member/member-orderList')
          clearCart()
        }, 3000)
      } else {
        // 信用卡付款
        toast.success(intl.formatMessage({ id: 'cart.orderCompletedPayment' }))
        sessionStorage.setItem("last_oid", responseData.result.order_list.insertId)

        setTimeout(() => {
          handlePayment(responseData.result.order_list.insertId) // 後端送回前端成功 & 建好的oid
          clearCart()
        }, 3000)
      }

    } else {
      toast.error(intl.formatMessage({ id: 'cart.orderCreationFailed' }))
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
      <div className="d-flex flex-column flex-sm-row justify-content-center py-3 gap-4 mx-4 mx-sm-5 mb-5">
        <button
          type="button"
          className="btn btn-outline-primary btn-lg btn pro-shadow px-5"
          onClick={prev}
        >
          {step === 1 ? intl.formatMessage({ id: 'cart.backToShop' }) : intl.formatMessage({ id: 'common.back' })}
        </button>

        <button
          type="button"
          className="btn btn-danger btn-lg btn pro-shadow px-5 text-white"
          onClick={next}
        >
          {step === maxSteps ? intl.formatMessage({ id: 'cart.completeOrder' }) : intl.formatMessage({ id: 'cart.confirmCheckout' })}
        </button>
      </div>
      <Toaster />
    </>
  )
}

export default OrderSteps
