import { useState, useRef } from 'react'
import TWZipCode from '@/components/tw-zipcode'
import { z } from 'zod'

export default function Payment(props) {
  const { payment, setPaymentData } = props

  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  // 一次處理多項購物者資訊用, 可控表單
  const changeHandler = (e, postcodeValue) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setDisplayInfo('')
    // setPaymentData({ ...payment, [id]: value, postcode: postcodeValue })
    setPaymentData((prevPayment) => ({
      ...prevPayment,
      [id]: value,
      postcode: postcodeValue,
      // 在這裡添加代碼以保留未更新的屬性
      pid: prevPayment.pid,
      sale_price: prevPayment.sale_price,
      actual_amount: prevPayment.actual_amount,
    }))

  }

  // 欄位檢查
  const [errors, setErrors] = useState({})

  // 檢查機制
  const onBlurHandler = (fieldName) => {
    const newErrors = validateFields({ ...payment }) // 正確傳遞 payment 物件
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: newErrors[fieldName],
    }))
    if (newErrors[fieldName] === '' && successMessage !== '') {
      setSuccessMessage('') // 在 onBlur 時，如果格式正確且成功訊息存在，則清空成功訊息
    }
  }

  // 在 onFocus 時，如果成功訊息存在，則清空成功訊息
  const onFocusHandler = () => {
    if (successMessage !== '') {
      setSuccessMessage('')
    }
  }

  const validateFields = (step1) => {
    const newErrors = {}

    // 檢查名字格式
    if (!/[\u4e00-\u9fa5]+/.test(payment.name.trim())) {
      newErrors.name = '名字需填寫中文字'
    } else {
      newErrors.name = '' // 清空錯誤訊息
    }

    // 檢查電話號碼格式
    if (!/^(09\d{2}-?\d{3}-?\d{3})$/.test(payment.phone.trim())) {
      newErrors.phone = '電話號碼格式錯誤'
    } else {
      newErrors.phone = '' // 清空錯誤訊息
    }

    // 檢查 Email 格式
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        payment.email.trim()
      )
    ) {
      newErrors.email = 'EMAIL 格式錯誤'
    } else {
      newErrors.email = '' // 清空錯誤訊息
    }

    return newErrors
  }

  // 在這裡新增 state
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  //成功或失敗顯示不同的<div>內容
  {
    successMessage && <div className="success-message">{successMessage}</div>
  }
  {
    errorMessage && <div className="error-message">{errorMessage}</div>
  }

  // 更改付款方式的css用
  const [selectedOption, setSelectedOption] = useState(null)

  const handleRadioChange = (optionId) => {
    setSelectedOption(optionId)
    // 根據選項設置支付方式, 點選可存回資料庫
    setPaymentData({
      ...payment,
      pay_way:
        optionId === 'flexRadioDefault1'
          ? '貨到付款'
          : optionId === 'flexRadioDefault2'
          ? '信用卡'
          : '',
    })
  }

  return (
    <>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div className="d-flex justify-content-center">
          <img src="/images/product/steps_to_payment.png" alt="" />
        </div>
        {/* onSubmit={onSubmit} */}
        <form className="list-form">
          <div className="d-flex justify-content-center">
            <div className="direction-column">
              <div
                className="card border-primary mb-3"
                style={{ width: '40rem' }}
              >
                <div
                  className="card-header card-big-title border border-0"
                  style={{ backgroundColor: 'transparent ' }}
                >
                  收貨人資訊
                </div>
                <div className="card-body">
                  <h5 className="card-title font-grey-title">
                    姓名<span className="text-danger">*</span>
                  </h5>
                  <input
                    className="form-control T-18 rounded-5"
                    type="text"
                    placeholder="請填姓名"
                    name="name"
                    id="name"
                    value={payment.name}
                    onChange={changeHandler}
                    onBlur={() => onBlurHandler('name')}
                    onFocus={onFocusHandler}
                  />
                  <div
                    className={`message ${
                      errors.name ? 'error-message' : 'success-message'
                    }`}
                  >
                    {errors.name || (successMessage && '成功訊息')}
                  </div>
                  <h5 className="card-title font-grey-title mt-3">
                    電話<span className="text-danger">*</span>
                  </h5>
                  <input
                    className="form-control T-18 rounded-5"
                    type="text"
                    placeholder="請填常用聯絡電話"
                    name="phone"
                    id="phone"
                    value={payment.phone}
                    onChange={changeHandler}
                    onBlur={() => onBlurHandler('phone')}
                    onFocus={onFocusHandler}
                  />
                  <div
                    className={`message ${
                      errors.phone ? 'error-message' : 'success-message'
                    }`}
                  >
                    {errors.phone || (successMessage && '成功訊息')}
                  </div>
                  <h5 className="card-title font-grey-title mt-3">郵箱</h5>
                  <input
                    type="email"
                    className="form-control rounded-5"
                    placeholder="name@example.com"
                    id="email"
                    name="email"
                    value={payment.email}
                    onChange={changeHandler}
                    onBlur={() => onBlurHandler('email')}
                    onFocus={onFocusHandler}
                  />
                  <div
                    className={`message ${
                      errors.email ? 'error-message' : 'success-message'
                    }`}
                  >
                    {errors.email || (successMessage && '成功訊息')}
                  </div>
                </div>
              </div>
              <div
                className="card border-primary mb-3"
                style={{ width: '40rem' }}
              >
                <div
                  className="card-header card-big-title border border-0"
                  style={{ backgroundColor: 'transparent ' }}
                >
                  收貨地址
                </div>
                <div className="card-body">
                  <TWZipCode
                    onPostcodeChange={(country, township, postcode) => {
                      // 如果需要处理postcode变化，进行相应处理
                      setPaymentData({ ...payment, postcode })
                    }}
                    initPostcode={payment.postcode}
                  />
                  <h5 className="card-title font-grey-title mt-3">
                    收貨地址<span className="text-danger">*</span>
                  </h5>
                  <input
                    className="form-control rounded-5"
                    type="text"
                    placeholder="請填詳細地址"
                    aria-label="default input example"
                    name="address"
                    id="address"
                    value={payment.address}
                    onChange={changeHandler}
                  />
                  <div className="form-check mt-3">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      onClick={() => {
                        setPaymentData({
                          name: '陳小豪',
                          phone: '0988123456',
                          email: 'ispan@ispan.com',
                          address: '復興南路一段390號2樓',
                        })
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      勾選帶入同會員資訊
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="card border-primary mb-3"
                style={{ width: '40rem' }}
              >
                <div
                  className="card-header card-big-title border border-0"
                  style={{ backgroundColor: 'transparent ' }}
                >
                  付款方式<span className="text-danger">*</span>
                </div>
                <div className="card-body">
                  <div>
                    <div
                      className={`form-check mb-3 form-control rounded-5 ${
                        selectedOption === 'flexRadioDefault1'
                          ? 'radius-plus-form'
                          : ''
                      }`}
                    >
                      <input
                        className="form-check-input mx-1 rounded-5"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        checked={selectedOption === 'flexRadioDefault1'}
                        onChange={() => handleRadioChange('flexRadioDefault1')}
                        value="貨到付款"
                      />
                      <label
                        className="form-check-label mx-2"
                        htmlFor="flexRadioDefault1"
                      >
                        貨到付款
                      </label>
                    </div>
                    <div
                      className={`form-check mb-3 form-control rounded-5 ${
                        selectedOption === 'flexRadioDefault2'
                          ? 'radius-plus-form'
                          : ''
                      }`}
                    >
                      <input
                        className="form-check-input mx-1 rounded-5"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={selectedOption === 'flexRadioDefault2'}
                        onChange={() => handleRadioChange('flexRadioDefault2')}
                        value="信用卡"
                      />
                      <label
                        className="form-check-label mx-2"
                        htmlFor="flexRadioDefault2"
                      >
                        信用卡
                      </label>
                    </div>
                    {/* {selectedOption === null && (
                      <p style={{ color: 'red' }}>请选择一个选项</p>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
