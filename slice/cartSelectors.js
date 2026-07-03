import { totalPrice, totalItems } from '@/components/hooks/cart-reducer-state'

// 自動從內存 cartSlice 的 state.cart 中取得 items, 再計算
export const selectCartItems = (state) => state.cart

export const selectCartTotalPrice = (state) => totalPrice(state.cart)

export const selectCartTotalItems = (state) => totalItems(state.cart)
