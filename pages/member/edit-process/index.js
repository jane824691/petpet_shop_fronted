import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Edit1 from './sub-pages/edit1'
import Edit2 from './sub-pages/edit2'
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import toast, { Toaster } from 'react-hot-toast'
import { GET_MEMBER_DATA, PUT_MEMBER_DATA } from '@/components/my-const'
import AuthContext from '@/components/contexts/AuthContext'
import { useContext } from 'react'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

function EditProcess() {
  const intl = useIntl()
  //跳轉用
  const router = useRouter()

  const maxSteps = 2

  const [step, setStep] = useState(1)
  const [isStep1Valid, setIsStep1Valid] = useState(false)
  const [isStep2Valid, setIsStep2Valid] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [errors, setErrors] = useState({})
  const newErrors = {}

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
    zipcode: '',
    photo: null,
    address: ''
  })

  const { auther } = useContext(AuthContext)

  // 去抓後端處理好的單筆資料(顯示在會員中心)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 檢查 localStorage 中是否存在 'auther'，以及 'auther' 是否有有效的 sid
        const authDataString = localStorage.getItem('auther')
        if (!authDataString) {
          // 未登入會直接跳轉回首頁
          // TODO: needs a loading to prevent show out the member page before jump back to index page
          router.push('/member/login')
          return
        }
        const authData = JSON.parse(authDataString)
        if (!authData || !authData.sid) {
          router.push('/member/login')
          return
        }
        const sid = authData.sid
        const token = JSON.parse(localStorage.getItem('auther'))?.token
        const response = await fetch(GET_MEMBER_DATA, {
          body: JSON.stringify({ sid: sid, token }),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST'
        })
        const memberData = await response.json()
        
        if (response.status === 401) {
          // console.log('未授權，導向到登入頁...')
          router.push('/member/login')
          return
        }

        // 處理生日格式
        if (memberData.birthday) {
          memberData.birthday = dayjs(memberData.birthday).format('YYYY-MM-DD')
        }

        setStep1(memberData)
        setStep2(memberData)
      } catch (error) {
        // console.error('Error fetching mydata:', error)
      }
    }

    // 呼叫 fetchData 以觸發資料載入
    fetchData()
  }, [])

  const onSubmit = async (e) => {
    if (e) {
      e.preventDefault()
    }

    const newErrors = validateFields(step2)
    setErrors(newErrors)

    // Step1驗證直接在往下一頁的按鈕擋住, 故只判斷Step2符合條件否
    if (
      !step2?.address?.trim()
    ) {
      handleShowFailureModal()
      return // 阻止表單繼續提交
    }
    const authDataString = localStorage.getItem('auther')
    const authData = JSON.parse(authDataString)
    const sid = authData.sid
    // 如果驗證通過才繼續進行圖片上傳和數據處理
    const formData = new FormData()
    formData.append('sid', sid)
    formData.append('lastname', step1.lastname)
    formData.append('firstname', step1.firstname)
    formData.append('mobile', step1.mobile)
    formData.append('birthday', step1.birthday)
    // formData.append('account', step1.account)
    // formData.append('password', step1.password)
    formData.append('identification', step1.identification)
    formData.append('email', step1.email)
    // 添加 step2 的資料
    formData.append('photo', step2.photo)
    formData.append('country', step2.country)
    formData.append('township', step2.township)
    formData.append('zipcode', step2.zipcode)
    formData.append('address', step2.address)
    
    try {
      const responseSteps = await fetch(PUT_MEMBER_DATA, {
        method: 'PUT',
        body: formData
      })
      const responseDataSteps = await responseSteps.json()
      // 後端成功返回的時候，再根據結果決定顯示對應的 modal
      if (responseDataSteps.success) {
        handleShowSuccessModal()
      } else {
        handleShowFailureModal()
      }
    } catch (error) {
      console.error('註冊過程中發生錯誤:', error)
      handleShowFailureModal() // 捕捉到錯誤時顯示錯誤提示
    }
  }

  const handleClose = () => {
    setShowSuccessModal(false)
    setShowFailureModal(false)
  }

  const handleShowSuccessModal = () => setShowSuccessModal(true)
  const handleShowFailureModal = () => setShowFailureModal(true)

  // step2的驗證綁頂層按鈕跳error
  const validateFields = (step2) => {
    // 檢查地址格式
    if (!/[\u4e00-\u9fa5]+/.test(step2.address?.trim() || '')) {
      newErrors.address = intl.formatMessage({ id: 'validation.addressFormat' })
    } else {
      newErrors.address = '' // 清空錯誤訊息
    }

    if (!step2.zipcode) {
      newErrors.zipcode = intl.formatMessage({ id: 'validation.zipcodeRequired' })
    } else {
      newErrors.zipcode = '' // 清空錯誤訊息
    }

    return newErrors
  }

  const next = async () => {
    // 運送表單用檢查
    if (step === 1) {
      // 驗證第一步是否通過
      if (isStep1Valid) {
        setStep(step + 1)
      } else {
        // 如果驗證未通過，直接返回，不進行下一步
        return
      }
    }

    if (step < maxSteps) {
      setStep(step + 1)
    }

    // 提交表單
    if (step === maxSteps) onSubmit()
  }

  // 上一步按鈕
  const prev = () => {
    if (step > 1) setStep(step - 1)
    if (step === 1) router.push('../member')
  }

  return (
    <>
      {step === 1 && (
        <Edit1
          step1={step1}
          setStep1={setStep1}
          setIsStep1Valid={setIsStep1Valid}
        />
      )}
      {step === 2 && (
        <Edit2
          step1={step1}
          step2={step2}
          setStep2={setStep2}
          setIsStep2Valid={setIsStep2Valid}
          setErrors={setErrors}
          validateFields={validateFields}
          errors={errors}
        />
      )}
      <div className="d-flex flex-column flex-sm-row justify-content-center py-3 gap-4 mx-4 mx-sm-5 mb-5">
        <button
          type="button"
          className="btn btn-outline-primary btn-lg btn pro-shadow px-5"
          onClick={prev}
        >
          {step === 1 ? intl.formatMessage({ id: 'member.backToMemberPage' }) : intl.formatMessage({ id: 'member.backToPreviousPage' })}
        </button>

        <button
          type="button"
          className="btn btn-outline-primary btn-lg btn pro-shadow px-5"
          onClick={next}
          disabled={!isStep1Valid}
        >
          {step === maxSteps ? intl.formatMessage({ id: 'member.completeEdit' }) : intl.formatMessage({ id: 'member.continueEdit' })}
        </button>
      </div>

      <Modal show={showSuccessModal || showFailureModal} onHide={handleClose}>
        <Modal.Header
          className={`modal-form ${
            showSuccessModal ? 'modal-header-success' : 'modal-header-failure'
          }`}
        >
          <Modal.Title className="modal-form">
            {showSuccessModal ? intl.formatMessage({ id: 'member.editSuccess' }) : intl.formatMessage({ id: 'member.editFailure' })}
            {showSuccessModal ? (
              <div>{intl.formatMessage({ id: 'member.redirectToMemberCenter' })}</div>
            ) : (
              <div>{intl.formatMessage({ id: 'member.pleaseCompleteData' })}</div>
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
              right: '-20px'
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
              boxShadow: 'none'
            }}
            //資料正確才跳轉
            onClick={() => {
              handleClose()
              if (showSuccessModal) {
                router.push('/member')
              }
            }}
          >
            {intl.formatMessage({ id: 'member.confirm' })}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditProcess
