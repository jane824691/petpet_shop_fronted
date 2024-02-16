import React from "react";
import Link from "next/link";


export default function ConfirmIndex() {
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center ">
          <img
            src="/images/product/steps_to_complete.png"
            alt="steps_to_complete"
          />
        </div>
        <div className="list-form needs-validation" noValidate="">
          <div className="d-flex justify-content-center">
            <div className="direction-column">
              <div
                className="card border-primary mb-3"
                style={{ width: '40rem' }}
              >
                <div className="card-header card-big-title border border-0" style={{ backgroundColor: 'transparent '}}>購物明細</div>
                <div className="card-body">
                  <div className="row extinct-product">
                    <div className="col-3">
                      <img
                        src="/images/product/638348807730300000 (1).jfif"
                        alt="name of product"
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-6">
                      tails&amp;me 尾巴與我 經典尼龍帶系列 單色項圈
                      <div>
                        <span>數量：</span>
                        <span>2</span>
                      </div>
                    </div>
                    <div className="col-3 text-end">
                      <div className="dollar">
                        <span>NT$</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                  <div className="row extinct-product">
                    <div className="col-3">
                      <img
                        src="/images/product/638348807730300000 (1).jfif"
                        alt="name of product"
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-6">
                      tails&amp;me 尾巴與我 經典尼龍帶系列 單色項圈
                      <div>
                        <span>數量：</span>
                        <span className="flex-grow-1 ms-1">2</span>
                      </div>
                    </div>
                    <div className="col-3 text-end">
                      <div className="dollar">
                        <span>NT$</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                  <div className="row extinct-product">
                    <div className="col-3">
                      <img
                        src="/images/product/638348807730300000 (1).jfif"
                        alt="name of product"
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-6">
                      tails&amp;me 尾巴與我 經典尼龍帶系列 單色項圈
                      <div>
                        <span>數量：</span>
                        <span>2</span>
                      </div>
                    </div>
                    <div className="col-3 text-end">
                      <div className="dollar">
                        <span>NT$</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                  <div className="row card-padding12">
                    <div className="col-9 dollar">本訂單須付款金額</div>
                    <div className="col-3 text-end">
                      <div className="dollar">
                        <span>NT$</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="card border-primary mb-3"
                style={{ width: '40rem' }}
              >
                <div className="card-header card-big-title border border-0" style={{ backgroundColor: 'transparent '}}>訂購人資訊</div>
                <div className="card-body">
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    姓名：
                  </label>
                  <span>王小明</span>
                  <br />
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    電話：
                  </label>
                  <span>0912345678</span>
                  <br />
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    Email：
                  </label>
                  <span>ispan@ispan.com</span>
                </div>
                <div className="card-header card-big-title border border-0" style={{ backgroundColor: 'transparent '}}>取貨資訊</div>
                <div className="card-body">
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    取貨方式：
                  </label>
                  <span>宅配</span>

                  <br />
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    收件地址：
                  </label>
                  <span>台北市大安區106復興南路一段390號2樓</span>
                </div>
                <div className="card-header card-big-title border border-0" style={{ backgroundColor: 'transparent '}}>付款資訊</div>
                <div className="card-body">
                  <label
                    htmlFor="validationCustom01"
                    className="form-label font-grey-title"
                  >
                    付款方式：
                  </label>
                  <span>信用卡</span>
                </div>
              </div>
              <div className="container text-center mt-5">
                <div className="row">

                  <div className="col d-grid">
                  <Link
                      className="nav-link  btn btn-outline-light"
                      href="/cart/payment"
                      role="button">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-lg btn:active"
                        style={{width: '300px'}}>
                        回前一頁
                      </button>
                    </Link>
                  </div>
                  <div className="col d-grid">
                    <Link
                      className="nav-link  btn btn-outline-light"
                      href="#"
                      role="button">
                      <button
                        type="button"
                        className="btn btn-primary text-white btn-lg btn:active"
                        style={{width: '300px'}}>
                        送出訂單
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
