import { useState } from 'react'
import TWZipCode from '@/components/tw-zipcode'
import { useIntl } from 'react-intl'

export default function Payment(props) {
  const intl = useIntl()
  const { paymentData, setPaymentData } = props
  const [isChecked, setIsChecked] = useState(false)

  // 一次處理購物者多項資訊用, 可控表單
  const changeHandler = (e) => {
    const { id, value } = e.target
    setPaymentData((prevPayment) => ({
      ...prevPayment,
      [id]: value,
      pid: prevPayment.pid,
      sale_price: prevPayment.sale_price,
      actual_amount: prevPayment.actual_amount,
    }))
  }

  // 欄位檢查
  const [errors, setErrors] = useState({})

  // 檢查機制
  const onBlurHandler = (fieldName) => {
    const newErrors = validateFields({ ...paymentData }) // 正確傳遞 paymentData 物件
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
    if (!/[\u4e00-\u9fa5]+/.test(paymentData.name.trim())) {
      newErrors.name = intl.formatMessage({ id: 'validation.firstnameChinese' })
    } else {
      newErrors.name = '' // 清空錯誤訊息
    }

    // 檢查電話號碼格式
    if (!/^(09\d{2}-?\d{3}-?\d{3})$/.test(paymentData.phone.trim())) {
      newErrors.phone = intl.formatMessage({ id: 'validation.phoneFormat' })
    } else {
      newErrors.phone = '' // 清空錯誤訊息
    }

    // 檢查 Email 格式
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        paymentData.email.trim()
      )
    ) {
      newErrors.email = intl.formatMessage({ id: 'validation.emailFormat' })
    } else {
      newErrors.email = '' // 清空錯誤訊息
    }

    // 檢查地址格式
    if (!/[\u4e00-\u9fa5]+/.test(paymentData.address.trim())) {
      newErrors.address = intl.formatMessage({ id: 'validation.addressFormat' })
    } else {
      newErrors.address = '' // 清空錯誤訊息
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
      ...paymentData,
      pay_way:
        optionId === 'flexRadioDefault1'
          ? intl.formatMessage({ id: 'cart.cashOnDelivery' })
          : optionId === 'flexRadioDefault2'
          ? intl.formatMessage({ id: 'cart.creditCard' })
          : '',
    })
  }

  const handleSampleClick = () => {
    setIsChecked(true)
    setPaymentData((prevData) => ({
      ...prevData,
      name: '陳小豪',
      phone: '0988123456',
      email: 'ispan@ispan.com',
      address: '復興南路一段390號2樓',
      postcode: '106',
      pay_way: intl.formatMessage({ id: 'cart.cashOnDelivery' }),
    }))
    setSelectedOption('flexRadioDefault1')
  }
  return (
    <>
      <div className="d-flex justify-content-center mx-auto px-3 px-sm-5 mt-5" style={{ maxWidth: '600px' }}>
        <img src="/images/product/steps_to_payment.png" alt="" className="w-100 h-auto" />
      </div>
      <form className="list-form mx-4">
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div
              className="card border-primary mb-3"
              style={{ maxWidth: '40rem' }}
            >
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent' }}
              >
                {intl.formatMessage({ id: 'cart.recipientInfo' })}
              </div>
              <div className="card-body mx-3 mb-3">
                <h5 className="card-title font-grey-title">
                  {intl.formatMessage({ id: 'member.firstName' })}
                  <span className="text-danger">*</span>
                </h5>
                <input
                  className="form-control T-18 rounded-5"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'member.pleaseEnterFirstName' })}
                  name="name"
                  id="name"
                  value={(paymentData && paymentData.name) || ''}
                  onChange={changeHandler}
                  onBlur={() => onBlurHandler('name')}
                  onFocus={onFocusHandler}
                />
                <div
                  className={`message ${
                    errors.name ? 'error-message' : 'success-message'
                  }`}
                >
                  {errors.name || (successMessage && intl.formatMessage({ id: 'common.success' }))}
                </div>
                <h5 className="card-title font-grey-title mt-3">
                  {intl.formatMessage({ id: 'common.tel' })}
                  <span className="text-danger">*</span>
                </h5>
                <input
                  className="form-control T-18 rounded-5"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'member.pleaseEnterPhone' })}
                  name="phone"
                  id="phone"
                  value={(paymentData && paymentData.phone) || ''}
                  onChange={changeHandler}
                  onBlur={() => onBlurHandler('phone')}
                  onFocus={onFocusHandler}
                />
                <div
                  className={`message ${
                    errors.phone ? 'error-message' : 'success-message'
                  }`}
                >
                  {errors.phone || (successMessage && intl.formatMessage({ id: 'common.success' }))}
                </div>
                <h5 className="card-title font-grey-title mt-3">{intl.formatMessage({ id: 'member.email' })}</h5>
                <input
                  type="email"
                  className="form-control rounded-5"
                  placeholder="name@example.com"
                  id="email"
                  name="email"
                  value={(paymentData && paymentData.email) || ''}
                  onChange={changeHandler}
                  onBlur={() => onBlurHandler('email')}
                  onFocus={onFocusHandler}
                />
                <div
                  className={`message ${
                    errors.email ? 'error-message' : 'success-message'
                  }`}
                >
                  {errors.email || (successMessage && intl.formatMessage({ id: 'common.success' }))}
                </div>
              </div>
            </div>
            <div
              className="card border-primary mb-3"
              style={{ maxWidth: '40rem' }}
            >
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.shippingAddress' })}
              </div>
              <div className="card-body mx-3 mb-3">
                <TWZipCode
                  onPostcodeChange={(country, township, postcode) => {
                    setPaymentData({ ...paymentData, postcode })
                  }}
                  initPostcode={(paymentData && paymentData.postcode) || ''}
                  id="postcode"
                  value={(paymentData && paymentData.postcode) || ''}
                  onChange={changeHandler}
                  onBlur={() => onBlurHandler('postcode')}
                  onFocus={onFocusHandler}
                />
                <div
                  className={`message ${
                    errors.postcode ? 'error-message' : 'success-message'
                  }`}
                >
                  {errors.postcode || (successMessage && intl.formatMessage({ id: 'common.success' }))}
                </div>
                <h5 className="card-title font-grey-title mt-3">
                  {intl.formatMessage({ id: 'cart.shippingAddress' })}
                  <span className="text-danger">*</span>
                </h5>
                <input
                  className="form-control rounded-5"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'member.pleaseEnterAddress' })}
                  aria-label="default input example"
                  name="address"
                  id="address"
                  value={(paymentData && paymentData.address) || ''}
                  onChange={changeHandler}
                  onBlur={() => onBlurHandler('address')}
                  onFocus={onFocusHandler}
                />
                <div
                  className={`message ${
                    errors.address ? 'error-message' : 'success-message'
                  }`}
                >
                  {errors.address || (successMessage && intl.formatMessage({ id: 'common.success' }))}
                </div>
                <div
                  className="form-check mt-3"
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={isChecked}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSampleClick()
                    }
                  }}
                  onClick={() => {
                    handleSampleClick()
                  }}
                >
                  <input
                    className="form-check-input "
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // 保持這裡不做事，因為整個區塊已接管點擊
                    readOnly
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {intl.formatMessage({ id: 'cart.loadTestInfo' })}
                  </label>
                </div>
              </div>
            </div>
            <div
              className="card border-primary mb-3"
              style={{ maxWidth: '40rem' }}
            >
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.paymentMethod' })}
                <span className="text-danger">*</span>
              </div>
              <div className="card-body mx-3">
                <div>
                  <div
                    className={`form-check mb-3 form-control rounded-5 ${
                      selectedOption === 'flexRadioDefault1' ||
                      paymentData?.pay_way === intl.formatMessage({ id: 'cart.cashOnDelivery' })
                        ? 'radius-plus-form'
                        : ''
                    }`}
                  >
                    <input
                      className="form-check-input mx-1 rounded-5"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      checked={
                        selectedOption === 'flexRadioDefault1' ||
                        paymentData?.pay_way === intl.formatMessage({ id: 'cart.cashOnDelivery' })
                      }
                      onChange={() => handleRadioChange('flexRadioDefault1')}
                      value={intl.formatMessage({ id: 'cart.cashOnDelivery' })}
                    />
                    <label
                      className="form-check-label mx-2"
                      htmlFor="flexRadioDefault1"
                    >
                      {intl.formatMessage({ id: 'cart.cashOnDelivery' })}
                    </label>
                  </div>
                  <div
                    className={`form-check mb-3 form-control rounded-5 ${
                      selectedOption === 'flexRadioDefault2' ||
                      paymentData?.pay_way === intl.formatMessage({ id: 'cart.creditCard' })
                        ? 'radius-plus-form'
                        : ''
                    }`}
                  >
                    <input
                      className="form-check-input mx-1 rounded-5"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      checked={
                        selectedOption === 'flexRadioDefault2' ||
                        paymentData?.pay_way === intl.formatMessage({ id: 'cart.creditCard' })
                      }
                      onChange={() => handleRadioChange('flexRadioDefault2')}
                      value={intl.formatMessage({ id: 'cart.creditCard' })}
                    />
                    <label
                      className="form-check-label mx-2"
                      htmlFor="flexRadioDefault2"
                    >
                      {intl.formatMessage({ id: 'cart.creditCard' })}
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
    </>
  )
}
