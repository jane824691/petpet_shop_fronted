'use client'

import { AuthContextProvider } from '@/components/contexts/AuthContext'
import { GameContextProvider } from '@/components/contexts/GameContext'
import { CartProvider } from '@/components/hooks/use-cart-state'
import { HeaderAnimationProvider } from '@/components/contexts/HeaderAnimationContext'
import { LanguageProvider } from '@/components/contexts/LanguageContext'
import PetpetHeader from '@/components/layout/petpetHeader'
import PetpetFooter from '@/components/layout/petpetFooter'

export default function ClientProviders({ children }) {
  return (
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
  )
}
