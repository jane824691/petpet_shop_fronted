import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Edit1(props) {
  const { step1, setStep1, setIsStep1Valid } = props // 接收驗證函數

  // 欄位檢查
  const [errors, setErrors] = useState({})

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    setStep1({ ...step1, [id]: value })
  }

  // 引入 useEffect，用來監控 errors 的變化
  useEffect(() => {
    // 當所有 errors 的值都為空字串時，即所有欄位無錯誤，將 isStep1Valid 設為 true
    setIsStep1Valid(Object.values(errors).every((error) => error === ''))
  }, [errors])

  const onBlurHandler = (fieldName) => {
    // 驗證欄位並取得該欄位的錯誤訊息
    const newErrors = validateFields({
      ...step1,
      [fieldName]: step1[fieldName]
    })

    // 更新整體 errors 狀態，保持其他欄位錯誤
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: newErrors[fieldName]
    }))
  }

  useEffect(() => {})

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

  const onSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <h3 className="mx-5 py-3 pt-5">編輯資料</h3>
      <div className="d-flex justify-content-center">
        <Image
          src="/pics/sleepcat.png"
          width="500"
          height="100"
          alt="懶懶貓"
        ></Image>
      </div>
      <div className="list-form" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div className="card border-danger mb-3" style={{ width: '40rem' }}>
              <div
                className="card-header card-big-title border border-0 py-3"
                style={{ backgroundColor: 'transparent' }}
              >
                會員資訊
              </div>
              <div className="card-body">
                <div className="row gap-3">
                  <div className="col">
                    <h6 className="card-title font-grey-title ">
                      姓氏<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={(step1 && step1.lastname) || ''}
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
                    <h6 className="card-title font-grey-title ">
                      名字<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={(step1 && step1.firstname) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('firstname')}
                      placeholder="名字"
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.firstname && (
                      <div className="error-message">{errors.firstname}</div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row gap-3">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      電話號碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={(step1 && step1.mobile) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('mobile')}
                      placeholder="請填電話號碼"
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.mobile && (
                      <div className="error-message">{errors.mobile}</div>
                    )}
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      出生年月日<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={(step1 && step1.birthday) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('birthday')}
                      placeholder="請填日期"
                      aria-label="default input example"
                      max="2013-12-31"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.birthday && (
                      <div className="error-message">{errors.birthday}</div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row gap-3">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      會員帳號<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Account"
                      name="Account"
                      value={(step1 && step1.account) || ''}
                      // onChange={changeHandler}
                      placeholder="請填帳號"
                      aria-label="default input example"
                      disabled
                    />
                  </div>

                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      密碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Password"
                      name="Password"
                      value={(step1 && step1.password) || ''}
                      // onChange={changeHandler}
                      placeholder="請填密碼"
                      aria-label="default input example"
                      disabled
                    />
                  </div>
                </div>
                <br />
                <div className="row gap-3">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      身分證字號<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="identification"
                      name="identification"
                      value={(step1 && step1.identification) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('identification')}
                      placeholder="請填身分證字號"
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.identification && (
                      <div className="error-message">
                        {errors.identification}
                      </div>
                    )}
                  </div>

                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      電子信箱<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="email"
                      name="email"
                      value={(step1 && step1.email) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('email')}
                      placeholder="請填電子信箱"
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
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
      </div>
    </>
  )
}
