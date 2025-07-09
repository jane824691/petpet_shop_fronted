import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/contexts/LanguageContext'
import cityCountyData from '@/data/CityCountyData.json'

const ReverseLookup = ({ postcode = '' }) => {
  const [postalCode, setPostalCode] = useState(postcode)
  const [cityTown, setCityTown] = useState(null)
  const intl = useIntl()
  const { locale } = useLanguage()

  useEffect(() => {
    setPostalCode(postcode)
  }, [postcode])

  useEffect(() => {
    // 在 data 中搜索郵遞區號
    const searchPostalCode = () => {
      for (const cityObj of cityCountyData) {
        for (const area of cityObj.AreaList) {
          if (area.ZipCode === postalCode) {
            setCityTown({
              city: cityObj,
              district: area,
            })
            return
          }
        }
      }
      setCityTown(null)
    }
    searchPostalCode()
  }, [postalCode])

  return (
    <span>
      {cityTown && (
        <span>
          <span>{locale === 'zh-TW' ? cityTown.city.CityName : cityTown.city.CityEngName}</span>
          <span>{locale === 'zh-TW' ? cityTown.district.AreaName : cityTown.district.AreaEngName}</span>
        </span>
      )}
      {cityTown === null && (
        <span>{intl.formatMessage({ id: 'zipcode.notFound', defaultMessage: '找不到對應的城市和區域。' })}</span>
      )}
    </span>
  )
}

export default ReverseLookup
