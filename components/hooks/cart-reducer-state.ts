export interface CartItem {
  pid: string
  quantity: number
  price: number
  name: string
  name_en: string
  product_name?: string
  product_name_en?: string
  [key: string]: any
}

export interface CartState {
  items: (CartItem & { subtotal: number })[]
  isEmpty: boolean
  totalItems: number
  totalPrice: number
  subtotal: number
}

export const initItems: CartItem[] = []

export const initState: CartState = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalPrice: 0,
  subtotal: 0,
}

/**
 * `findOneById(items, pid)` 依照某pid找出項目。如果沒有找到，則返回空物件。
 */
export const findOneById = (
  items: CartItem[],
  pid: string
): CartItem | undefined => {
  return items.find((item) => String(item.pid) === String(pid))
}

/**
 * `updateOne(items, updateItem)` 更新項目 (quantity, color, name, price...)。updateItem會覆蓋原有的item。
 * 原本js寫法
 * export const updateOne = (items, updateItem) => {
  return items.map((item) => {
    if (String(item.pid) === String(updateItem.pid)) return updateItem
    else return item
  })
}
 */
export const updateOne = (items: CartItem[], updateItem: CartItem): CartItem[] => {
  return items.map((item) => {
    if (String(item.pid) === String(updateItem.pid)) return updateItem
    else return item
  })
}


/**
 * `incrementOne(items, pid)` 依照某pid更新項目的數量+1
 */
export const incrementOne = (items: CartItem[], pid: string): CartItem[] => {
  return items.map((item) => {
    if (String(item.pid) === String(pid)) {
      return { ...item, quantity: item.quantity + 1 }
    }
    return item
  })
}


/**
 * `decrementOne(items, pid)` 依照某pid更新項目的數量-1。最小為1。
 */
export const decrementOne = (items: CartItem[], pid: string): CartItem[] => {
  return items.map((item) => {
    if (String(item.pid) === String(pid)) {
      return {
        ...item,
        quantity: item.quantity - 1 > 0 ? item.quantity - 1 : 1,
      }
    }
    return item
  })
}


/**
 * `addOne(items, newItem)` 加入項目於items中。同pid項目只會增加數量，不會重複加入。
 */
export const addOne = (items: CartItem[], newItem: CartItem): CartItem[] => {
  // 尋找是否有已存在的索引值
  const foundIndex = items.findIndex(
    (item) => String(item.pid) === String(newItem.pid)
  )

  // 如果有存在，加入項目(以給定的quantity相加，或沒給定時quantity+1)
  if (foundIndex > -1) {
    const item = items[foundIndex]

    // 新的數量為舊的數量加上新的數量
    const newQuantity = item.quantity + newItem.quantity

    // 使用更新項目
    return updateOne(items, { ...item, quantity: newQuantity })
  }

  // 如果沒有存在，加入新項目
  return [...items, newItem]
}


/**
 * `removeOne(items, pid)` 移除項目於items中。同pid項目只會移除一個。
 */
export const removeOne = (items: CartItem[], pid: string): CartItem[] => {
  return items.filter((item) => String(item.pid) !== String(pid))
}


// 以下為最後計算三者itemTotal(每項目種小計), totalItems(整體項目), cartTotal(整體總計)
/**
 * `subtotalPrice(items)` 每項目種價錢小計。
 */
export const subtotalPrice = (
  items: CartItem[]
): (CartItem & { subtotal: number })[] =>
  items.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }))


/**
 * `totalPrice(items)` 整體項目價錢總計。
 * +30 是寫死的假運費
 */
export const totalPrice = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0) + 30


/**
 * `totalItems(items)` 整體項目數量。
 */
export const totalItems = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)


// 最後將更新後的state，與initialState整理成新的state
export const generateCartState = (
  state: Partial<CartState>,
  items: CartItem[]
): CartState => {
  const isEmpty = items.length === 0

  return {
    ...initState,
    ...state,
    items: subtotalPrice(items),
    totalItems: totalItems(items),
    totalPrice: totalPrice(items),
    isEmpty,
  }
}


// 初始化用
export const init = (items: CartItem[]): CartState => {
  return generateCartState({}, items)
}
