import { createSlice } from '@reduxjs/toolkit'
import {
  initItems,
  addOne,
  incrementOne,
  decrementOne,
  removeOne,
} from '@/components/hooks/cart-reducer-state'

export const cartSlice = createSlice({
  name: 'cart',
  // initialState: [],
  initialState: initItems,
  reducers: {
    updateOne: (state, action) => {
      console.log('action.payload====', action.payload)
      console.log('action====', action)
    },
    addItem: (state, action) => {
      return addOne(state, action.payload)
    },
    increment: (state, action) => {
        return incrementOne(state, action.payload)
    },
    decrement: (state, action) => {
        return decrementOne(state, action.payload)
    },
    remove: (state, action) => {
        return removeOne(state, action.payload)
    },
    clearCart: () => {
      return initItems
    },
  },
  // removeItem: (state, action) => {
  //     // state.cart.items =
  // },
})

export const { updateOne, addItem, increment, decrement, remove, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
