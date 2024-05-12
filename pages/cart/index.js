import { useCart } from '@/components/hooks/use-cart-state'
import List from '@/components/cart/list'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function CartTestIndex() {
  //可從useCart中獲取的各方法與屬性，參考README檔中說明
  const { items } = useCart()

  //跳轉用
  const router = useRouter()

  return (
    <>
      <List />
      <div className="text-center mb-5">
        <div className="d-flex justify-content-center" style={{ gap: '24px' }}>
          <Link
            className="nav-link  btn btn-outline-light"
            href="/product/list"
            role="button"
          >
            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              style={{ width: 250 }}
            >
              回商品頁
            </button>
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-lg text-white"
            style={{ width: 250 }}
            onClick={() => {
              if (items.length === 0) {
                toast.error('須至少買一項才可結帳!!!')
              } else {
                router.push('../cart/payment')
              }
            }}
          >
            前往結帳
          </button>
        </div>
      </div>

      <Toaster />
    </>
  )
}
