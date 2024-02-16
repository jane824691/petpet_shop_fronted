import React from 'react'
import ReverseLookup from './Zipcode_to_city' // 請替換成你的檔案路徑

const YourPage = () => {
  const data = {
    // ...你的資料
  }

  const countries = Object.getOwnPropertyNames(data)
  const townships = countries.map((v, i, array) =>
    Object.getOwnPropertyNames(data[array[i]])
  )
  const postcodes = countries.map((v, i, array) =>
    Object.values(data[array[i]])
  )

  return (
    <div>
      {/* 其他頁面的內容 */}
      <ReverseLookup
        data={data}
        countries={countries}
        townships={townships}
        postcodes={postcodes}
      />
    </div>
  )
}

export default YourPage
