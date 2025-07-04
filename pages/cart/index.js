import { useCart } from '@/components/hooks/use-cart-state'
import List from '@/components/cart/list'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

export default function CartTestIndex() {
  const intl = useIntl()
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
              {intl.formatMessage({ id: 'product.backToProducts' })}
            </button>
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-lg text-white"
            style={{ width: 250 }}
            onClick={() => {
              if (items.length === 0) {
                toast.error(intl.formatMessage({ id: 'cart.needAtLeastOneItem' }))
              } else {
                router.push('../cart/payment')
              }
            }}
          >
            {intl.formatMessage({ id: 'cart.checkout' })}
          </button>
        </div>
      </div>

      <Toaster />
    </>
  )
}
