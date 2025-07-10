// TWZipCode 元件：台灣縣市/區域/郵遞區號三聯選單，支援中英文國際化
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/contexts/LanguageContext'
import cityCountyData from '@/data/CityCountyData.json'

export default function TWZipCode({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) {
  // countryIndex: 當前選擇的縣市索引，-1 代表未選擇
  // townshipIndex: 當前選擇的區域索引，-1 代表未選擇
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)

  // postcode: 當前選擇的郵遞區號（字串）
  const [postcode, setPostcode] = useState('')

  // 取得當前語言（zh-TW 或 en-US）
  const intl = useIntl()
  const { locale } = useLanguage()
  const langKey = locale === 'zh-TW' ? 'zh' : 'en'

  // cityList: 所有縣市資料（來自 CityCountyData.json）
  const cityList = cityCountyData
  // selectedCityObj: 目前選擇的縣市物件
  const selectedCityObj = countryIndex > -1 ? cityList[countryIndex] : null
  // areaList: 目前縣市下所有區域資料
  const areaList = selectedCityObj ? selectedCityObj.AreaList : []

  // 初始化：根據傳入的 initPostcode，自動選好對應的縣市與區域
  useEffect(() => {
    if (initPostcode) {
      setPostcode(initPostcode)
      // 用 cityCountyData 來找對應的 index
      for (let i = 0; i < cityCountyData.length; i++) {
        const areaIdx = cityCountyData[i].AreaList.findIndex(area => area.ZipCode === initPostcode)
        if (areaIdx > -1) {
          setCountryIndex(i)
          setTownshipIndex(areaIdx)
          return
        }
      }
    }
  }, [initPostcode])

  // 當 postcode 變動時，將目前選擇的縣市、區域、郵遞區號回傳給父元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        selectedCityObj ? (langKey === 'zh' ? selectedCityObj.CityName : selectedCityObj.CityEngName) : '',
        selectedCityObj && areaList[townshipIndex]
          ? (langKey === 'zh' ? areaList[townshipIndex].AreaName : areaList[townshipIndex].AreaEngName)
          : '',
        postcode
      )
    }
  }, [postcode, countryIndex, townshipIndex, langKey])

  // --- UI 區塊 ---
  // 1. 縣市下拉選單：切換時會重置區域與郵遞區號
  // 2. 區域下拉選單：切換時自動帶出對應郵遞區號
  // 3. 郵遞區號 input：僅顯示，不可編輯

  return (
    <>
      <div className="row">
        <div className="col-12 col-sm-4 pb-3">
          <div className='pb-2'>
            {intl.formatMessage({ id: 'zipcode.city', defaultMessage: '縣市' })}<span className="text-danger">*</span>
          </div>
          <select
            className="w-100"
            value={countryIndex}
            onChange={(e) => {
              // 選擇縣市時，重置區域與郵遞區號
              setCountryIndex(+e.target.value)
              setTownshipIndex(-1)
              setPostcode('')
            }}
          >
            <option value="-1">{intl.formatMessage({ id: 'zipcode.selectCity', defaultMessage: '選擇縣市' })}</option>
            {cityList.map((city, index) => (
              <option key={index} value={index}>
                {langKey === 'zh' ? city.CityName : city.CityEngName}
              </option>
            ))}
          </select>{' '}
        </div>

        <div className="col-12 col-sm-4 pb-3">
          <div className='pb-2'>
            {intl.formatMessage({ id: 'zipcode.district', defaultMessage: '鄉鎮縣市' })}<span className="text-danger">*</span>
          </div>
          <select
            className="w-100"
            value={townshipIndex}
            onChange={(e) => {
              // 選擇區域時，自動帶出對應郵遞區號
              const idx = +e.target.value
              setTownshipIndex(idx)
              if (selectedCityObj && selectedCityObj.AreaList[idx]) {
                setPostcode(selectedCityObj.AreaList[idx].ZipCode)
              }
            }}
          >
            <option value="-1">{intl.formatMessage({ id: 'zipcode.selectDistrict', defaultMessage: '選擇區域' })}</option>
            {countryIndex > -1 &&
              areaList.map((area, index) => (
                <option key={index} value={index}>
                  {langKey === 'zh' ? area.AreaName : area.AreaEngName}
                </option>
              ))}
          </select>
        </div>
        <div className="col-12 col-sm-4 pb-3">
          <div className='pb-2'>
            {intl.formatMessage({ id: 'zipcode.code', defaultMessage: '郵遞區號' })}<span className="text-danger">*</span>
          </div>
          <input
            value={postcode ? postcode : intl.formatMessage({ id: 'zipcode.code', defaultMessage: '郵遞區號' })}
            className="rounded-5 p-2 w-100"
            style={{ color: postcode ? 'black' : 'gray' }}
            readOnly
          />
        </div>
      </div>
    </>
  )
}
