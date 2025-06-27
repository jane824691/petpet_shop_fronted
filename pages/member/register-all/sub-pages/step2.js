import React, { useState } from 'react'
import Image from 'next/image'
import TWZipCode from '@/components/tw-zipcode'
import { BsCameraFill } from 'react-icons/bs'
import styles from '@/css/favorite.module.css'
import { useIntl } from 'react-intl'

//註冊第二步
function Step2(props) {
  const intl = useIntl()
  const {
    step2,
    setStep2,
    setIsStep2Valid,
    errors,
    setErrors,
    validateFields,
  } = props

  // 新增圖片上傳的狀態
  const [imagePreview, setImagePreview] = useState(null)

  const handlePostcodeChange = (country, township, zipcode = '') => {
    setStep2((prevData) => ({
      ...prevData,
      country,
      township,
      zipcode,
    }))
    if (country && township && zipcode) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        zipcode: '',
      }))
    } else if (!zipcode) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        zipcode: intl.formatMessage({ id: 'validation.zipcodeRequired' }),
      }))
    }
  }

  const handleAddressChange = (e) => {
    const addressValue = e.target.value

    // 更新地址
    setStep2((prevData) => ({
      ...prevData,
      address: addressValue,
    }))

    // 直接在輸入時進行驗證
    const newErrors = validateFields({
      ...step2,
      address: addressValue, // 使用當前輸入的地址進行驗證
    })

    // 更新錯誤狀態
    setErrors((prevErrors) => ({
      ...prevErrors,
      address: newErrors.address,
    }))

    // 更新步驟驗證狀態
    setIsStep2Valid(
      Object.keys(newErrors).every((key) => newErrors[key] === '')
    ) // 更新為所有欄位驗證通過時才為 true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <>
      {/* 上傳圖片的部分，獨立於表單之外 */}
      <form encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0]
            setStep2((prevStep2) => ({ ...prevStep2, photo: file || null }))
            const reader = new FileReader()
            reader.onloadend = () => {
              setImagePreview(reader.result)
            }
            if (file) {
              reader.readAsDataURL(file)
            } else {
              setImagePreview(null)
            }
          }}
          style={{ display: 'none' }} // 隱藏實際的上傳 input
          id="fileInput"
        />
        <div className={styles.memberPicOut} style={{ marginTop: '50px' }}>
          <div style={{ position: 'relative' }}>
            <Image
              alt=""
              src={imagePreview || '/pics/headshot.jpg'}
              className={styles.memberPic}
              width="140"
              height="140"
            />
          </div>
          <BsCameraFill
            className={`camera-icon ${styles.cameraIcon}`}
            onClick={() => {
              document.querySelector('#fileInput').click()
            }}
          />
        </div>
      </form>

      {/* 表單部分 */}
      <h3 className="mx-5 py-3">{intl.formatMessage({ id: 'member.register' })}</h3>
      <div className="d-flex justify-content-center mx-auto px-3 px-sm-5" style={{ maxWidth: '600px' }}>
        <Image
          src="/pics/sleepcat2.png"
          width={510}
          height={110}
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
                {intl.formatMessage({ id: 'member.contactAddress' })}
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
                    setStep2((prevData) => ({
                      ...prevData,
                      country: '台北市',
                      township: '大安區',
                      zipcode: '106',
                      address: '復興南路一段390號2樓',
                    }))
                    setIsStep2Valid(true)
                    setErrors({})
                  }}
                />
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 pb-3">
                    <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.city' })}*</h6>
                    <TWZipCode
                      initPostcode={step2 && step2.zipcode ? step2.zipcode : ''}
                      onPostcodeChange={handlePostcodeChange}
                    />
                    {errors?.zipcode && (
                      <div className="error-message">{errors.zipcode}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 pb-3">
                    <h6 className="card-title font-grey-title">
                      {intl.formatMessage({ id: 'member.address' })}
                      <span className="text-danger">*</span>
                    </h6>

                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      value={(step2 && step2.address) || ''}
                      onChange={handleAddressChange}
                      placeholder={intl.formatMessage({ id: 'member.pleaseEnterAddress' })}
                      aria-label="default input example"
                    />
                    {errors?.address && (
                      <div className="error-message">{errors.address}</div>
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
export default Step2
