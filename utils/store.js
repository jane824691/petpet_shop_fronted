import { configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  createMigrate,
  // redux-persist 內部 action，會帶非 plain object，需略過 serializable 檢查
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import cartReducer from '@/slice/cartSlice'
import persistStorage from '@/utils/persistStorage'

// 舊資料格式轉換：以前 cart 可能是陣列，現在要是 { items: [] }
const cartMigrations = {
  0: (state) => {
    if (Array.isArray(state)) return { items: state }
    if (state?.items) return state
    return { items: [] }
  },
}

// persist 設定：決定存哪、怎麼讀回來
const cartPersistConfig = {
  key: 'cart', // localStorage 實際 key - persist:cart
  version: 0, // 資料結構改版時遞增，搭配 migrate
  storage: persistStorage,
  migrate: createMigrate(cartMigrations, { debug: false }),
}

// 用 persistReducer 包住 cartReducer，自動在變更時寫入 localStorage
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer, // 全域 state 結構：{ cart: { items: [...] } }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的 action，不然 console 會噴警告
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// 控制 persist 生命週期（rehydrate 等），給 ReduxProvider 的 PersistGate 用
export const persistor = persistStore(store)
