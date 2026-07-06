import { totalPrice, totalItems } from '@/components/hooks/cart-reducer-state'

// selector：從 Redux 全域 state 取出購物車資料給元件用
// 元件寫 useSelector(selectCartItems)，不用自己碰 state.cart 結構

export const selectCartItems = (state) => {
  const cart = state.cart
  // 相容舊版曾把陣列直接當 cart state 的情況（persist 轉換前）
  if (Array.isArray(cart)) return cart
  // 現在正確格式是 { items: [...] }
  return cart?.items ?? []
}

// 總金額不存進 Redux，用既有純函式即時計算（含 +30 假運費）
export const selectCartTotalPrice = (state) => totalPrice(selectCartItems(state))

// 商品總件數（quantity 加總）
export const selectCartTotalItems = (state) => totalItems(selectCartItems(state))
