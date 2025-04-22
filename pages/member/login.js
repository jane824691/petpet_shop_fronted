import { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LOGIN } from '@/components/my-const'
import AuthContext from '@/components/contexts/AuthContext'
import { jwtDecode } from 'jwt-decode' // 導入 jwt 解析庫
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

//可以成功登入的版本
export default function Login() {
  const [user, setUser] = useState({
    account: '',
    password: '',
  })
  const router = useRouter()
  const { setAuther, logout } = useContext(AuthContext)

  //確認JWT過期時間(自動登出)
  useEffect(() => {
    const token = localStorage.getItem('auther')
    if (token) {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp < currentTime) {
        logout()
      }
    }
  }, [])
  
  const postForm = async (e) => {
    e.preventDefault() //不要讓表單以傳統方式送出

    const r = await fetch(LOGIN, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Bearer ${decodedToken}`,
      },
    })
    const data = await r.json()

    if (data.success) {
      const { sid, account, token } = data
      // 成功登入時, 寫入 localStorage 做長時間的狀態保存，網頁刷新時仍保持登入狀態
      localStorage.setItem('auther', JSON.stringify({ sid, account, token }))
      setAuther({ sid, account, token })
      router.push('/member')
    } else {
      handleShowFailureModal()
    }
  }

  // 顯示密碼的勾選狀態
  const [show, setShow] = useState(false)

  // 各欄位共用事件處理函式
  const handleFieldChange = (e) => {
    const newUser = { ...user, [e.target.name]: e.target.value }

    setUser(newUser)
  }

  const [showFailureModal, setShowFailureModal] = useState(false)

  const handleClose = () => {
    setShowFailureModal(false)
  }
  const handleShowFailureModal = () => setShowFailureModal(true)

  return (
    <>
      <h3 className="py-1 mx-auto">會員登入</h3>
      <div className="d-flex justify-content-center position-relative">
        <Image
          className="w-100"
          src="/pics/heart.png"
          width="600"
          height="400"
          alt="愛心"
          priority={true}
        ></Image>
        <form name="form1" onSubmit={postForm}>
          <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column my-5">
            <div className="input-group mb-4 mx-auto">
              <span
                className="input-group-text border border-danger text-white hintTitle"
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
                className="form-control input-group-text border border-secondary accountInput"
              />
            </div>
            <div className="input-group mb-4 mx-auto">
              <span
                className="input-group-text border border-danger text-white hintTitle"
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
                  className="form-control input-group-text border border-secondary passwordInput"
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
              className="btn btn-outline-dark btn-lg btn pro-shadow fs-6 mx-5 my-4"
            >
              登入
            </button>
          </div>
        </form>
      </div>
      <div>
        <span className="fs-5 mx-auto text-danger d-flex justify-content-center my-5">
          <Link href="/member/register-all">新朋友? 註冊</Link>
        </span>
      </div>
      <Modal show={showFailureModal} onHide={handleClose}>
        <Modal.Header className="modal-form modal-header-failure">
          <Modal.Title className="modal-form mt-3">
            登入失敗
            <h6 className='my-3'>帳號或密碼錯誤</h6>
          </Modal.Title>
          <Image
            src="/pics/close2.png"
            alt="叉叉"
            width="40"
            height="30"
            className="mb-3"
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '-22px',
              right: '-20px',
            }}
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body
          className="modal-form modal-body-failure"
          style={{ height: 130 }}
        >
          <Image
            src="/pics/error.png"
            alt="錯誤"
            width="100"
            height="100"
            className="mx-auto"
          />
        </Modal.Body>
        <Modal.Footer
          className="modal-form modal-footer-failure"
          style={{ height: 130 }}
        >
          <Button
            variant="secondary"
            className="mx-auto"
            style={{
              width: '120px',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
            onClick={handleClose}
          >
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
