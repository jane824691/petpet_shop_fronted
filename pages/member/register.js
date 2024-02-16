import React, { useState } from 'react'
import Image from 'next/image'
import styles from '@/css/home.module.css'
import Link from 'next/link'

export default function Register() {
  const [user, setUser] = useState({
    Lastname: '',
    Firstname: '',
    Phone: '',
    Account: '',
    Password: '',
    ID: '',
    Email: '',
  })
  return (
    <>
      <h3 className="mx-5 py-3">會員註冊</h3>
      <div className="d-flex justify-content-center">
        <Image
          src="/pics/sleepcat.png"
          width="500"
          height="100"
          alt="懶懶貓"
        ></Image>
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
                  onClick={() =>
                    setUser({
                      Lastname: '陳',
                      Firstname: '小豪',
                      Phone: '0988123456',
                      Account: 'LittleHao',
                      Password: 'LH123456',
                      ID: 'A126789898',
                      Email: 'LittleHao@gmail.com',
                    })
                  }
                />
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
                      value={user.Lastname}
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
                      value={user.Firstname}
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
                      value={user.Phone}
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
                      placeholder="請填日期"
                      aria-label="default input example"
                      value=""
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
                      value={user.Account}
                      placeholder="請填帳號"
                      aria-label="default input example"
                    />
                  </div>

                  <div className="col">
                    <h6 className="card-title font-grey-title mt-3 mt-md-0">
                      密碼<span className="text-danger">*</span>
                    </h6>
                    <input
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      value={user.Password}
                      placeholder="請填密碼"
                      aria-label="default input example"
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
                      value={user.ID}
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
                      value={user.Email}
                      placeholder="請填電子信箱"
                      aria-label="default input example"
                    />
                  </div>
                </div>

                <br></br>
              </div>
            </div>
            <div className="d-flex justify-content-between py-4">
              <Link href="/member/login">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg btn pro-shadow"
                  style={{ width: 250 }}
                >
                  回到前一頁
                </button>
              </Link>
              <Link href="/member/register2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg btn pro-shadow"
                  style={{ width: 250 }}
                >
                  繼續註冊
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
