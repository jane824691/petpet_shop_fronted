import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from 'react'
import {
  init,
  addOne,
  findOneById,
  updateOne,
  removeOne,
  incrementOne,
  decrementOne,
  generateCartState,
  CartItem,
  CartState,
} from './cart-reducer-state'
import useLocalStorage from './use-localstorage'
import { useLanguage } from '@/components/contexts/LanguageContext'

interface CartContextType {
  cart: CartState
  items: (CartItem & { subtotal: number })[]
  addItem: (item: CartItem) => void
  removeItem: (pid: string) => void
  updateItem: (item: CartItem) => void
  updateItemQty: (pid: string, quantity: number) => void
  clearCart: () => void
  isInCart: (pid: string) => boolean
  increment: (pid: string) => void
  decrement: (pid: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

interface CartProviderProps {
  children: ReactNode
  initialCartItems?: CartItem[]
  localStorageKey?: string
}

export const CartProvider = ({
  children,
  initialCartItems = [], //初始化購物車的加入項目
  localStorageKey = 'cart',  //初始化localStorage的鍵名
}: CartProviderProps) => {
  // localStorage中只儲存 items。如果localStorage有此鍵中的值，則套入使用作為初始items。
  let items: CartItem[] = initialCartItems

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
  const [cartItems, setCartItems] = useState<CartItem[]>(items)
  const [cartState, setCartState] = useState(() => init(items))

  // 初始化 setValue(localStoage), setValue用於存入localStorage中
  const [storedValue, setValue] = useLocalStorage(localStorageKey, items)

  // 取得當前語言
  const { locale } = useLanguage()


  // 當 cartItems 更動時 -> 更動 localStorage 中的值 -> 更動 cartState
  useEffect(() => {
    // 使用字串比較
    if (JSON.stringify(cartItems) !== JSON.stringify(storedValue)) {
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
  const addItem = (item: CartItem) => {
    // 確保同時存中英文名稱
    const itemWithBothLanguages = {
      ...item,
      // 商品名稱：如果 item 有 name_zh 和 name_en，則使用；否則根據當前語言設定對應欄位
      name: item.name_zh || item.name || item.product_name,
      name_en:
        item.name_en ??
        item.product_name_en ??
        item.name ??
        item.product_name ??
        '',
    }
    setCartItems(addOne(cartItems, itemWithBothLanguages))
  }


  /**
   * 給定一pid值，將這商品移出陣列中
   */
  const removeItem = (pid: string) => {
    setCartItems(removeOne(cartItems, pid))
  }


  /**
   * 給定一item物件，更新其中的屬性值(依照pid為準)
   */
  const updateItem = (item: CartItem) => {
    setCartItems(updateOne(cartItems, item))
  }


  /**
   * 給定一pid與quantity，更新某個項目的數量
   */
  const updateItemQty = (pid: string, quantity: number) => {
    const item = findOneById(cartItems, pid)
    if (!item?.pid) return
    const updatedItem = { ...item, quantity }
    setCartItems(updateOne(cartItems, updatedItem))
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
  const isInCart = (pid: string) => {
    return cartItems.some((item) => item.pid === pid)
  }


  /**
   * 給定一pid值，有尋找到商品時，設定quantity: quantity + 1
   */
  const increment = (pid: string) => {
    setCartItems(incrementOne(cartItems, pid))
  }


  /**
   * 給定一pid值，有尋找到商品時，設定quantity: quantity - 1，但 quantity 最小值為1
   */
  const decrement = (pid: string) => {
    setCartItems(decrementOne(cartItems, pid))
  }

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        items: cartState.items,
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

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
