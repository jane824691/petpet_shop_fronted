import React, { useState } from 'react'
import Image from 'next/image'
import TWZipCode from '@/components/tw-zipcode/canReadInitCountryTownship'
import styles from '@/css/favorite.module.css'
import { BsCameraFill } from 'react-icons/bs'

export default function Edit2(props) {
  const {
    step2,
    setStep2,
    setIsStep2Valid,
    errors,
    setErrors,
    validateFields
  } = props

  const handlePostcodeChange = (country, township, zipcode = '') => {
    // Update the state with the selected values
    setStep2((prevData) => ({
      ...prevData,
      country,
      township,
      zipcode
    }))
  }
  // 新增圖片上傳的狀態
  const [imagePreview, setImagePreview] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const handleAddressChange = (e) => {
    const addressValue = e.target.value

    // 更新地址
    setStep2((prevData) => ({
      ...prevData,
      address: addressValue
    }))

    // 直接在輸入時進行驗證
    const newErrors = validateFields({
      ...step2,
      address: addressValue // 使用當前輸入的地址進行驗證
    })

    // 更新錯誤狀態
    setErrors((prevErrors) => ({
      ...prevErrors,
      address: newErrors.address
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
      <form encType="multipart/form-data" className='pt-5'>
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
              const tempUrl = URL.createObjectURL(file)
              setImageUrl(tempUrl)
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
              src={
                imagePreview ||
                imageUrl ||
                `${step2?.photo ? step2.photo : '/pics/headshot.jpg'}`
              }
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
      <h3 className="mx-5 py-3">編輯資料</h3>
      <div className="d-flex justify-content-center mx-auto px-3 px-sm-5" style={{ maxWidth: '600px' }}>
        <Image
          src="/pics/sleepcat2.png"
          width={510}
          height={110}
          alt="懶懶貓"
          className="w-100 h-auto"
        />
      </div>
      <div className="list-form mx-4">
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div className="card border-danger mb-3 px-4 py-4">
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent' }}
              >
                聯絡地址
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 pb-3">
                    <h6 className="card-title font-grey-title">縣市*</h6>
                    <TWZipCode
                      initPostcode={step2 && step2.zipcode ? step2.zipcode : ''}
                      initCountry={step2 && step2.country ? step2.country : ''}
                      initTownship={
                        step2 && step2.township ? step2.township : ''
                      }
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
                      通訊地址<span className="text-danger">*</span>
                    </h6>

                    <textarea
                      className={`${styles.responsiveRounded} form-control border border-primary`}
                      type="text"
                      id="address"
                      name="address"
                      value={(step2 && step2.address) || ''}
                      placeholder="詳細地址"
                      aria-label="default input example"
                      onChange={handleAddressChange}
                      style={{
                        wordWrap: 'break-word',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        minHeight: '60px',
                        resize: 'none',
                        lineHeight: '1.5'
                      }}
                      rows="2"
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
      </div>
    </>
  )
}
