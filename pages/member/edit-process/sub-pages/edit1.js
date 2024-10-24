import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Edit1(props) {
  const { step1, setStep1, setIsStep1Valid } = props // 接收驗證函數

  const onSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <h3 className="mx-5 py-3">編輯資料</h3>
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
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title ">
                      姓氏<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Lastname"
                      name="Lastname"
                      value={(step1 && step1.lastname) || ''}
                      // onChange={changeHandler}
                      placeholder="姓氏"
                      aria-label="default input example"
                    />
                  </div>

                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      名字<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Firstname"
                      name="Firstname"
                      value={(step1 && step1.firstname) || ''}
                      // onChange={changeHandler}
                      placeholder="名字"
                      aria-label="default input example"
                    />
                  </div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      電話號碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Phone"
                      name="Phone"
                      value={(step1 && step1.mobile) || ''}
                      // onChange={changeHandler}
                      placeholder="請填電話號碼"
                      aria-label="default input example"
                    />
                  </div>
                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      出生年月日
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="date"
                      id="Birthday"
                      name="Birthday"
                      value={(step1 && step1.birthday) || ''}
                      // onChange={changeHandler}
                      placeholder="請填日期"
                      aria-label="default input example"
                      max="2013-12-31"
                    />
                  </div>
                </div>
                <br></br>
                <div className="row">
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
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
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
                <br></br>
                <div className="row">
                  <div className="col">
                    <h6 className="card-title font-grey-title">
                      身分證字號<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="ID"
                      name="ID"
                      value={(step1 && step1.identification) || ''}
                      // onChange={changeHandler}
                      placeholder="請填身分證字號"
                      aria-label="default input example"
                    />
                  </div>

                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      電子信箱<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      id="Email"
                      name="Email"
                      value={(step1 && step1.email) || ''}
                      // onChange={changeHandler}
                      placeholder="請填電子信箱"
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
