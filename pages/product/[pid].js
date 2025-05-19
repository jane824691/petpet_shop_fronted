import { useEffect, useState, useRef } from 'react'
import Carousel from './components/carousel'
import { useRouter } from 'next/router'
import { ONE_PRODUCT, COMMENTS_ONE, COMMENTS_ADD } from '@/components/my-const'
import { useCart } from '@../../../components/hooks/use-cart-state'
import toast, { Toaster } from 'react-hot-toast'
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext';
import { CatLoader } from '@/components/hooks/use-loader/components'
import { entries } from 'lodash'

export default function Detail() {
  const { addItem } = useCart()
  const { setAddingProductAmount, addingCartAnimation } = useHeaderAnimation();
  const [productComments, setProductComments] = useState([])
  const [total, setTotal] = useState(1) // 試帶商品QTY傳給Cart
  const [page, setPage] = useState(1)
  const [commentsValue, setCommentsValue] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true) // 如滾軸到底頁數, 不再重複呼叫api
  const [isOverWordsAmounts, setIsOverWordsAmounts] = useState(false)
  const [hasBadWords, setHasBadWords] = useState(false)


  const [myProduct, setMyProduct] = useState({
    pid: '',
    img: '',
    name: '',
    price: '',
    info: '',
  })


  // 跳轉用
  const router = useRouter()

  // 抓單一商品（只抓一次）
  const fetchProduct = async () => {
    const pid = +router.query.pid
    try {
      const response = await fetch(ONE_PRODUCT + `/${pid}`)
      const productData = await response.json()
      setMyProduct(productData)
    } catch (error) {
      console.error('商品資料載入錯誤:', error)
    }
  }

  // 抓留言資料（會無限滾動）
  const fetchComments = async () => {
    const pid = +router.query.pid
    if (!hasMore) return // 如果已經沒有更多資料，就不繼續呼叫

    setIsLoading(true)
    try {
      const response = await fetch(`${COMMENTS_ONE}/${pid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }), // 改變的頁數放BODY
      })
      const data = await response.json()

      // 若回傳筆數小於 pageSize，就表示最後一頁
      if (data.length < 3) {
        setHasMore(false)
      }

      setProductComments((prev) => [...prev, ...data])
    } catch (error) {
      console.error('留言載入錯誤:', error)
    } finally {
      // setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading])

  const lastCommentRef = useRef()

  const observer = useRef()
  useEffect(() => {
    if (isLoading || !hasMore) return
    if (observer.current) observer.current.disconnect() // 如已有過觀察則停止觀察
    // if (entry.isIntersecting) observer.unobserve(entry.target) // 無框架js停止觀察寫法, 不拔刷過但使用者當下已離開之可視範圍外的資訊


    // IntersectionObserver 是 JavaScript（ES6+）的瀏覽器原生 API
    // IntersectionObserver 該物件接受一個 callback 和一個可選的 options：
    // 例如 const observer = new IntersectionObserver(callback, options);
    // 當被觀察的 DOM 元素「出現在畫面中（進入視窗範圍）」時, 就觸發 page+1, 達成無限滾軸
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1)
      }
    })

    // entries[0] = {
    //   time: 3412.4,                // 觸發時的時間戳（毫秒）
    //   target: <div id="target">,   // 被觀察的 DOM 元素
    //   isIntersecting: true,        // 是否真的有進入觀察區域（最常用）
    //   intersectionRatio: 0.8,      // 交集比例（0~1，1=完全重疊）
    //   boundingClientRect: {...},   // 目標元素的邊界（客觀）
    //   intersectionRect: {...},     // 真的出現在畫面裡的那塊區域
    //   rootBounds: {...}            // root（預設是 viewport）的邊界
    // }

    // 教學：https://www.bing.com/videos/riverview/relatedvideo?q=intersectionobserver&mid=63F9AE41BCC1A8B3033863F9AE41BCC1A8B30338&FORM=VAMTRV
    {
      // rootMargin: "100px", // 正數值會超越當下看到的視窗大小, 可以在視窗以外就開始帶出資訊
      // rootMargin: "-50px", // 負數值px則可以壓在視窗內, 為觀察器範圍內
      // threshold: 0, // 0~1,以觀察的div或指定單位的高度開始觀察
      // threshold: 1, // 以觀察1個單位的高度, 完全進入該1個單位高度才動作
    }


    if (lastCommentRef.current) {
      observer.current.observe(lastCommentRef.current)
    }
  }, [isLoading, hasMore])


  //TODO: 是否大於三行評論收合
  // 每個留言自己控制是否展開
  const [expandedIndexes, setExpandedIndexes] = useState({})


  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const badWords = [
    'fuck', 'shit', 'asshole', 'bitch', 'wtf', '操你', '幹你', '垃圾', '智障', '白癡', '王八蛋'
    // 可擴充
  ]

  const containsBadWords = (text) => {
    return badWords.some((word) => text.includes(word))
  }

  const handleCommentChange = (e) => {
    const value = e.target.value
    setCommentsValue(value)
    setHasBadWords(containsBadWords(value.toLowerCase()))
  }

  const sendComments = async () => {
    const pid = +router.query.pid
    const sid = JSON.parse(localStorage.getItem("auther"))?.sid;

    if (commentsValue.length === 0) {
      toast.error('請留下您的評論!')
      return
    }

    if (commentsValue.length > 300) {
      toast.error('評論字數不可超過 300 字')
      setIsOverWordsAmounts(true)
      return
    }

    if (containsBadWords(commentsValue.toLowerCase())) {
      toast.error('評論包含不雅字詞，請重新輸入')
      setHasBadWords(true)
      return
    }

    try {
      const r = await fetch(COMMENTS_ADD, {
        method: 'POST',
        body: JSON.stringify({
          sid: sid,
          pid: pid,
          content: commentsValue,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const responseData = await r.json()
      if (responseData.success) {
        setCommentsValue('')
        toast.success('留言成功!!')

        // 重新載入整個留言清單
        setPage(1)
        setHasMore(true)
        setProductComments([]) // 清空原本的留言列表
        fetchComments(1) // 加上參數，明確要抓第一頁
      } else {
        toast.error('尚未購買此商品，無法評論')
      }
    } catch (error) {
      console.error('sendComments error')
    }
  }

  // 初始進來只抓商品資料
  useEffect(() => {
    if (router.query.pid) {
      fetchProduct()
    }
  }, [router.query.pid])

  // page 改變時才抓更多留言（第一次 page 預設為 1）
  useEffect(() => {
    if (router.query.pid) {
      fetchComments()
    }
  }, [page, router.query.pid])

  return (
    <>
      {/* 商品圖 + 敘述金額 */}
      <div className="row mt-5 mx-5 pt-5 pt-md-0">
        <div className="col-md-7 mx-auto photoWall">
          <div className="position-sticky">
            <Carousel
              pid={myProduct.pid}
              firstImage={myProduct.product_img}
              mainImage={myProduct.photo_content_main}
              secondaryImage={myProduct.photo_content_secondary}
              additionalImage={myProduct.photo_content}
            />
          </div>
        </div>

        <div className="col-md-5 ps-4 pt-5 pt-md-0 descriptionPart">
          <h4 id="name" name="name">
            {myProduct.product_name}
          </h4>

          <p className="product-desc">{myProduct.product_description}</p>

          <div class="text-center">
            <div class="row align-items-start d-flex amount-btn-group-wide align-items-center justify-content-center">
              <h5 className="text-danger col">
                <span>NT$ </span>
                {myProduct.product_price}
              </h5>
              <div className="col w-100 pe-3">
                <div className="d-flex amount-btn-group-wide align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary amount-btnL"
                    onClick={() => {
                      if (total > 1) {
                        setTotal(total - 1)
                      }
                    }}
                  >
                    -
                  </button>
                  <div className="form-control rounded-2 text-center amount-form">
                    {total}
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary amount-btnR"
                    onClick={() => {
                      setTotal(total + 1)
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="d-flex gap-4 flex-sm-row flex-column">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                addItem({
                  pid: myProduct.pid,
                  name: myProduct.product_name,
                  quantity: total,
                  price: myProduct.product_price,
                  img: myProduct.product_img,
                })
                setAddingProductAmount(total)
                addingCartAnimation(true)
                toast.success('成功加入購物車!')
              }}
            >
              <div className="d-flex justify-content-center m-1 fs-6 ">
                <i className="bi bi-cart mx-2"></i> <div> 加入購物車</div>
              </div>
            </button>
            <button
              className="btn btn-danger text-white w-100 fs-6"
              onClick={() => {
                addItem({
                  pid: myProduct.pid,
                  name: myProduct.product_name,
                  quantity: total,
                  price: myProduct.product_price,
                  img: myProduct.product_img,
                })
                setAddingProductAmount(total)
                addingCartAnimation(true)
                router.push('../cart/OrderSteps')
              }}
            >
              加入並前往結帳
            </button>
          </div>
          <Toaster />
          <div className="product-info my-5">
            <div
              className="accordion accordion-flush"
              id="accordionFlushExample"
            >
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    免費寄送及退貨
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body px-1">
                    <p>訂單金額滿新臺幣 4,500 元即享免費標準運送服務</p>
                    <p>
                      臺北市: 標準運送的商品可於 2-5 個工作天送達
                      快遞運送的商品可於 2-3 個工作天送達
                    </p>
                    <p>
                      其它縣市: 標準運送的商品可於 3-6 個工作天送達
                      快遞運送的商品可於 3-5 個工作天送達
                    </p>
                    <p>訂單皆於星期一至星期五之間處理與寄送 (國定假日除外)</p>
                    <p>會員享免費退貨服務免費退貨。退貨政策例外情況。</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 商品留言欄 */}
      <div class="mx-5 ps-0 ps-lg-5 mt-3">
        <div class="row">
          <div class="col-9 position-relative">
            <textarea
              class="form-control pe-5"
              placeholder="購買過該商品者，歡迎留下評論（最長 300 字）"
              rows="3"
              maxLength={300}
              value={commentsValue}
              onChange={handleCommentChange}
            />
            {commentsValue && (
              <button
                className="position-absolute top-50 translate-middle-y end-0 me-2 text-primary btn no-outline"
                onClick={() => setCommentsValue('')}
              >
                Ｘ
              </button>
            )}
          </div>
          <div class="col-3">
            <button class="btn btn-primary w-100 h-100 text-white" onClick={() => { sendComments(commentsValue) }}>
              發表
            </button>
          </div>
        </div>
        {hasBadWords && (
          <div className='text-danger'>請勿出現不雅字眼</div>
        )}
      </div>
      <Toaster />

      {/* 商品評論區 */}
      {productComments.length ? (
        <>
          <div className="mx-5 ps-0 ps-lg-5 mt-5">
            {productComments.map((comment, index) => {
              const isLast = index === productComments.length - 1

              return (
                <div
                  key={index}
                  ref={index === productComments.length - 1 ? lastCommentRef : null}
                  className={`d-flex mb-4 pb-3 align-items-start ${isLast ? '' : 'border-bottom'}`}
                >
                  {/* 頭像 */}
                  <img
                    src={comment?.photo?.trim?.() ? comment.photo : '/pics/headshot.jpg'}
                    alt="avatar"
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />

                  {/* 右邊內容 */}
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{comment.account || '匿名使用者'}</h6>

                    {/* 留言內容 */}
                    <p
                      className={`mb-1 ${expandedIndexes[index] ? '' : 'text-truncate-3'}`}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {comment.content || '無評論內容'}
                    </p>

                    {/* 留言時間 */}
                    <div>
                      <small className="text-muted">
                        {new Date(comment.created_date).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          { isLoading ? (
          <div className="d-flex justify-content-center align-items-center w-100 mb-5">
            <CatLoader />
          </div>
          ) : ''}
        </>
      ) : (
        <div className="mx-5 ps-0 ps-lg-5"><div className="d-flex mb-4 py-4 border-top align-items-start">尚無人給予評論</div></div>
      )}

    </>
  )
}
