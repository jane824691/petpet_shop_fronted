import Image from 'next/image'
import { z } from 'zod'
import { useState } from 'react'
import { useIntl } from 'react-intl'

// 註冊第一步
function Step1(props) {
  const intl = useIntl()
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
      newErrors.lastname = intl.formatMessage({ id: 'validation.lastnameChinese' })
    } else {
      newErrors.lastname = '' // 清空錯誤訊息
    }

    // 檢查名字格式
    if (!/[\u4e00-\u9fa5]+/.test(step1.firstname.trim())) {
      newErrors.firstname = intl.formatMessage({ id: 'validation.firstnameChinese' })
    } else {
      newErrors.firstname = '' // 清空錯誤訊息
    }
    // 檢查帳號格式
    if (!/^[a-zA-Z][a-zA-Z0-9]{5}$/.test(step1.account.trim())) {
      newErrors.account = intl.formatMessage({ id: 'validation.accountFormat' })
    } else {
      newErrors.account = '' // 清空錯誤訊息
    }
    // 檢查密碼格式
    if (!/^[A-Z][a-zA-Z0-9]{5,7}$/.test(step1.password.trim())) {
      newErrors.password = intl.formatMessage({ id: 'validation.passwordFormat' })
    } else {
      newErrors.password = '' // 清空錯誤訊息
    }
    // 檢查電話號碼格式
    if (!/^(09\d{2}-?\d{3}-?\d{3})$/.test(step1.mobile.trim())) {
      newErrors.mobile = intl.formatMessage({ id: 'validation.phoneFormat' })
    } else {
      newErrors.mobile = '' // 清空錯誤訊息
    }
    // 檢查身分證字號格式
    if (!/^([a-zA-Z][12]\d{8})$/.test(step1.identification.trim())) {
      newErrors.identification = intl.formatMessage({ id: 'validation.idFormat' })
    } else {
      newErrors.identification = '' // 清空錯誤訊息
    }
    // 檢查 Email 格式
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        step1.email.trim()
      )
    ) {
      newErrors.email = intl.formatMessage({ id: 'validation.emailFormat' })
    } else {
      newErrors.email = '' // 清空錯誤訊息
    }

    return newErrors
  }

  const onSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <>
      <h3 className="mx-5 pt-4">{intl.formatMessage({ id: 'member.register' })}</h3>
      <div className="d-flex justify-content-center mx-auto px-3 px-sm-5" style={{ maxWidth: '600px' }}>
        <Image
          src="/pics/sleepcat.png"
          width={500}
          height={100}
          alt="懶懶貓"
          className="w-100 h-auto"
        />
      </div>
      <form className="list-form mx-4" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div className="card border-danger mb-3 px-4 py-4">
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent' }}
              >
                {intl.formatMessage({ id: 'member.personalInfo' })}
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
                    setIsStep1Valid(true)
                  }}
                />
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title ">
                      {intl.formatMessage({ id: 'member.lastName' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={(step1 && step1.lastname) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('lastname')}
                      placeholder={intl.formatMessage({ id: 'member.lastName' })}
                      aria-label="default input example"
                    />
                    {/* 錯誤訊息的顯示 */}
                    {errors.lastname && (
                      <div className="error-message">{errors.lastname}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.firstName' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={(step1 && step1.firstname) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('firstname')}
                      placeholder={intl.formatMessage({ id: 'member.firstName' })}
                      aria-label="default input example"
                    />
                    {errors.firstname && (
                      <div className="error-message">{errors.firstname}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.phoneNumber' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={(step1 && step1.mobile) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('mobile')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterPhone' })}
                      aria-label="default input example"
                    />
                    {errors.mobile && (
                      <div className="error-message">{errors.mobile}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.birthday' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={(step1 && step1.birthday) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('birthday')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterDate' })}
                      aria-label="default input example"
                      max="2013-12-31"
                    />
                    {errors.birthday && (
                      <div className="error-message">{errors.birthday}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.account' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="account"
                      name="account"
                      value={(step1 && step1.account) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('account')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterAccount' })}
                      aria-label="default input example"
                    />
                    {errors.account && (
                      <div className="error-message">{errors.account}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.password' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="password"
                      name="password"
                      value={(step1 && step1.password) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('password')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterPassword' })}
                      aria-label="default input example"
                    />
                    {errors.password && (
                      <div className="error-message">{errors.password}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.id' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="identification"
                      name="identification"
                      value={(step1 && step1.identification) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('identification')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterId' })}
                      aria-label="default input example"
                    />
                    {errors.identification && (
                      <div className="error-message">{errors.identification}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.email' })}
                      <span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="email"
                      name="email"
                      value={(step1 && step1.email) || ''}
                      onChange={changeHandler}
                      onBlur={() => onBlurHandler('email')}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterEmail' })}
                      aria-label="default input example"
                    />
                    {errors.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
export default Step1
