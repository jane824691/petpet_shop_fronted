import React from 'react'
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

import BootstrapInit from '@/components/bootstrap/BootstrapInit'
import ClientProviders from '@/components/providers/ClientProviders'

export const metadata = {
  title: 'PetPet佩佩星球-模擬電商平台',
  description: 'PetPet佩佩星球-模擬電商平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <BootstrapInit />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
