import { useEffect, useState } from 'react'
import { countries, townships, postcodes } from './data-townships'

export default function TWZipCode({
  initPostcode = '',
  initCountry = '',
  initTownship = '',
  onPostcodeChange = (country, township, postcode) => {}
}) {
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)
  const [postcode, setPostcode] = useState('')

  // 處理初始國家選擇
  useEffect(() => {
    if (initCountry && countryIndex === -1) {
      const index = countries.indexOf(initCountry)
      if (index !== -1) {
        setCountryIndex(index)
      }
    }
  }, [initCountry, countries, countryIndex])

  // 處理鄉鎮市區選擇，依賴 countryIndex
  useEffect(() => {
    if (initTownship && countryIndex !== -1 && townships[countryIndex]) {
      const townshipIdx = townships[countryIndex].indexOf(initTownship)
      if (townshipIdx !== -1) {
        setTownshipIndex(townshipIdx)
      }
    }
  }, [initTownship, countryIndex, townships])

  // 當使用者改變 countryIndex 和 townshipIndex 時，更新郵遞區號
  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex])
    }
  }, [countryIndex, townshipIndex])

  // 當使用者修改資料時，將變更的值傳回父元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      )
    }
  }, [postcode, countryIndex, townshipIndex])
  return (
    <>
      <div className="row">
        <div className="col-4">
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

        <div className="col-4">
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
        <div className="col-4">
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
