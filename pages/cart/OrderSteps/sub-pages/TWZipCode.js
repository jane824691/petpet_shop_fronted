import { useEffect, useState } from 'react'
import { countries, townships, postcodes } from './data-townships'

export default function TWZipCode({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) {
  //console.log(countries, townships, postcodes)

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
      <div className="d-flex country-list-gap">
        <span>
          <label
            htmlFor="exampleDataList"
            className="form-label font-grey-title"
          >
            縣市<span className="text-danger">*</span>
          </label>
          <select
            className="form-select rounded-5 zip-css "
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
          </select>
        </span>
        <span>
          <label
            htmlFor="exampleDataList"
            className="form-label font-grey-title"
          >
            鄉鎮縣市<span className="text-danger">*</span>
          </label>
          <select
            className="form-select rounded-5 zip-css"
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
        </span>

        <span>
          <label
            htmlFor="exampleDataList"
            className="form-label font-grey-title"
          >
            郵遞區號<span className="text-danger">*</span>
          </label>
          <input
            className="form-control rounded-5"
            type="text"
            placeholder="郵遞區號"
            aria-label="default input example"
            value={postcode}
            id="postcode"
            name="postcode"
            onChange={(e) => {
              setPostcode(e.target.value)
            }}
          />
        </span>
      </div>
    </>
  )
}
