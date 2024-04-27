import React from 'react'

//棄用(換URL)

export default function Profile() {
  return (
    <>
      <h3 className="mx-5 py-5">會員中心</h3>

      <div className="list-form">
        <div className="d-flex justify-content-center">
          <div className="direction-column">
            <div className="card mb-3 border-danger" style={{ width: '40rem' }}>
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
                      aria-label="default input example"
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
                      placeholder="請填日期"
                      aria-label="default input example"
                    />
                  </div>
                </div>

                <h6 className="card-title font-grey-title mt-3">郵箱</h6>
                <input
                  type="email"
                  className="form-control rounded-5 border border-primary"
                  id="exampleFormControlInput1"
                  placeholder="請填 Email"
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
            <div className="card border-danger mb-3" style={{ width: '40rem' }}>
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
                    />
                  </div>
                </div>
                <h6 className="card-title font-grey-title mt-3">郵遞區號</h6>
                <input
                  className="form-control T-18 rounded-5 border border-primary"
                  type="text"
                  placeholder="Zip Code"
                  aria-label="default input example"
                />

                <h6 className="card-title font-grey-title mt-3">收件地址*</h6>
                <input
                  type="email"
                  className="form-control rounded-5 border border-primary"
                  id="exampleFormControlInput1"
                  placeholder="詳細地址"
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
              >
                儲存變更
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
