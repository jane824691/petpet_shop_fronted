import { useState, useEffect, useContext } from 'react'
import AuthContext from '@/components/contexts/AuthContext'
import { useRouter } from 'next/router'
import { ORDER_LIST, GET_MEMBER_DATA } from '@/components/my-const'
import dayjs from 'dayjs'
import { BsArrowRight } from 'react-icons/bs'
import LeftList from '@/components/LeftList'
import PagesBar from '@/components/PagesBar'

export default function MemberOrderList() {
  const [data, setData] = useState({})
  const router = useRouter()

  const [mydata, setMydata] = useState({
    sid: '',
    lastname: '',
    firstname: '',
    photo: '',
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
  const { auther } = useContext(AuthContext)

  const [sid, setSid] = useState('') //抓到sid後存起來給後面抓取會員訂單資料用

  // 去抓後端處理好的單筆資料(顯示在會員中心)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 檢查 localStorage 中是否存在 'auther'，以及 'auther' 是否有有效的 sid
        //如果沒登入就跑到會員中心不會報錯
        const authDataString = localStorage.getItem('auther')
        if (!authDataString) {
          // console.log('No "auther" data found.')
          router.push('/')
          return
        }
        const authData = JSON.parse(authDataString)
        if (!authData || !authData.sid) {
          // console.log('No valid "auther" data found.')
          router.push('/')
          return
        }
        const sid = authData.sid
        const token = JSON.parse(localStorage.getItem("auther"))?.token;
        setSid(sid)
        const response = await fetch(GET_MEMBER_DATA, {
          body: JSON.stringify({ sid: sid, token: token }),
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

  //取page資料
  const getListData = async () => {
    if (!sid) return // 如果 sid 不存在則不發request
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const r = await fetch(ORDER_LIST + `/${sid}` + `?page=${page}`) // 使用當前會員的sid抓訂單資訊
      const d = await r.json()
      setData(d)
    } catch (ex) {
      // console.error('error:', ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page, sid])
  return (
    <>
      <div className="container d-flex">
        {/* 左邊欄位 */}
        <LeftList photo={mydata.photo} />

        <div className="mx-auto">
          <h3>購物清單</h3>
          {data.rows && data.rows.length > 0 ? (
            data.rows.map((v, i) => {
              const handleItemClick = () => {
                router.push(`../../cart/${v.oid}`)
              }
              return (
                <form className="my-4" key={v.oid}>
                  <div
                    className="d-flex justify-content-center"
                    role="button"
                    tabIndex={0}
                    onClick={handleItemClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`../../cart/${v.oid}`)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="direction-column">
                      <div
                        className="card border-primary"
                        style={{ width: '40rem' }}
                      >
                        <div
                          className="card-header card-big-title border border-0"
                          style={{ backgroundColor: 'transparent ' }}
                        >
                          訂單編號：{v.oid}
                        </div>
                        <div className="card-body">
                          <h5 className="card-title font-grey-title mb-2">
                            訂單成立時間：
                            {dayjs(v.order_date).format('YYYY-MM-DD HH:mm:ss')}
                          </h5>
                          <h5 className="card-title font-grey-title mb-2 ">
                            付款方式：{v.pay_way}
                          </h5>
                          <h5 className="card-title font-grey-title mb-2 text-info">
                            付款情況：
                            {v.order_status === 1
                              ? '已付款'
                              : v.order_status === 0
                                ? '未付款'
                                : ''}
                          </h5>
                          <h5 className="card-title font-grey-title mb-2">
                            交貨方式：{v.delivery_way}
                          </h5>
                          <h5 className="card-title font-grey-title mb-2 text-success">
                            處理情況：{v.delivery_status}
                          </h5>
                          <div className="d-flex justify-content-between">
                            <h5 className="card-title font-grey-title mb-2 text-danger">
                              總金額：NT$ {v.total}
                            </h5>
                            <h5>
                              See more <BsArrowRight />
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )
            })
          ) : (
            <h5 className="m-5">目前並未成立訂單</h5>
          )}
          {/* 頁碼 */}
          <PagesBar data={data} />
        </div>
      </div>
    </>
  )
}
