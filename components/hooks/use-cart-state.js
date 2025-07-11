import React, {
  useState,
  //useReducer,
  useContext,
  createContext,
  useEffect,
} from 'react'
import {
  init,
  initState,
  addOne,
  findOneById,
  updateOne,
  removeOne,
  incrementOne,
  decrementOne,
  generateCartState,
} from './cart-reducer-state'
import useLocalStorage from './use-localstorage'
import { useLanguage } from '@/components/contexts/LanguageContext'

const CartContext = createContext(null)

// cartItem = {
//   id: '',
//   quantity: 0,
//   name: '',           // 中文名稱
//   name_en: '',        // 英文名稱
//   price: 0,
// }

// cartState = {
//   items: cartItems,
//   isEmpty: true,
//   totalItems: 0,
//   cartTotal: 0,
// }

export const CartProvider = ({
  children,
  initialCartItems = [], //初始化購物車的加入項目
  localStorageKey = 'cart', //初始化localStorage的鍵名
}) => {
  // localStorage中只儲存 items。如果localStorage有此鍵中的值，則套入使用作為初始items。
  let items = initialCartItems

  if (!items.length) {
    try {
      // 修正nextjs中window is undefined的問題
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(localStorageKey)
        // 剖析存儲的json，如果沒有則返回初始值
        items = item ? JSON.parse(item) : []
      }
    } catch (error) {
      items = []
    }
  }

  // 初始化 cartItems, cartState
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [cartState, setCartState] = useState(init(initialCartItems))

  // 初始化 setValue(localStoage), setValue用於存入localStorage中
  const [storedValue, setValue] = useLocalStorage(localStorageKey, items)

  // 取得當前語言
  const { locale } = useLanguage()

  // 當 cartItems 更動時 -> 更動 localStorage 中的值 -> 更動 cartState
  useEffect(() => {
    // 使用字串比較
    if (JSON.stringify(cartItems) !== storedValue) {
      setValue(cartItems)
    }
    // 有更動時，重新設定cartState
    setCartState(generateCartState(cartState, cartItems))

    // eslint-disable-next-line
  }, [cartItems])

  // 當語言切換時，重新計算購物車狀態以更新商品名稱
  useEffect(() => {
    setCartState(generateCartState(cartState, cartItems))
  }, [locale])

  /**
   * 加入新項目，重覆項目 quantity: quantity + 1
   * 同時存中英文名稱到對應欄位
   */
  const addItem = (item) => {
    // 確保同時存中英文名稱
    const itemWithBothLanguages = {
      ...item,
      // 商品名稱：如果 item 有 name_zh 和 name_en，則使用；否則根據當前語言設定對應欄位
      name: item.name_zh || item.name || item.product_name, // 中文名稱
      name_en: item.name_en || item.product_name_en || item.name || item.product_name, // 英文名稱
    }

    setCartItems(addOne(cartItems, itemWithBothLanguages))
  }
  /**
   * 給定一pid值，將這商品移出陣列中
   */
  const removeItem = (pid) => {
    setCartItems(removeOne(cartItems, pid))
  }
  /**
   * 給定一item物件，更新其中的屬性值(依照pid為準)
   */
  const updateItem = (item) => {
    setCartItems(updateOne(cartItems, item))
  }
  /**
   * 給定一pid與quantity，更新某個項目的數量
   */
  const updateItemQty = (pid, quantity) => {
    const item = findOneById(cartItems, pid)
    // 如果沒有pid，則不更新
    if (!item.pid) return
    // 更新項目
    const updateItem = { ...item, quantity }
    setCartItems(updateOne(cartItems, updateItem))
  }
  /**
   * 清空整個購物車
   */
  const clearCart = () => {
    setCartItems([])
  }
  /**
   * 給定一pid值，回傳是否存在於購物車中
   */
  const isInCart = (pid) => {
    return cartItems.some((item) => item.pid === pid)
  }
  /**
   * 給定一pid值，有尋找到商品時，設定quantity: quantity + 1
   */
  const increment = (pid) => {
    setCartItems(incrementOne(cartItems, pid))
  }
  /**
   * 給定一pid值，有尋找到商品時，設定quantity: quantity - 1，但 quantity 最小值為1
   */
  const decrement = (pid) => {
    setCartItems(decrementOne(cartItems, pid))
  }

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        items: cartState.items, //items與cartState.items差了一個subtoal屬性
        addItem,
        removeItem,
        updateItem,
        updateItemQty,
        clearCart,
        isInCart,
        increment,
        decrement,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)