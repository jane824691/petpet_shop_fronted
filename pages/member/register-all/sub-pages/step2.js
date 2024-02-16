import React, { useState } from 'react'
import Image from 'next/image'
import TWZipCode from '@/pages/member/TWZipCode'
import { BsCameraFill } from 'react-icons/bs'
import styles from '@/css/favorite.module.css'

// 導入圖標
import { register_ADD } from '@/components/my-const'

//註冊第二步
function Step2(props) {
  // 新增圖片上傳的狀態
  const [imagePreview, setImagePreview] = useState(null)
  //儲存step1狀態
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
  const { step2, setStep2 } = props
  const handlePostcodeChange = (country, township, zipcode) => {
    // 根據選單更新狀態與[sid].js相關
    setStep2({
      country,
      township,
      zipcode,
    })
  }
  const [address, setAddress] = useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  // 一鍵輸入並保持step2的address的狀態
  const [autoAddress, setAutoAddress] = useState('')
  const [step2Address, setStep2Address] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    //step1資料
    formData.append('lastname', step1.lastname)
    formData.append('firstname', step1.firstname)
    formData.append('mobile', step1.mobile)
    formData.append('birthday', step1.birthday)
    formData.append('account', step1.account)
    formData.append('password', step1.password)
    formData.append('identification', step1.identification)
    formData.append('email', step1.email)

    // 添加 step2 的資料
    formData.append('country', step2.country)
    formData.append('township', step2.township)
    formData.append('postcode', step2.postcode)
    formData.append('photo', step2.photo)
    formData.append('address', autoAddress)

    //串接資料庫:fetch(url)
    try {
      const response = await fetch(register_ADD, {
        // method: 'POST',
        // body: JSON.stringify({ step1, step2 }),
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        method: 'POST',
        body: formData,
      })

      const responseData = await response.json()
      if (responseData.success) {
        alert('註冊成功')
      } else {
        alert('格式錯誤或未填寫')
      }
    } catch (error) {
      console.error('註冊過程中發生錯誤:', error)
    }
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
            console.log('Updated step2.photo:', file)
            const reader = new FileReader()
            reader.onloadend = () => {
              setImagePreview(reader.result)
            }
            if (file) {
              reader.readAsDataURL(file)
            } else {
              setImagePreview(null)
            }
            console.log('step2.photo:', file) //確認'photo'欄位值
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
      <h3 className="mx-5 py-3">會員註冊</h3>
      <div className="d-flex justify-content-center">
        <Image
          src="/pics/sleepcat2.png"
          width="510"
          height="110"
          alt="懶懶貓"
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
                    const newAddress = '復興南路1段390號2樓'
                    setAutoAddress(newAddress)
                    // 同時更新 step2 的 address 值
                    setStep2Address(newAddress)
                  }}
                />
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Integrate TWZipCode component for selecting city */}

                  <div className="col">
                    <TWZipCode
                      initPostcode={step2 ? step2.zipcode : ''}
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
                      value={autoAddress}
                      onChange={(e) => setAutoAddress(e.target.value)}
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
      </form>
    </>
  )
}
export default Step2
