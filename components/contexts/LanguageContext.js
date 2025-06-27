import React, { createContext, useContext, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { zhTW } from '../../locales/zh-TW'
import { enUS } from '../../locales/en-US'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('zh-TW')
  const [messages, setMessages] = useState(zhTW)

  const changeLanguage = (newLocale) => {
    setLocale(newLocale)
    setMessages(newLocale === 'zh-TW' ? zhTW : enUS)
  }

  const value = {
    locale,
    changeLanguage,
  }

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider messages={messages} locale={locale}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
} 