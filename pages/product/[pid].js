import { useEffect, useState } from 'react'
import Carousel from './components/carousel'
import { useRouter } from 'next/router'
import { ONE_PRODUCT, COMMENTS_ONE, COMMENTS_ADD } from '@/components/my-const'
import { useCart } from '@../../../components/hooks/use-cart-state'
import toast, { Toaster } from 'react-hot-toast'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext';

export default function Detail() {
  const { addItem } = useCart()
  const { setAddingProductAmount, addingCartAnimation } = useHeaderAnimation();
  const [productComments, setProductComments] = useState([])
  const [total, setTotal] = useState(1) // 試帶商品QTY傳給Cart
  const [page, setPage] = useState(1)
  const [commentsValue, setCommentsValue] = useState('');

  const [myProduct, setMyProduct] = useState({
    pid: '',
    img: '',
    name: '',
    price: '',
    info: '',
  })


  //跳轉用
  const router = useRouter()

  const fetchData = async () => {
    const pid = +router.query.pid

    try {
      const response = await fetch(ONE_PRODUCT + `/${pid}`) // 這種預設都是GET
      const productData = await response.json()
      setMyProduct(productData)

      const responseComments = await fetch(COMMENTS_ONE + `/${pid}&page=${page}`, {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
      const productCommentsData = await responseComments.json()
      setProductComments((prev) => [...prev, ...productCommentsData])


    } catch (error) {
      // console.error('Error fetching product data:', error)
    }
  }

  const sendComments = async () => {
    const pid = +router.query.pid
    const sid = JSON.parse(localStorage.getItem("auther"))?.sid;
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
      } else {
        toast.error('尚未購買此商品，無法評論')
      }
    } catch (error) {

    }
  }

  // 去抓後端處理好的單筆資料
  useEffect(() => {
    // 呼叫 fetchData 以觸發資料載入
    if (router.query.pid) {
      fetchData()
    }
  }, [router.query.pid])

  useEffect(() => {
    console.log('評論', productComments);

  }, [productComments])

  return (
    <>
      {/* 商品圖 + 敘述金額 */}
      <div className="row mt-5 mx-5">
        <div className="col-sm-7">
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

        <div className="col-sm-5 ps-4 descriptionPart">
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>商品詳細</Breadcrumb.Item>
          </Breadcrumb>

          <h4 id="name" name="name">
            {myProduct.product_name}
          </h4>

          <p className="product-desc">{myProduct.product_description}</p>

          <div class="container text-center">
            <div class="row align-items-start d-flex amount-btn-group-wide align-items-center justify-content-center">
              <h5 className="text-danger col ">
                <span>NT$ </span>
                {myProduct.product_price}
              </h5>
              <div className="col w-100" style={{ padding: '0' }}>
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


          <div className="d-flex gap-4">
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
              <div className="d-flex justify-content-center m-1 fs-6">
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
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    免費寄送及退貨
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body px-1">
                    <p>訂單金額滿新臺幣 4,500 元即享免費標準運送服務</p>
                    <p>
                      臺北市:標準運送的商品可於 2-5 個工作天內送達
                      快遞運送的商品可於 2-3 個工作天內送達
                    </p>
                    <p>
                      其它縣市: 標準運送的商品可於 3-6 個工作天內送達
                      快遞運送的商品可於 3-5 個工作天內送達
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

      {/* 商品評論 */}
      <div class="container mx-auto">
        <div class="row">
          <div class="col-9 position-relative">
            <input
              type="text"
              class="form-control pe-5"
              placeholder="留下評論..."
              value={commentsValue}
              onChange={(e) => setCommentsValue(e.target.value)}
            />
            {commentsValue && (
              <span
                className="position-absolute top-50 translate-middle-y end-0 me-4 text-primary"
                style={{ cursor: 'pointer' }}
                onClick={() => setCommentsValue('')}
              >
                X
              </span>
            )}
          </div>
          <div class="col-3">
            <button class="btn btn-primary w-100" onClick={() => { sendComments(commentsValue) }}>
              發表
            </button>
          </div>
        </div>
      </div>
      <Toaster />

      {productComments.length ? (<>
        <div className="container mx-auto">
          {productComments.map((comment, index) => (
            <div
              key={index}
              // ref={index === productComments.length - 1 ? lastCommentRef : null}
              className="d-flex mb-4 pb-3 border-bottom align-items-start"
            >
              {/* 頭像 */}
              <img
                src={comment.photo || '/public/pics/headshot.jpg'}
                alt="avatar"
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />

              {/* 右邊內容 */}
              <div className="flex-grow-1">
                <h6 className="mb-1">{comment.account || '匿名使用者'}</h6>

                {/* 留言內容 */}
                <p
                  // className={`mb-1 ${expandedIndexes[index] ? '' : 'text-truncate-3'}`}
                  className="text-truncate-3"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {comment.content || '無評論內容'}
                </p>

                {/* 展開/收合按鈕 */}
                {comment.content && comment.content.split('\n').length > 3 && (
                  <button
                    className="btn btn-link btn-sm p-0"
                    onClick={() => toggleExpand(index)}
                  >
                    {expandedIndexes[index] ? '收起' : '更多'}
                  </button>
                )}

                {/* 留言時間 */}
                <div>
                  <small className="text-muted">
                    {new Date(comment.created_date).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* {loading && <p className="text-center">載入中...</p>} */}
      </>) : (<>
        <div className="container mx-auto"><div className="d-flex mb-4 py-4 border-top align-items-start">尚無人給予評論</div></div>
      </>)}

    </>
  )
}
