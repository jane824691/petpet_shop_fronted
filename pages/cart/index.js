import { useCart } from '@/components/hooks/use-cart-state'
import List from '@/components/cart/list'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

// cart init
// initialState = {
//   items: [],
//   isEmpty: true,
//   totalItems: 0,
//   cartTotal: 0,
// }

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
              items == 0
                ? (console.log('items 為 0'),
                  toast.error('須至少買一項才可結帳!!!'))
                : router.push('../cart/payment')
            }}
          >
            前往結帳
          </button>
        </div>
      </div>

      {/* 以下為測試按鈕 */}
      {/* <h4>測試按鈕</h4>
      <div className="btn-group-vertical">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            console.log(cart)
            toast.success('已在主控台記錄cart狀態')
          }}
        >
          主控台記錄cart狀態
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            addItem({
              id: '111',
              quantity: 5,
              name: '西莎犬用餐盒100克【田園香米燉牛肉】(24入)',
              price: 15000,
              color: 'red',
              size: '',
            })
            toast.success('新增項目 id=111')
          }}
        >
          新增項目(id=111, x5)
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            addItem({
              id: '222',
              quantity: 1,
              name: 'tails&me 尾巴與我｜APUJAN尾巴探險記 墨點刷毛背心—黑',
              price: 19000,
              color: '',
              size: '',
            })
            toast.success('新增項目 id=222')
          }}
        >
          新增項目(id=222, x1)
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            removeItem('222')
            toast.success('移除項目 id=222')
          }}
        >
          移除項目(id=222)
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            updateItemQty(222, 7)
            toast.success('更新項目 id=222 的數量為 7')
          }}
        >
          更新項目 id=222 的數量為 7
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            updateItemQty(111, 99)
            toast.success('更新項目 id=111 的數量為 99')
          }}
        >
          更新項目 id=111 的數量為 99
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            clearCart()
            toast.success('已清除整個購物車')
          }}
        >
          清除整個購物車
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            if (isInCart('222')) {
              toast.success('有id=222在購物車中')
            } else {
              toast.error('沒有id=222在購物車中')
            }
          }}
        >
          檢查id=222是否有在購物車中
        </button>
      </div> */}
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
