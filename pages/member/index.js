import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/css/favorite.module.css'
import Image from 'next/image'
import AuthContext from '@/components/contexts/AuthContext'
import { useContext } from 'react'
import { GET_MEMBER_DATA } from '@/components/my-const'
// icon
import { BsFillTicketDetailedFill } from 'react-icons/bs'
import { BsCart4 } from 'react-icons/bs'
import { BsFillTrophyFill } from 'react-icons/bs'
import { BsBagHeartFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Link from 'next/link'
// icon

export default function Profile() {
  const router = useRouter()
  const { auther } = useContext(AuthContext)

  const [mydata, setMydata] = useState({
    sid: '',
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
      <main className={styles.main}>
        {/* 左邊欄位 */}
        <div className={styles.leftList}>
          <div className={styles.memberPicOut}>
            <Image
              alt=""
              src=
              {`${
                mydata.photo
                  ? mydata.photo
                  : '/pics/headshot.jpg'
              }`}
              className={styles.memberPic}
              width="140"
              height="140"
            ></Image>
          </div>

          <div className={styles.memberItems}>
            <br></br>
            <div className={styles.name}>會員名稱</div>
            <br></br>
            {auther.account ? (
              <>
                <div className={styles.name}>
                  <span>{auther.account}</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.name}>
                  <span style={{ color: 'white' }}></span>User
                </div>
              </>
            )}
            <br></br>
            <div className={styles.nowLocationOut}>
              <div className={styles.nowLocation}>編輯個人資料</div>
            </div>
          </div>

          <div className={styles.iconsOut}>
            <div className={styles.icons}>
              <br></br>
              <div className={styles.icon}>
                <BsFillTicketDetailedFill className={styles.iconSick} />
                <Link className={styles.iconLink} href="favorite/coupon2">
                  {' '}
                  優惠券管理
                </Link>
              </div>
              <div className={styles.icon}>
                <BsCart4 className={styles.iconSick} />
                <Link className={styles.iconLink} href="../member/member-orderList">
                  {' '}
                  購物清單
                </Link>
              </div>
              <div className={styles.icon}>
                <BsFillTrophyFill className={styles.iconSick} />
                <Link className={styles.iconLink} href="favorite/game">
                  {' '}
                  簽到任務
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-direction: column">
          <h3 className="mx-5 py-5">會員中心</h3>
          <div className="list-form">
            <div className="d-flex justify-content-center">
              <div className="direction-column">
                <div
                  className="card mb-3 border-danger"
                  style={{ width: '40rem' }}
                >
                  <div
                    className="card-header card-big-title border border-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    會員資訊
                  </div>
                  <div className="card-body ">
                    <div className="row">
                      <div className="col">
                        <h6 className="card-title font-grey-title">姓氏</h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder="姓氏"
                          id="lastname"
                          name="lastname"
                          aria-label="default input example"
                          value={mydata.lastname} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, lastname: e.target.value })
                          }
                        />
                      </div>

                      <div className="col">
                        <h6 className="card-title font-grey-title mt-3 mt-md-0">
                          名字
                        </h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder="名字"
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
                      <div className="col">
                        <h6 className="card-title font-grey-title">電話號碼</h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder="請填電話號碼"
                          id="mobile"
                          name="mobile"
                          aria-label="default input example"
                          value={mydata.mobile} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, mobile: e.target.value })
                          }
                        />
                      </div>

                      <div className="col">
                        <h6 className="card-title font-grey-title mt-3 mt-md-0">
                          出生年月日
                        </h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="date"
                          id="birthday"
                          name="birthday"
                          placeholder="請填日期"
                          aria-label="default input example"
                          value={mydata.birthday} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, birthday: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <h6 className="card-title font-grey-title mt-3">郵箱</h6>
                    <input
                      type="email"
                      className="form-control rounded-5 border border-primary"
                      name="email"
                      id="email"
                      placeholder="請填 Email"
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

          <div className="list-form">
            <div className="d-flex justify-content-center">
              <div className="direction-column">
                <div
                  className="card border-danger mb-3"
                  style={{ width: '40rem' }}
                >
                  <div
                    className="card-header card-big-title border border-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    聯絡地址
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h6 className="card-title font-grey-title">縣市*</h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder="請選擇縣市"
                          aria-label="default input example"
                          value={mydata.country} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, city: e.target.value })
                          }
                        />
                      </div>

                      <div className="col">
                        <h6 className="card-title font-grey-title mt-3 mt-md-0">
                          鎮市區*
                        </h6>
                        <input
                          className="form-control T-18 rounded-5 border border-primary"
                          type="text"
                          placeholder="請選擇鄉鎮市區"
                          aria-label="default input example"
                          value={mydata.township} // 這裡是關聯的部分
                          onChange={(e) =>
                            setMydata({ ...mydata, district: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <h6 className="card-title font-grey-title mt-3">
                      郵遞區號
                    </h6>
                    <input
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
                      收件地址*
                    </h6>
                    <input
                      type="text"
                      className="form-control rounded-5 border border-primary"
                      id="exampleFormControlInput1"
                      placeholder="詳細地址"
                      value={mydata.address} // 這裡是關聯的部分
                      onChange={(e) =>
                        setMydata({ ...mydata, address: e.target.value })
                      }
                    />
                    <br />
                  </div>
                </div>
                <div className="d-flex justify-content-between py-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg btn pro-shadow "
                    style={{ width: 250 }}
                  >
                    回到前一頁
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg btn pro-shadow"
                    style={{ width: 250 }}
                    // onClick={() => {
                    //   router.push('/member/register-edit')
                    // }}
                  >
                    編輯資料
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
