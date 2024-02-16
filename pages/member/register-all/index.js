// 子頁面(區域)
import Step1 from './sub-pages/step1'
import Step2 from './sub-pages/step2'
import React, { useState } from 'react'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { register_ADD } from '@/components/my-const'
import Image from 'next/image'
import AuthContext from '@/components/contexts/AuthContext'
import { useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

//同時兩個表單的新增(主畫面)
function RegisterSteps() {
  const router = useRouter()
  const { auther } = useContext(AuthContext)
  const maxSteps = 2
  const [step, setStep] = useState(1)
  const [progressImage, setProgressImage] = useState('/pics/sleepcat.png')

  const [step1, setStep1] = useState({
    lastname: '',
    firstname: '',
    mobile: '',
    birthday: '',
    account: '',
    password: '',
    identification: '',
    email: '',
  })

  const [step2, setStep2] = useState({
    country: '',
    township: '',
    postcode: '',
    photo: null,
  })

  const [autoAddress, setAutoAddress] = useState('復興南路1段390號2樓')

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // 一次提交 Step1 和 Step2表單
  const onSubmitSteps = async (e) => {
    if (e) {
      e.preventDefault()
    }

    const errors = []
    if (!step2.zipcode) errors.push('郵遞區號沒填~ ')
    console.log('郵遞區號沒填~ ')
    if (errors.length > 0) {
      toast.error(errors.join(', '))
      return
    }

    // console.log('Step 1 data:', step1)
    // console.log('Step 2 data:', step2)

    //處理圖片上傳&step1&step2
    const formData = new FormData()
    formData.append('lastname', step1.lastname)
    formData.append('firstname', step1.firstname)
    formData.append('mobile', step1.mobile)
    formData.append('birthday', step1.birthday)
    formData.append('account', step1.account)
    formData.append('password', step1.password)
    formData.append('identification', step1.identification)
    formData.append('email', step1.email)

    // 添加 step2 的資料
    formData.append('photo', step2.photo)
    formData.append('country', step2.country)
    formData.append('township', step2.township)
    formData.append('zipcode', step2.zipcode)
    formData.append('address', autoAddress)

    try {
      const responseSteps = await fetch(register_ADD, {
        // method: 'POST',
        // body: JSON.stringify({ ...step1, ...step2, address: autoAddress }),
        // headers: {
        //   'Content-Type': 'application/json',
        //圖片格式
        method: 'POST',
        body: formData,
      })
      console.log('autoAddress:', autoAddress)
      console.log('表單提交:沒跳出視窗表示失敗')

      const responseDataSteps = await responseSteps.json()

      // 根據第二個表單的提交結果執行相應的操作
      if (responseDataSteps.success) {
        // 檢查 step2.postcode 是否有值
        if (step2.zipcode) {
          handleShow() // 使用狀態控制 Modal 顯示
        }
      } else {
        toast.error('資料提交失敗')
        return
      }
    } catch (error) {
      console.error('註冊過程中發生錯誤:', error)
    }
  }

  // 上一步 下一步按鈕
  const next = () => {
    // 運送表單用檢查
    if (step === 1) {
      const {
        lastname,
        firstname,
        mobile,
        birthday,
        account,
        password,
        identification,
        email,
      } = step1
      setProgressImage('/pics/sleepcat2.png')

      setStep2({
        country: '',
        township: '',
        postcode: '',
      })
    }

    // 沒錯誤才會到下一步
    if (step < maxSteps) setStep(step + 1)
    // 提交表單

    if (step === maxSteps) onSubmitSteps()
  }

  // 上一步按鈕
  const prev = () => {
    if (step > 1) setStep(step - 1)
    //if (step === 1)
  }

  return (
    <>
      {/* 子頁面區域 */}
      <div className="register-steps">
        {/* 在 RegisterSteps 父元件中，與子女元件進行傳遞。 */}
        {step === 1 && <Step1 step1={step1} setStep1={setStep1} />}
        {step === 2 && (
          <Step2 step1={step1} step2={step2} setStep2={setStep2} />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="d-flex py-4 mb-5"></div>
        <button
          type="button"
          className="btn btn-outline-primary btn-lg pro-shadow mx-5"
          style={{ width: 250 }}
          onClick={prev}
          disabled={step === 1}
        >
          回到前一頁
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-lg pro-shadow mx-5"
          style={{ width: 250 }}
          onClick={next}
          // disabled={step === maxSteps}
        >
          {step === maxSteps ? '完成註冊' : '繼續註冊'}
        </button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header className="modal-form">
            <Modal.Title className="modal-form">
              註冊成功!!
              <div>恭喜您成為佩佩星球的成員~</div>
            </Modal.Title>
            <Image
              src="/pics/close.png"
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
          <Modal.Body className="modal-form" style={{ height: 130 }}>
            <Image
              src="/pics/nike.png"
              alt="打勾"
              width="100"
              height="100"
              className="mx-auto"
            />
          </Modal.Body>
          <Modal.Footer className="modal-form">
            <Button
              variant="info"
              className="mx-auto"
              style={{
                width: '120px',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
              onClick={() => {
                handleClose()
                router.push('/member/login')
              }}
            >
              確定
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default RegisterSteps
