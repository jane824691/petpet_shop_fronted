import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import TWZipCode from '@/components/tw-zipcode/canReadInitCountryTownship'
import Link from 'next/link'
import styles from '@/css/favorite.module.css'
import { BsCameraFill } from 'react-icons/bs'

export default function Edit2(props) {
  const {
    step2,
    setStep2,
    setIsStep2Valid,
    errors,
    setErrors,
    validateFields,
  } = props

  useEffect(() => {
    console.log('step2 in Edit2', step2); // 這裡應該打印出 step2 的值
  }, [step2]);
  
  console.log('step2', step2);

  const handlePostcodeChange = (country, township, zipcode = '') => {
    // Update the state with the selected values
    setStep2((prevData) => ({
      ...prevData,
      country,
      township,
      zipcode,
    }))
    
  }
  // const [address, setAddress] = useState('')
  // const [show, setShow] = useState(false)
  // const handleClose = () => setShow(false)
  // const handleShow = () => setShow(true)

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
              // setImagePreview(reader.result)
            }
            if (file) {
              reader.readAsDataURL(file)
            } else {
              // setImagePreview(null)
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
                // imagePreview || 
                  `${
                  step2.photo
                    ? step2.photo
                    : '/pics/headshot.jpg'
                }`
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
      <div className="d-flex justify-content-center">
        <Image
          src="/pics/sleepcat2.png"
          width="510"
          height="110"
          alt="懶懶貓"
        />
      </div>
      <div className="list-form">
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
                <div className="row">
                  {/* Integrate TWZipCode component for selecting city */}

                  <div className="col">
                    <TWZipCode
                      initPostcode={step2 && step2.zipcode ? step2.zipcode : ''}
                      initCountry={step2 && step2.country ? step2.country : ''}
                      initTownship={step2 && step2.township ? step2.township : ''}
                      onPostcodeChange={handlePostcodeChange}
                    />
                  </div>
                </div>
                <br></br>
                <br></br>
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      通訊地址<span className="text-danger">*</span>
                    </h6>

                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      value={(step2 && step2.address) || ''}
                      placeholder="詳細地址"
                      aria-label="default input example"
                    />
                  </div>
                </div>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
