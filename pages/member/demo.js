import { useState } from 'react'
import TWZipCode from './TWZipCode'

function Demo() {
  const [data, setData] = useState({
    country: '',
    township: '',
    postcode: '',
  })

  return (
    <>
      {/* 與本元件state相接與初始化 */}
      <TWZipCode
        initPostcode={data.postcode}
        onPostcodeChange={(country, township, postcode) => {
          setData({
            country,
            township,
            postcode,
          })
        }}
      />
    </>
  )
}

export default Demo
