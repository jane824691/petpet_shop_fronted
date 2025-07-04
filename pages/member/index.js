import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from '@/css/favorite.module.css'
import AuthContext from '@/components/contexts/AuthContext'
import { GET_MEMBER_DATA } from '@/components/my-const'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import LeftList from '@/components/LeftList'
import { useIntl } from 'react-intl'

export default function Profile() {
  const router = useRouter()
  const { logout } = useContext(AuthContext)
  const intl = useIntl()

  const [mydata, setMydata] = useState({
    sid: '',
    photo: '',
    lastname: '',
    firstname: '',
    birthday: '',
    mobile: '',
    account: '',
    password: '',
    zipcode: '',
    address: '',
    identification: '',
    email: '',
    city: '',
    district: '',
  })

  // 刷進該頁面, 檢查token是否過期
  useEffect(() => {
    const token = localStorage.getItem('auther')
    if (token) {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000 //單位:毫秒轉秒
      if (decodedToken.exp < currentTime) {
        logout() // token 過期，自動登出
      }
    }
  }, [])

  // 去抓後端處理好的單筆資料(顯示在會員中心)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 檢查 localStorage 中是否存在 'auther'，以及 'auther' 是否有有效的 sid
        const authDataString = localStorage.getItem('auther')
        if (!authDataString) {
          // 未登入會直接跳轉回首頁
          // TODO: needs a loading to prevent show out the member page before jump back to index page
          router.push('/')
          return
        }
        const authData = JSON.parse(authDataString)
        if (!authData || !authData.sid) {
          router.push('/')
          // console.log('停權會員')
          return
        }
        const sid = authData.sid
        const token = JSON.parse(localStorage.getItem("auther"))?.token;
        const response = await fetch(GET_MEMBER_DATA, {
          body: JSON.stringify({ sid: sid, token }),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${authData.token}`,
          },
          method: 'POST',
        })
        const memberData = await response.json()

        // 處理生日格式
        if (memberData.birthday) {
          memberData.birthday = dayjs(memberData.birthday).format('YYYY-MM-DD')
        }

        setMydata(memberData)
      } catch (error) {
        // console.error('Error fetching mydata:', error)
      }
    }

    // 呼叫 fetchData 以觸發資料載入
    fetchData()
  }, [router.query.sid])

  return (
    <>
      <main className={`${styles.main} d-block d-md-flex`}>
        {/* 左邊欄位 */}
        <LeftList photo={mydata.photo} />

        <hr className="border-primary border-1 opacity-75" />
        <div className="flex-direction: column">
          <h3 className="mx-5 mt-5 pt-5 py-2">{intl.formatMessage({ id: 'member.profile' })}</h3>
          <div className="list-form mx-4">
            <div className="d-flex justify-content-center">
              <div className="direction-column">
                <div
                  className="card mb-3 border-danger px-4 py-4"
                >
                  <div
                    className="card-header card-big-title border border-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {intl.formatMessage({ id: 'member.personalInfo' })}
                  </div>
                  <div className="card-body ">
                    <div className="row">
                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.lastName' })}</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'member.lastName' })}
                          id="lastname"
                          name="lastname"
                          aria-label="default input example"
                          value={mydata.lastname} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, lastname: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.firstName' })}</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'member.firstName' })}
                          aria-label="default input example"
                          id="firstname"
                          name="firstname"
                          value={mydata.firstname} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, firstname: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.phoneNumber' })}</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'member.phoneNumber' })}
                          id="mobile"
                          name="mobile"
                          aria-label="default input example"
                          value={mydata.mobile} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, mobile: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.birthday' })}</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="date"
                          id="birthday"
                          name="birthday"
                          placeholder={intl.formatMessage({ id: 'member.birthday' })}
                          aria-label="default input example"
                          value={mydata.birthday} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, birthday: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <h6 className="card-title font-grey-title mt-3">{intl.formatMessage({ id: 'member.email' })}</h6>
                    <input
                      readOnly
                      disabled
                      type="email"
                      className="form-control rounded-5 border border-primary"
                      name="email"
                      id="email"
                      placeholder={intl.formatMessage({ id: 'member.email' })}
                      value={mydata.email} // 這裡是關聯的部分
                      onChange={(e) =>
                        setMydata({ ...mydata, email: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="list-form mx-4">
            <div className="d-flex justify-content-center">
              <div className="direction-column">
                <div
                  className="card border-danger mb-3 px-4 py-4"
                >
                  <div
                    className="card-header card-big-title border border-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {intl.formatMessage({ id: 'member.contactAddress' })}
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.city' })}*</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'member.city' })}
                          aria-label="default input example"
                          value={mydata.country} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, city: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-12 col-sm-6 pb-3">
                        <h6 className="card-title font-grey-title">{intl.formatMessage({ id: 'member.district' })}*</h6>
                        <input
                          readOnly
                          disabled
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'member.district' })}
                          aria-label="default input example"
                          value={mydata.township} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, district: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <h6 className="card-title font-grey-title mt-3">
                      {intl.formatMessage({ id: 'member.zipcode' })}
                    </h6>
                    <input
                      readOnly
                      disabled
                      className="form-control T-18 rounded-5 border border-primary"
                      type="text"
                      placeholder="Zip Code"
                      aria-label="default input example"
                      value={mydata.zipcode} // 這裡是關聯的部分
                      onChange={(e) =>
                        setMydata({ ...mydata, zipcode: e.target.value })
                      }
                    />

                    <h6 className="card-title font-grey-title mt-3">
                      {intl.formatMessage({ id: 'member.address' })}*
                    </h6>
                    <textarea
                      readOnly
                      disabled
                      type="text"
                      className={`${styles.responsiveRounded} form-control border border-primary`}
                      id="exampleFormControlInput1"
                      placeholder={intl.formatMessage({ id: 'member.detailedAddress' })}
                      value={mydata.address} // 這裡是關聯的部分
                      onChange={(e) =>
                        setMydata({ ...mydata, address: e.target.value })
                      }
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
                    <br />
                  </div>
                </div>
                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 gap-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg btn pro-shadow px-5"
                  >
                    {intl.formatMessage({ id: 'member.backToPrevious' })}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg btn pro-shadow px-5"
                    onClick={() => {
                      router.push('/member/edit-process')
                    }}
                  >
                    {intl.formatMessage({ id: 'member.editData' })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
