import Image from 'next/image'
import { z } from 'zod'
import { useState } from 'react'
// import { register_ADD } from '@/components/my-const'

// 註冊第一步
function Step1(props) {
  const { step1, setStep1, setIsStep1Valid } = props // 接收驗證函數

  // 欄位檢查
  const [errors, setErrors] = useState({})

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    setStep1({ ...step1, [id]: value })
  }

  const onBlurHandler = (fieldName) => {
    const newErrors = validateFields({
      ...step1,
      [fieldName]: step1[fieldName],
    })
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: newErrors[fieldName],
    }))
    // 更新父组件中的格式驗證狀態(格式正確才能繼續註冊)
    setIsStep1Valid(
      Object.keys(newErrors).every((key) => newErrors[key] === '')
    ) // 更新為所有欄位驗證通過時才為 true
  }

  const validateFields = (step1) => {
    const newErrors = {}

    // 檢查姓氏格式
    if (!/[\u4e00-\u9fa5]+/.test(step1.lastname.trim())) {
      newErrors.lastname = '姓氏需填寫中文字'
    } else {
      newErrors.lastname = '' // 清空錯誤訊息
    }

    // 檢查名字格式
    if (!/[\u4e00-\u9fa5]+/.test(step1.firstname.trim())) {
      newErrors.firstname = '名字需填寫中文字'
    } else {
      newErrors.firstname = '' // 清空錯誤訊息
    }
    // 檢查帳號格式
    if (!/^[a-zA-Z][a-zA-Z0-9]{5}$/.test(step1.account.trim())) {
      newErrors.account = '首字英文，加數字共需6碼'
    } else {
      newErrors.account = '' // 清空錯誤訊息
    }
    // 檢查密碼格式
    if (!/^[A-Z][a-zA-Z0-9]{5,7}$/.test(step1.password.trim())) {
      newErrors.password = '首字英文大寫，含數字且至少需6碼'
    } else {
      newErrors.password = '' // 清空錯誤訊息
    }
    // 檢查電話號碼格式
    if (!/^(09\d{2}-?\d{3}-?\d{3})$/.test(step1.mobile.trim())) {
      newErrors.mobile = '電話號碼格式錯誤'
    } else {
      newErrors.mobile = '' // 清空錯誤訊息
    }
    // 檢查身分證字號格式
    if (!/^([a-zA-Z][12]\d{8})$/.test(step1.identification.trim())) {
      newErrors.identification = '身分證字號格式錯誤'
    } else {
      newErrors.identification = '' // 清空錯誤訊息
    }
    // 檢查 Email 格式
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        step1.email.trim()
      )
    ) {
      newErrors.email = 'EMAIL 格式錯誤'
    } else {
      newErrors.email = '' // 清空錯誤訊息
    }

    return newErrors
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // 檢查欄位資料
    const newErrors = validateFields(step1)

    // 設定錯誤訊息
    setErrors(newErrors)

    // 檢查是否有錯誤
    if (Object.keys(newErrors).length > 0) {
      // 有錯誤，不執行 API 請求
      return
    }

    // 呼叫後端進行帳號檢查和其他欄位檢查
    const response = await fetch('/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step1),
    })

    if (!response.ok) {
      // console.error('伺服器錯誤:', response.status)
      return
    }

    const result = await response.json()

    if (!result.success) {
      // 如果後端回傳的 success 不是 true，代表有錯誤
      setErrors(result.errors)
    } else {
      // 沒有錯誤，可以執行註冊 API 請求
      const Schema = z.coerce.string().email({ message: '錯誤的 email 格式' })
      console.log('Schema:', Schema.safeParse(step1.email))
      // TODO: 執行註冊 API 請求
    }
  }

  return (
    <>
      <h3 className="mx-5 py-3">會員註冊</h3>
      <div className="d-flex justify-content-center">
        <Image
          src="/pics/sleepcat.png"
          width="500"
          height="100"
          alt="懶懶貓"
          priority
        />
      </div>
      <form className="list-form" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div className="card border-danger mb-3" style={{ width: '40rem' }}>
              <div
                className="card-header card-big-title border border-0 py-3"
                style={{ backgroundColor: 'transparent' }}
              >
                會員資訊
                <Image
                  src="/pics/showpassword.png"
                  width="24"
                  height="32"
                  alt="吐舌狗"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setStep1({
                      lastname: '林',
                      firstname: '宜君',
                      mobile: '0988352694',
                      account: 'YiJun5',
                      password: 'LY851212',
                      birthday: '1996-12-12',
                      identification: 'A226789898',
                      email: 'YiJun5@gmail.com',
                    })
                    setErrors({})
                  }}
                />
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title ">
                      姓氏<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={step1.lastname || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('lastname')}
                      placeholder="姓氏"
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.lastname && (
                      <div className="error-message">{errors.lastname}</div>
                    )}
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      名字<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={step1.firstname || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('firstname')}
                      placeholder="名字"
                      aria-label="default input example"
                    />
                    {errors.firstname && (
                      <div className="error-message">{errors.firstname}</div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      電話號碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={step1.mobile || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('mobile')}
                      placeholder="請填電話號碼"
                      aria-label="default input example"
                    />
                    {errors.mobile && (
                      <div className="error-message">{errors.mobile}</div>
                    )}
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      出生年月日
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={step1.birthday}
                      onChange={changeHandler}
                      placeholder="請填日期"
                      aria-label="default input example"
                      max="2013-12-31"
                    />
                    {errors.birthday && (
                      <div className="error-message">{errors.birthday}</div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      會員帳號<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="account"
                      name="account"
                      value={step1.account}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('account')}
                      placeholder="請填帳號"
                      aria-label="default input example"
                    />
                    {errors.account && (
                      <div className="error-message">{errors.account}</div>
                    )}
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      密碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="password"
                      name="password"
                      value={step1.password}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('password')}
                      placeholder="請填密碼"
                      aria-label="default input example"
                    />
                    {errors.password && (
                      <div className="error-message">{errors.password}</div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      身分證字號<span className="text-danger">*</span>
                    </h6>

                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="identification"
                      name="identification"
                      value={step1.identification || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('identification')}
                      placeholder="請填身分證字號"
                      aria-label="default input example"
                    />
                    {errors.identification && (
                      <div className="error-message">
                        {errors.identification}
                      </div>
                    )}
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      電子信箱<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="email"
                      name="email"
                      value={step1.email || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('email')}
                      placeholder="請填電子信箱"
                      aria-label="default input example"
                    />
                    {errors.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
export default Step1
