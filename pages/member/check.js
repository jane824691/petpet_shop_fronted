//測試會員取得自己資料
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/components/contexts/AuthContext'
import { useRouter } from 'next/router'
import { CHECK } from '@/components/my-const'

export default function Profile() {
  const [data, setData] = useState({}) // 暫存取得的資料
  const { auther } = useContext(AuthContext)
  //跳轉路由專用
  const router = useRouter()

  //非同步操作，若要進入/profile查看個人檔案，沒找到資料的話會跳回首頁(根目錄)
  useEffect(() => {
    if (!auther.account) {
      router.push('/')
      //使用者查看個人檔案
    } else {
      fetch(CHECK, {
        //參考info.txt格式設計
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auther.token,
        },
      })
        .then((r) => r.json())
        .then((result) => {
          if (result.success) {
            setData(result.data)
          }
        })
        .catch((ex) => console.log(ex))
    }
  }, [])

  return (
    <>
      <pre>{JSON.stringify(data, null, 4)}</pre>

      <Head>
        <title>會員資料</title>
      </Head>
    </>
  )
}
