import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.scss'
import '@/styles/cart.scss'
import '@/styles/product.scss'
import '@/styles/TWZipCode.scss'
import '@/styles/game.scss'
import '@/styles/profile.scss'
import '@/styles/Modal.scss'
import '@/styles/member.scss'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import ClientProviders from '@/components/providers/ClientProviders'

export const metadata: Metadata = {
  title: 'PetPet雿拐蔗??-璅⊥?餃?撟喳',
  description: 'PetPet雿拐蔗??-璅⊥?餃?撟喳',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-TW">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
