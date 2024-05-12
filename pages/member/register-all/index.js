// 子頁面(區域)
import Step1 from './sub-pages/step1'
import Step2 from './sub-pages/step2'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { register_ADD } from '@/components/my-const'
import Image from 'next/image'
import { useRouter } from 'next/router'

//同時兩個表單的新增(主畫面)
function RegisterSteps() {
  const router = useRouter()
  const maxSteps = 2
  const [step, setStep] = useState(1)
  const [isStep1Valid, setIsStep1Valid] = useState(false)
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

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)

  const handleClose = () => {
    setShowSuccessModal(false)
    setShowFailureModal(false)
  }

  const handleShowSuccessModal = () => setShowSuccessModal(true)
  const handleShowFailureModal = () => setShowFailureModal(true)

  // 一次提交 Step1 和 Step2表單
  const onSubmitSteps = async (e) => {
    if (e) {
      e.preventDefault()
    }

    //處理圖片上傳&step1&step2(multipart/form-data)
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

      const responseDataSteps = await responseSteps.json()

      // 根據第二個表單的提交結果執行相應的操作
      if (responseDataSteps.success) {
        // 檢查 step2內容是否有填寫
        if (step2.zipcode && step2.country && step2.township && step2.photo) {
          handleShowSuccessModal() // 使用狀態控制 Modal 顯示
        }
      } else {
        handleShowFailureModal()
        return
      }
    } catch (error) {
      // console.error('註冊過程中發生錯誤:', error)
    }
  }

  // 上一步 下一步按鈕
  const next = () => {
    // 運送表單用檢查
    if (step === 1) {
      // 驗證第一步是否通過
      if (isStep1Valid) {
        setStep(step + 1)
      }

      setStep2({
        country: '',
        township: '',
        postcode: '',
      })
      setProgressImage('/pics/sleepcat2.png')
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
        {step === 1 && (
          <Step1
            step1={step1}
            setStep1={setStep1}
            setIsStep1Valid={setIsStep1Valid}
          />
        )}
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
          disabled={!isStep1Valid}
        >
          {step === maxSteps ? '完成註冊' : '繼續註冊'}
        </button>
        <Modal show={showSuccessModal || showFailureModal} onHide={handleClose}>
          <Modal.Header
            className={`modal-form ${
              showSuccessModal ? 'modal-header-success' : 'modal-header-failure'
            }`}
          >
            <Modal.Title className="modal-form">
              {showSuccessModal ? '註冊成功!!' : '註冊失敗'}
              {showSuccessModal ? (
                <div>恭喜成為佩佩星球的成員~</div>
              ) : (
                <div>請填寫完整資料~</div>
              )}
            </Modal.Title>
            <Image
              src={showSuccessModal ? '/pics/close.png' : '/pics/close2.png'}
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
            className={`modal-form ${
              showSuccessModal ? 'modal-body-success' : 'modal-body-failure'
            }`}
            style={{ height: 130 }}
          >
            <Image
              src={showSuccessModal ? '/pics/nike.png' : '/pics/error.png'}
              alt="打勾"
              width="100"
              height="100"
              className="mx-auto"
            />
          </Modal.Body>
          <Modal.Footer
            className={`modal-form ${
              showSuccessModal ? 'modal-footer-success' : 'modal-footer-failure'
            }`}
            style={{ height: 130 }}
          >
            <Button
              variant={showSuccessModal ? 'info' : 'secondary'}
              className="mx-auto"
              style={{
                width: '120px',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
              //資料正確才跳轉
              onClick={() => {
                handleClose()
                if (showSuccessModal) {
                  router.push('/member/login')
                }
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
