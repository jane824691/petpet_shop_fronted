import List from '@/components/cart/list'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { useCart } from '@../../../components/hooks/use-cart-state'

export default function Cart() {
  //可從useCart中獲取的各方法與屬性，參考README檔中說明
  const { addItem, updateItemQty, clearCart, isInCart, removeItem } = useCart()
  const [myProduct, setMyProduct] = useState({
    pid: '',
    img: '',
    name: '',
    price: '',
    info: '',
  })
  return (
    <>

      <List />
      {/* 以下為測試按鈕 */}

      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
