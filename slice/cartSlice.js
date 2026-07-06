import { createSlice } from '@reduxjs/toolkit'
import {
  initItems,
  updateOne,
  addOne,
  incrementOne,
  decrementOne,
  removeOne,
} from '@/components/hooks/cart-reducer-state'

// redux-persist 需要物件當 state，不能直接用陣列 [] 當 root
// 所以包成 { items: [] }，items 才是購物車商品陣列
const initialState = { items: initItems }

export const cartSlice = createSlice({
  name: 'cart', // action 前綴會變成 cart/addItem、cart/remove 等
  initialState,
  reducers: {
    // 更新單一商品（依 pid 覆蓋）
    updateItem: (state, action) => {
      // 沿用 cart-reducer-state.ts 的純函式，不重寫邏輯
      state.items = updateOne(state.items, action.payload)
    },
    // 加入商品；同 pid 會累加 quantity
    addItem: (state, action) => {
      state.items = addOne(state.items, action.payload)
    },
    increment: (state, action) => {
      state.items = incrementOne(state.items, action.payload)
    },
    decrement: (state, action) => {
      state.items = decrementOne(state.items, action.payload)
    },
    remove: (state, action) => {
      state.items = removeOne(state.items, action.payload)
    },
    clearCart: (state) => {
      state.items = initItems
    },
  },
})

// 元件用 dispatch(addItem(...)) 等方式觸發
export const { updateItem, addItem, increment, decrement, remove, clearCart } =
  cartSlice.actions

// 給 store.js 的 reducer: { cart: cartReducer } 使用
export default cartSlice.reducer
