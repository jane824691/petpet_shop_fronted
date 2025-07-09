import { useState, useEffect } from 'react'
import { useCart } from '@/components/hooks/use-cart-state'
import ReverseLookup from './Zipcode_to_city'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/contexts/LanguageContext'
import productData from '@/data/Product.js'

export default function OrderDetail({
  paymentData,
  netTotal,
  setNetTotal,
  setConfirmedProductsInfo,
}) {
  const intl = useIntl()
  const { locale } = useLanguage()
  // 使用hooks 解出所需的狀態與函式(自context)
  const { cart, items } = useCart()

  // 確認出正確後端可接收到的格式才考慮怎麼包陣列還物件, 帶出商品資訊
  useEffect(() => {
    if (items.length > 0) {
      const confirmedProductsInfo = {
        pid: items.map((item) => item.pid),
        sale_price: items.map((item) => item.price),
        actual_amount: items.map((item) => item.quantity),
      }

      setConfirmedProductsInfo(confirmedProductsInfo)
    }
  }, [items])

  useEffect(() => {
    // 一開始沒套用折價券，netTotal和cart.totalPrice一樣
    if (!paymentData.discount_coins) {
      setNetTotal(cart.totalPrice)
      return
    }

    const newNetTotal = cart.totalPrice - paymentData.discount_coins
    // : Math.round(cart.totalPrice * (1 - coupon.value)) //如果有80%折價券可這樣寫

    setNetTotal(newNetTotal)
  }, [cart.totalPrice])

  // 修正 Next hydration 問題
  // https://stackoverflow.com/questions/72673362/error-text-content-does-not-match-server-rendered-html
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return null
  }

  // 修正 end

  const onSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <>
      <h3 className="mx-5 py-3 pt-5">{intl.formatMessage({ id: 'cart.orderDetails' })}</h3>
      <div className="d-flex justify-content-center mx-auto px-3 px-sm-5" style={{ maxWidth: '600px' }}>
        <img
          src="/images/product/steps_to_complete.png"
          alt="steps_to_complete"
          className="w-100 h-auto"
        />
      </div>
      <form className="list-form mx-4" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div
              className="card border-primary mb-3"
              style={{ maxWidth: '40rem' }}
            >
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.orderDetails' })}
              </div>
              <div className="card-body mx-3">
                {items.map((v, i) => {
                  return (
                    <div className="row extinct-product" key={v.pid}>
                      <div className="col-3">
                        <img
                          src={`../../../image/product/${v.img}`}
                          alt="name of product"
                          className="img-thumbnail"
                        />
                      </div>
                      <div className="col-6">
                        {locale === 'zh-TW' ? (v.name || '') : (v.name_en || v.name || '')}
                        <div>
                          <span>{intl.formatMessage({ id: 'product.quantity' })}：</span>
                          <span>{v.quantity}</span>
                        </div>
                      </div>
                      <div className="col-3 text-end">
                        <div className="dollar">
                          <span>NT$ </span>
                          <span>{v.subtotal}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="row card-padding12">
                  <div className="col-9">{intl.formatMessage({ id: 'cart.shipping' })}</div>
                  <div className="col-3 text-end">
                    <div>
                      <span>NT$ </span>
                      <span>30</span>
                    </div>
                  </div>
                </div>
                <div className="row card-padding12">
                  <div className="col-9">{intl.formatMessage({ id: 'cart.discount' })}</div>
                  <div className="col-3 text-end">
                    <div>
                      <span>{paymentData.discount_coins ? ' - ' : ''}NT$ </span>
                      <span>{paymentData?.discount_coins || 0}</span>
                    </div>
                  </div>
                </div>
                <br/>
                <div className="row card-padding12 mb-3">
                  <div className="col-9 dollar">{intl.formatMessage({ id: 'cart.orderPaymentAmount' })}</div>
                  <div className="col-3 text-end">
                    <div className="dollar">
                      <span>NT$ </span>
                      <span>{netTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card border-primary mb-3"
              style={{ maxWidth: '40rem' }}
            >
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.pickupPersonInfo' })}
              </div>
              <div className="card-body mx-3">
                <label
                  htmlFor="validationCustom01"
                  className="form-label font-grey-title"
                >
                  {intl.formatMessage({ id: 'member.firstName' })}：
                </label>
                <span>{paymentData.name}</span>
                <br />
                <label
                  htmlFor="validationCustom01"
                  className="form-label font-grey-title"
                >
                  {intl.formatMessage({ id: 'common.tel' })}：
                </label>
                <span>{paymentData.phone}</span>
                <br />
                <label
                  htmlFor="validationCustom01"
                  className="form-label font-grey-title"
                >
                  Email：
                </label>
                <span>{paymentData.email}</span>
              </div>
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.pickupInfo' })}
              </div>
              <div className="card-body mx-3 mb-3">
                <label
                  htmlFor="validationCustom01"
                  className="form-label font-grey-title"
                >
                  {intl.formatMessage({ id: 'cart.pickupAddress' })}：
                </label>
                <span>
                  <ReverseLookup postcode={paymentData.postcode} />
                  {paymentData.postcode}
                  {paymentData.address}
                </span>
              </div>
              <div
                className="card-header card-big-title border border-0"
                style={{ backgroundColor: 'transparent ' }}
              >
                {intl.formatMessage({ id: 'cart.paymentInfo' })}
              </div>
              <div className="card-body mx-3 mb-3">
                <label
                  htmlFor="validationCustom01"
                  className="form-label font-grey-title"
                >
                  {intl.formatMessage({ id: 'cart.paymentMethod' })}：
                </label>
                <span>{paymentData.pay_way}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
