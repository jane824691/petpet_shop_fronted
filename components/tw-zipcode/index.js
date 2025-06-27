import { useEffect, useState } from 'react'
import { countries, townships, postcodes } from './data-townships'

export default function TWZipCode({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) {

  // 記錄陣列的索引值，預設值是-1，相當於"請選擇xxx"
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)

  // 郵遞區號使用字串(數字字串)
  const [postcode, setPostcode] = useState('')

  // 利用傳入時的initPostcode初始化用
  useEffect(() => {
    if (initPostcode) {
      setPostcode(initPostcode)
      // 使用initPostcode尋找對應的countryIndex, townshipIndex
      for (let i = 0; i < postcodes.length; i++) {
        for (let j = 0; j < postcodes[i].length; j++) {
          if (postcodes[i][j] === initPostcode) {
            setCountryIndex(i)
            setTownshipIndex(j)
            return // 跳出巢狀for迴圈
          }
        }
      }
    }
  }, [initPostcode])

  // 當countryIndex, townshipIndex均有值時，設定postcode值
  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex])
    }
  }, [countryIndex, townshipIndex])

  // 當使用者改變的countryIndex, townshipIndex，使用onPostcodeChange回傳至父母元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      )
    }
  }, [postcode])

  return (
    <>
      <div className="row">
        <div className="col-12 col-sm-4 pb-3">
          <div>
            縣市<span className="text-danger">*</span>
          </div>
          <select
            className="w-100"
            value={countryIndex}
            onChange={(e) => {
              // 將字串轉成數字
              setCountryIndex(+e.target.value)
              // 重置townshipIndex的值
              setTownshipIndex(-1)
              // 重置postcode的值
              setPostcode('')
            }}
          >
            <option value="-1">選擇縣市</option>
            {countries.map((value, index) => (
              <option key={index} value={index}>
                {value}
              </option>
            ))}
          </select>{' '}
        </div>

        <div className="col-12 col-sm-4 pb-3">
          <div>
            鄉鎮縣市<span className="text-danger">*</span>
          </div>
          <select
            className="w-100"
            value={townshipIndex}
            onChange={(e) => {
              // 將字串轉成數字
              setTownshipIndex(+e.target.value)
            }}
          >
            <option value="-1">選擇區域</option>
            {countryIndex > -1 &&
              townships[countryIndex].map((value, index) => (
                <option key={index} value={index}>
                  {value}
                </option>
              ))}
          </select>
        </div>
        <div className="col-12 col-sm-4 pb-3">
          <div>
            郵遞區號<span className="text-danger">*</span>
          </div>
          <input
            value={postcode ? postcode : '郵遞區號'}
            className="rounded-5 p-2 w-100"
            style={{ color: postcode ? 'black' : 'gray' }}
          />
        </div>
      </div>
    </>
  )
}
