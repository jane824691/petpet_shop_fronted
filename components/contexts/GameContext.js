import React, { createContext, useState } from 'react'
const GameContext = createContext({})
export default GameContext
export const themes = {
  default: {
    name: 'default',
    className: 'success',
  },
  info: {
    name: 'info',
    className: 'info',
  },
  secondary: {
    name: 'secondary',
    className: 'secondary',
  },
}
export const GameContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.default)
  return (
    <GameContext.Provider value={{ theme, setTheme }}>
      {children}
    </GameContext.Provider>
  )
}
