import List from '@/components/cart/list'
import { Toaster } from 'react-hot-toast'

export default function Cart() {

  return (
    <>

      <List />
      {/* 以下為測試按鈕 */}

      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
