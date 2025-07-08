import List from '@/components/cart/list'
import { Toaster } from 'react-hot-toast'
import { useIntl } from 'react-intl'

export default function Cart(props) {
  const intl = useIntl()
  const { paymentData, setPaymentData } = props

  return (
    <>
      <h3 className="mx-5 py-3 pt-5">{intl.formatMessage({ id: 'cart.shoppingCart' })}</h3>
      <List paymentData={paymentData} setPaymentData={setPaymentData}/>
      {/* 以下為測試按鈕 */}

      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
