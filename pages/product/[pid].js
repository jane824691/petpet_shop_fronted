import { useEffect, useState } from 'react'
import Carousel from './components/carousel'
import { useRouter } from 'next/router'
import { ONE_PRODUCT, COMMENTS_ONE } from '@/components/my-const'
import { useCart } from '@../../../components/hooks/use-cart-state'
import toast, { Toaster } from 'react-hot-toast'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext';
import dayjs from 'dayjs'

export default function Detail() {
  const { addItem } = useCart()
  const { setAddingProductAmount, addingCartAnimation } = useHeaderAnimation();
  const [productComments, setProductComments] = useState([])  
  const [total, setTotal] = useState(1) // 試帶商品QTY傳給Cart

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

      const responseComments = await fetch(COMMENTS_ONE + `/${pid}`, {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
      const productCommentsData = await responseComments.json()
      setProductComments(productCommentsData)


    } catch (error) {
      // console.error('Error fetching product data:', error)
    }
  }

  // 去抓後端處理好的單筆資料
  useEffect(() => {
    // 呼叫 fetchData 以觸發資料載入
    fetchData()
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
    </>
  )
}
