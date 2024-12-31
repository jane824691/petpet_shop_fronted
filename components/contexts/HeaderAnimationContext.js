import React, { createContext, useContext, useState } from 'react'

export const useHeaderAnimation = () => useContext(HeaderAnimationContext)

const HeaderAnimationContext = createContext()

export const HeaderAnimationProvider = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [addingProductAmount, setAddingProductAmount] = useState(0)

  const addingCartAnimation = () => {
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 1000)
  }

  return (
    <HeaderAnimationContext.Provider
      value={{ showAnimation, addingCartAnimation, addingProductAmount, setAddingProductAmount }}
    >
      {children}
    </HeaderAnimationContext.Provider>
  )
}
