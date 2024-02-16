import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function RegisterAdd() {
  const router = useRouter()
  const [user, setUser] = useState({
    Lastname: '',
    Firstname: '',
    Phone: '',
    Birthday: '',
    Account: '',
    Password: '',
    ID: '',
    Email: '',
  })

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setUser({ ...user, [id]: value })
  }
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
                      value={user.Lastname}
                      onChange={changeHandler}
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
                      value={user.Firstname}
                      onChange={changeHandler}
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
                      value={user.Phone}
                      onChange={changeHandler}
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
                      value={user.Birthday}
                      onChange={changeHandler}
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
                      value={user.Account}
                      onChange={changeHandler}
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
                      id="Password"
                      name="Password"
                      value={user.Password}
                      onChange={changeHandler}
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
                      id="ID"
                      name="ID"
                      value={user.ID}
                      onChange={changeHandler}
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
                      value={user.Email}
                      onChange={changeHandler}
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
              <Link href="/member/register-edit2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg btn pro-shadow"
                  style={{ width: 250 }}
                  onClick={() => {
                    router.push('/member/register-edit2')
                  }}
                >
                  繼續編輯
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
