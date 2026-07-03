'use client'

import { useEffect } from 'react'
import { AuthContextProvider } from '@/components/contexts/AuthContext'
import { GameContextProvider } from '@/components/contexts/GameContext'
import { CartProvider } from '@/components/hooks/use-cart-state'
import { HeaderAnimationProvider } from '@/components/contexts/HeaderAnimationContext'
import { LanguageProvider } from '@/components/contexts/LanguageContext'
import PetpetHeader from '@/components/layout/petpetHeader'
import PetpetFooter from '@/components/layout/petpetFooter'
import { Provider } from 'react-redux'
import { store } from '@/utils/store'

export default function ClientProviders({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  return (
    <Provider store={store}>
      <LanguageProvider>
        <HeaderAnimationProvider>
          <GameContextProvider>
            <AuthContextProvider>
              <CartProvider>
                <PetpetHeader />
                <main>{children}</main>
                <PetpetFooter />
              </CartProvider>
            </AuthContextProvider>
          </GameContextProvider>
        </HeaderAnimationProvider>
      </LanguageProvider>
    </Provider>
  )
}
