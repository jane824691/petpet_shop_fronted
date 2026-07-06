import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// Next.js SSR 時沒有 window / localStorage
// 提供空實作避免伺服器端讀寫 storage 報錯
const createNoopStorage = () => ({
  // 當頁面載入 / rehydrate，讀 localStorage 的 persist:cart，還原 cart
  getItem() {
    return Promise.resolve(null)
  },
  // 當 cart 有變動（addItem、remove 等），把新 state 寫回 localStorage
  setItem(_key, value) {
    return Promise.resolve(value)
  },
  // 刪掉 persist:cart
  removeItem() {
    return Promise.resolve()
  },
})

// 瀏覽器：用 localStorage（key 會是 persist:cart）
// 由於 Next.js 在伺服器 SSR 沒有 window、沒有 localStorage
// 伺服器：用 noop = no operation（什麼都不做暫時通過），等 client 再真渲染
const persistStorage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

export default persistStorage
