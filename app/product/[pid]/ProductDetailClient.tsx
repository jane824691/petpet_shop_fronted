'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import toast, { Toaster } from 'react-hot-toast'
import { useIntl } from 'react-intl'
import { useCart } from '@/components/hooks/use-cart-state'
import { useLanguage } from '@/components/contexts/LanguageContext'
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext'
import { COMMENTS_ADD, COMMENTS_ONE } from '@/components/my-const'
import Carousel from '@/components/product/carousel'
import type { ProductImage } from '@/components/product/carousel'
import SecurityUtils from '@/utils/inputCheck'

const CatLoader = dynamic(
  () =>
    import('@/components/hooks/use-loader/components').then(
      (mod) => mod.CatLoader
    ),
  { ssr: false }
)

export interface ProductData {
  pid: number
  categoryId: number
  nameZh: string
  nameEn: string
  stock: number
  salesCondition: string
  price: number
  descriptionZh: string
  descriptionEn: string
  productImg: string
  editTime: string
  images: ProductImage[]
}

interface ProductComment {
  photo?: string
  account?: string
  content?: string
  created_date?: string
}

interface ProductDetailClientProps {
  pid: number
  initialProduct: ProductData
}

export default function ProductDetailClient({
  pid,
  initialProduct,
}: ProductDetailClientProps) {
  const router = useRouter()
  const intl = useIntl()
  const { locale } = useLanguage()
  const { addItem } = useCart()
  const { setAddingProductAmount, addingCartAnimation } = useHeaderAnimation()

  const [myProduct] = useState<ProductData>(initialProduct)
  const [productComments, setProductComments] = useState<ProductComment[]>([])
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [commentsValue, setCommentsValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [hasBadWords, setHasBadWords] = useState(false)

  const badWords = [
    'fuck',
    'shit',
    'asshole',
    'bitch',
    'wtf',
    '幹',
    '靠北',
    '媽的',
    '白癡',
    '智障',
    '垃圾',
  ]

  const containsBadWords = (text: string) => {
    return badWords.some((word) => text.includes(word))
  }

  const fetchComments = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(`${COMMENTS_ONE}/${pid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      })

      const data = (await response.json()) as ProductComment[]
      if (data.length < 3) setHasMore(false)
      setProductComments((prev) => [...prev, ...data])
    } catch (error) {
      console.error('Fetch comments failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const lastCommentRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (isLoading || !hasMore) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1)
      }
    })

    if (lastCommentRef.current) {
      observer.current.observe(lastCommentRef.current)
    }
  }, [isLoading, hasMore])

  
    // const observer = useRef()
    // useEffect(() => {
    //   if (isLoading || !hasMore) return
    //   if (observer.current) observer.current.disconnect() // 如已有過觀察則停止觀察
      // if (entry.isIntersecting) observer.unobserve(entry.target) // 無框架js停止觀察寫法, 不拔刷過但使用者當下已離開之可視範圍外的資訊
  
  
      // IntersectionObserver 是 JavaScript（ES6+）的瀏覽器原生 API
      // IntersectionObserver 該物件接受一個 callback 和一個可選的 options：
      // 例如 const observer = new IntersectionObserver(callback, options);
      // 當被觀察的 DOM 元素「出現在畫面中（進入視窗範圍）」時, 就觸發 page+1, 達成無限滾軸
      // observer.current = new IntersectionObserver((entries) => {
    //     if (entries[0].isIntersecting) {
    //       setPage((prevPage) => prevPage + 1)
    //     }
    //   })
  
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
    //   {
        // rootMargin: "100px", // 正數值會超越當下看到的視窗大小, 可以在視窗以外就開始帶出資訊
        // rootMargin: "-50px", // 負數值px則可以壓在視窗內, 為觀察器範圍內
        // threshold: 0, // 0~1,以觀察的div或指定單位的高度開始觀察
        // threshold: 1, // 以觀察1個單位的高度, 完全進入該1個單位高度才動作
    //   }
  
  
    //   if (lastCommentRef.current) {
    //     observer.current.observe(lastCommentRef.current)
    //   }
    // }, [isLoading, hasMore])


  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pid, intl.locale])

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const securityCheck = SecurityUtils.securityCheck(value)

    if (!securityCheck.isValid && securityCheck.errors.invalidInput) {
      toast.error(intl.formatMessage({ id: 'product.commentSecurityError' }))
      return
    }

    setCommentsValue(value)
    setHasBadWords(containsBadWords(value.toLowerCase()))
  }

  const sendComments = async () => {
    const sid = JSON.parse(localStorage.getItem('auther') || '{}')?.sid
    const securityCheck = SecurityUtils.securityCheck(commentsValue)

    // 先各種格式檢查，才能送出建立留言
    if (!securityCheck.isValid) {
      if (securityCheck.errors.invalidInput) {
        toast.error(intl.formatMessage({ id: 'product.commentSecurityError' }))
        return
      }
      if (securityCheck.sanitized.length === 0) {
        toast.error(intl.formatMessage({ id: 'product.commentInvalidContent' }))
        return
      }
      if (securityCheck.errors.invalidLength) {
        toast.error(intl.formatMessage({ id: 'product.commentTooLong' }))
        return
      }
      if (securityCheck.errors.invalidContent) {
        toast.error(intl.formatMessage({ id: 'product.commentInvalidContent' }))
        return
      }
    }

    if (commentsValue.length === 0) {
      toast.error(intl.formatMessage({ id: 'product.commentRequired' }))
      return
    }

    if (containsBadWords(commentsValue.toLowerCase())) {
      toast.error(intl.formatMessage({ id: 'product.commentHasBadWords' }))
      setHasBadWords(true)
      return
    }

    try {
      const r = await fetch(COMMENTS_ADD, {
        method: 'POST',
        body: JSON.stringify({
          sid,
          pid,
          content: securityCheck.sanitized,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const responseData = await r.json()
      if (responseData.success) {
        setCommentsValue('')
        toast.success(intl.formatMessage({ id: 'product.commentSuccess' }))
        setPage(1)
        setHasMore(true)
        setProductComments([])
      } else {
        toast.error(intl.formatMessage({ id: 'product.commentNotPurchased' }))
      }
    } catch (error) {
      console.error('sendComments error:', error)
    }
  }

  return (
    <>
      <div className="row mt-5 mx-3 pt-5 pt-md-0">
        <div className="col-md-7 mx-auto photoWall">
          <div className="position-sticky">
            <Carousel
              pid={myProduct.pid}
              firstImage={myProduct.productImg}
              images={myProduct.images}
            />
          </div>
        </div>

        <div className="col-md-5 ps-4 pt-5 pt-md-0 descriptionPart">
          <h4 id="name">
            {locale === 'zh-TW' ? myProduct.nameZh : myProduct.nameEn}
          </h4>

          <p className="product-desc">
            {locale === 'zh-TW'
              ? myProduct.descriptionZh
              : myProduct.descriptionEn}
          </p>

          <div className="text-center">
            <div className="row align-items-start d-flex amount-btn-group-wide align-items-center justify-content-center">
              <h5 className="text-danger col">
                <span>NT$ </span>
                {myProduct.price}
              </h5>
              <div className="col w-100 pe-3">
                <div className="d-flex amount-btn-group-wide align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary amount-btnL"
                    onClick={() => {
                      if (total > 1) setTotal(total - 1)
                    }}
                  >
                    -
                  </button>
                  <div className="form-control rounded-2 text-center amount-form pt-2">
                    {total}
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary amount-btnR"
                    onClick={() => setTotal(total + 1)}
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
                const sid = JSON.parse(localStorage.getItem('auther') || '{}')
                  ?.sid
                if (!sid) {
                  toast.error(intl.formatMessage({ id: 'product.loginForAddCart' }))
                  return
                }
                addItem({
                  pid: String(myProduct.pid),
                  name: myProduct.nameZh,
                  name_en: myProduct.nameEn,
                  quantity: total,
                  price: myProduct.price,
                  img: myProduct.productImg,
                })
                setAddingProductAmount(total)
                addingCartAnimation(true)
                toast.success(intl.formatMessage({ id: 'product.addToCartSuccess' }))
              }}
            >
              <div className="d-flex justify-content-center m-1 fs-6 ">
                <i className="bi bi-cart mx-2"></i>{' '}
                <div>{intl.formatMessage({ id: 'product.addToCart' })}</div>
              </div>
            </button>
            <button
              className="btn btn-danger text-white w-100 fs-6"
              onClick={() => {
                const sid = JSON.parse(localStorage.getItem('auther') || '{}')
                  ?.sid
                if (!sid) {
                  toast.error(intl.formatMessage({ id: 'product.loginForAddCart' }))
                  return
                }
                addItem({
                  pid: String(myProduct.pid),
                  name: myProduct.nameZh,
                  name_en: myProduct.nameEn,
                  quantity: total,
                  price: myProduct.price,
                  img: myProduct.productImg,
                })
                setAddingProductAmount(total)
                addingCartAnimation(true)
                router.push('/cart/OrderSteps')
              }}
            >
              {intl.formatMessage({ id: 'product.addAndCheckout' })}
            </button>
          </div>
          <Toaster />
          <div className="product-info my-5">
            <div className="accordion accordion-flush" id="accordionFlushExample">
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
                    {intl.formatMessage({ id: 'product.freeShippingTitle' })}
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body px-1">
                    <p>{intl.formatMessage({ id: 'product.freeShipping1' })}</p>
                    <p>{intl.formatMessage({ id: 'product.freeShipping2' })}</p>
                    <p>{intl.formatMessage({ id: 'product.freeShipping3' })}</p>
                    <p>{intl.formatMessage({ id: 'product.freeShipping4' })}</p>
                    <p>{intl.formatMessage({ id: 'product.freeShipping5' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 ps-0 ps-lg-5 mt-3">
        <div className="row">
          <div className="col-9 position-relative">
            <textarea
              className="form-control pe-5"
              placeholder={intl.formatMessage({ id: 'product.commentPlaceholder' })}
              rows={3}
              maxLength={300}
              value={commentsValue}
              onChange={handleCommentChange}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text')
                const securityCheck = SecurityUtils.securityCheck(pastedText)
                if (!securityCheck.isValid && securityCheck.errors.invalidInput) {
                  e.preventDefault()
                  toast.error(
                    intl.formatMessage({ id: 'product.commentSecurityError' })
                  )
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                toast.error(intl.formatMessage({ id: 'product.commentSecurityError' }))
              }}
              spellCheck="false"
              autoComplete="off"
            />
            {commentsValue && (
              <button
                className="position-absolute top-50 translate-middle-y end-0 me-2 text-primary btn no-outline"
                onClick={() => setCommentsValue('')}
              >
                ×
              </button>
            )}
          </div>
          <div className="col-3">
            <button
              className="btn btn-primary w-100 h-100 text-white"
              onClick={sendComments}
            >
              {intl.formatMessage({ id: 'product.commentSend' })}
            </button>
          </div>
        </div>
        {hasBadWords && (
          <div className="text-danger">
            {intl.formatMessage({ id: 'product.commentHasBadWords' })}
          </div>
        )}
      </div>
      <Toaster />

      {productComments.length ? (
        <>
          <div className="mx-5 ps-0 ps-lg-5 mt-5">
            {productComments.map((comment, index) => {
              const isLast = index === productComments.length - 1

              return (
                <div
                  key={`${comment.created_date || 'comment'}-${index}`}
                  ref={isLast ? lastCommentRef : null}
                  className={`d-flex mb-4 pb-3 align-items-start ${
                    isLast ? '' : 'border-bottom'
                  }`}
                >
                  <img
                    src={comment?.photo?.trim?.() ? comment.photo : '/pics/headshot.jpg'}
                    alt="avatar"
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {comment.account ||
                        intl.formatMessage({ id: 'product.commentAnonymous' })}
                    </h6>

                    <p className="mb-1 text-truncate-3" style={{ whiteSpace: 'pre-wrap' }}>
                      {SecurityUtils.sanitizeHTML(comment.content || '') ||
                        intl.formatMessage({ id: 'product.commentNoContent' })}
                    </p>

                    <div>
                      <small className="text-muted">
                        {comment.created_date
                          ? new Date(comment.created_date).toLocaleString()
                          : ''}
                      </small>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {isLoading && (
            <div
              className="d-flex justify-content-center align-items-center w-100 mb-5"
              style={{ minHeight: '100px' }}
            >
              <CatLoader />
            </div>
          )}
        </>
      ) : (
        <div className="mx-5 ps-0 ps-lg-5">
          <div className="d-flex mb-4 py-4 border-top align-items-start">
            {intl.formatMessage({ id: 'product.commentNoComment' })}
          </div>
        </div>
      )}
    </>
  )
}
