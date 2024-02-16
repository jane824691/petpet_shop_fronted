import Link from 'next/link'
import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export default AuthContext

// 登入狀態: 可以登入, 可以登出, 狀態資料(會員id, account, token)
export const initAuth = {
  sid: 0,
  account: '',
  token: '',
}

export const AuthContextProvider = ({ children }) => {
  const [auther, setAuther] = useState(initAuth)
  useEffect(() => {
    //登入資料放在localstorage,getItem自定義key名稱(auth要改名)
    const str = localStorage.getItem('auther')
    if (str) {
      try {
        const data = JSON.parse(str)
        if (data.sid && data.account) {
          const { sid, account, token } = data
          setAuther({ sid, account, token })
        }
      } catch (ex) {
        console.error('Error parsing authentication data:', ex)
      }
    }
  }, [])

  // 登出
  const logout = () => {
    // 登出時, 清除 localStorage 的記錄
    localStorage.removeItem('auther')
    setAuther(initAuth)
  }

  return (
    <AuthContext.Provider value={{ auther, setAuther, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
