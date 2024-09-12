import React, { useEffect } from 'react'
import '@/styles/globals.scss'
import '@/styles/cart.scss'
import '@/styles/product.scss'
import '@/styles/TWZipCode.scss'
import '@/styles/game.scss'
import '@/styles/profile.scss'
import '@/styles/Modal.scss'
import '@/styles/member.scss'

import DefaultLayout from '@/components/layout/default-layout'
import { AuthContextProvider } from '@/components/contexts/AuthContext'
import { GameContextProvider } from '@/components/contexts/GameContext'
import { CartProvider } from '@/components/hooks/use-cart-state'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  // 或`components/layout/default-layout.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <GameContextProvider>
      <AuthContextProvider>
        <CartProvider>{getLayout(<Component {...pageProps} />)}</CartProvider>
      </AuthContextProvider>
    </GameContextProvider>
  )

  // <Component {...pageProps} />
}
