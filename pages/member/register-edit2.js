import React, { useState } from 'react'
import Image from 'next/image'
//import styles from '@/css/home.module.css'
import TWZipCode from './TWZipCode'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function Register() {
  const [data, setData] = useState({
    country: '',
    township: '',
    postcode: '',
  })

  const handlePostcodeChange = (country, township, postcode) => {
    // Update the state with the selected values
    setData({
      country,
      township,
      postcode,
    })
  }
  const [address, setAddress] = useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
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
                      initPostcode={data.postcode}
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
                      value={address}
                      placeholder="詳細地址"
                      aria-label="default input example"
                    />
                  </div>
                </div>
                <br></br>
              </div>
            </div>
            <div className="d-flex justify-content-between py-4">
              <Link href="/member/register-edit">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg btn pro-shadow"
                  style={{ width: 250 }}
                >
                  回到前一頁
                </button>
              </Link>
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn pro-shadow"
                style={{ width: 250 }}
                onClick={handleShow}
              >
                編輯完成
              </button>
              {/* modal */}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header className="modal-form">
                  <Modal.Title className="modal-form">
                    編輯成功!!
                    <div>
                      <h5>您的支持是我們最大的動力~</h5>
                    </div>
                  </Modal.Title>
                  <Image
                    src="/pics/close.png"
                    alt="叉叉"
                    width="40"
                    height="30"
                    className="mb-3"
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '-22px',
                      right: '-20px',
                    }}
                    onClick={handleClose}
                  />
                </Modal.Header>
                <Modal.Body className="modal-form" style={{ height: 130 }}>
                  <Image
                    src="/pics/nike.png"
                    alt="打勾"
                    width="100"
                    height="100"
                    className="mx-auto"
                  />
                </Modal.Body>
                <Modal.Footer className="modal-form">
                  <Button
                    variant="info"
                    className="mx-auto"
                    style={{
                      width: '120px',
                      cursor: 'pointer',
                      boxShadow: 'none',
                    }}
                    onClick={handleClose}
                  >
                    確定
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
