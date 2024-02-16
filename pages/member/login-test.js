import { useContext, useState } from 'react'
import Image from 'next/image'
//import styles from '@/css/home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LOGIN } from '@/components/my-const'
import AuthContext from '@/components/contexts/AuthContext'

export default function Login() {
  const [user, setUser] = useState({
    account: '',
    password: '',
  })
  const router = useRouter()
  const { setAuther } = useContext(AuthContext)
  const postForm = async (e) => {
    e.preventDefault() //不要讓表單以傳統方式送出

    const r = await fetch(LOGIN, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await r.json()
    console.log(data)
    if (data.success) {
      const { sid, account, token } = data
      // 成功登入時, 寫入 localStorage 做長時間的狀態保存，網頁刷新時仍保持登入狀態
      localStorage.setItem('auth', JSON.stringify({ sid, account, token }))
      setAuther({ sid, account, token })
      router.push('/')
    }
  }

  // 顯示密碼的勾選狀態
  const [show, setShow] = useState(false)

  // 各欄位共用事件處理函式
  const handleFieldChange = (e) => {
    console.log(e.target.type, e.target.name, e.target.value, e.target.checked)
    const newUser = { ...user, [e.target.name]: e.target.value }

    setUser(newUser)
  }
  return (
    <>
      <h3 className="py-1 mx-auto" style={{ width: '10rem' }}>
        會員登入
      </h3>
      <div className="d-flex justify-content-center position-relative">
        <Image
          src="/pics/heart.png"
          width="600"
          height="400"
          alt="愛心"
          priority={true}
        ></Image>
        <form name="form1" onSubmit={postForm}>
          <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column my-5">
            <div
              className="input-group mb-4 rounded-5 mx-auto"
              style={{ width: '17rem' }}
            >
              <span
                className="input-group-text border border-danger text-white rounded-0"
                style={{ backgroundColor: '#f8723f' }}
                id="basic-addon1"
              >
                帳號
              </span>
              <input
                type="text"
                name="account"
                aria-label="Account"
                aria-describedby="basic-addon1"
                value={user.username}
                onChange={handleFieldChange}
                style={{ backgroundColor: 'white', textAlign: 'left' }}
                className="form-control input-group-text border border-secondary rounded-0 opacity-50"
              />
            </div>
            <div
              className="input-group mb-4 rounded-5 mx-auto"
              style={{ width: '17rem' }}
            >
              <span
                className="input-group-text border border-danger text-white rounded-0"
                style={{ backgroundColor: '#f8723f' }}
                id="basic-addon1"
              >
                密碼
              </span>
              <div style={{ position: 'relative', display: 'flex', flex: '1' }}>
                <input
                  type={show ? 'text' : 'password'} // 根據 show 的值來決定顯示 text 或 password
                  aria-label="Userpassword"
                  name="password"
                  aria-describedby="basic-addon1"
                  value={user.password}
                  onChange={handleFieldChange} //可控表單
                  style={{
                    backgroundColor: 'white',
                    textAlign: 'left',
                  }}
                  className="form-control input-group-text border border-secondary rounded-0 opacity-50"
                />
                <Image
                  src="/pics/showpassword.png"
                  width="24"
                  height="32"
                  alt="吐舌狗"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShow(!show)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-outline-dark btn-lg btn pro-shadow fs-6 mx-auto my-4"
              style={{ width: 150, height: 45 }}
            >
              登入
            </button>
          </div>
        </form>
      </div>
      <div>
        <span className="fs-4 mx-auto text-light d-flex justify-content-center my-5">
          Google登入
        </span>
        <span className="fs-5 mx-auto text-danger d-flex justify-content-center my-5">
          <Link href="/member/register">新朋友? 註冊</Link>
        </span>
      </div>
    </>
  )
}
