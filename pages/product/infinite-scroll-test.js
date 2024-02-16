import React, { useState, useEffect } from 'react'
import ReactBsCarousel from '@/components/product/ReactBsCarousel'
import SortBar from './components/SortBar/'
import SearchBar from './components/SearchBar/'
import FilterBar from './components/FilterBar/'
import ProductList from './components/ProductList'

import { useRouter } from 'next/router'
import { PRODUCT } from '@/components/my-const'
import PagesBar from './components/PagesBar'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
//import useInfiniteScroll from 'react-infinite-scroll-hook';

// 無限滾動，允許監聽滾動事件並觸發回調函式。
function useInfiniteScroll(callback) {
  // 狀態：標記是否正在請求更多資料
  const [isFetching, setIsFetching] = useState(false)

  // 副作用：在元件掛載時，監聽滾動事件
  useEffect(() => {
    console.log('useInfiniteScroll effect') // 檢查是否被呼叫
    window.addEventListener('scroll', handleScroll)

    // 清理工作：在元件卸載時，移除滾動事件的監聽器
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // 第二個參數是空陣列，表示這個副作用僅在元件掛載時執行一次

  // 副作用：在 isFetching 狀態改變時，如果正在請求更多資料，則執行回呼函式
  useEffect(() => {
    if (!isFetching) return
    callback()
  }, [isFetching])

  // 監聽滾動事件的處理函式
  function handleScroll() {
    console.log('scrolling') // 檢查是否觸發
    // 檢查是否滾動到頁面底部，並且目前沒有正在請求更多資料
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return

    // 設定 isFetching 狀態為 true，表示開始請求更多資料
    setIsFetching(true)
  }

  // 返回狀態及設定狀態的函式，供元件使用
  return [isFetching, setIsFetching]
}

export default function List() {
  const [data, setData] = useState({})
  const router = useRouter()
  const [items, setItems] = useState([])
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems)

  // 取 page 資料
  const getListData = async () => {
    let pageNow = +router.query.page || 1
    let perpage = 12 // 在這裡初始化 perpage 變數, 每頁幾筆
    const searchCriteria = {}
    const searchParams = new URLSearchParams(searchCriteria)

    if (pageNow < 1) {
      pageNow = 1
      perpage = 12 // 重新指定 perpage 變數的值
    }

    try {
      const response = await fetch(
        `${PRODUCT}?&page=${pageNow}&perpage=${perpage}&${searchParams.toString()}`
      )

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`)
      }

      const data = await response.json()
      setData(data)
    } catch (ex) {
      console.error(ex) // 在 catch 區塊中處理錯誤，你可以自行決定如何處理
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page])

  console.log(data)
  console.log(data.rows)

  // 產品用的資料
  // 1. 從伺服器來的原始資料
  const [products, setProducts] = useState([])

  // 2. 用於網頁上經過各種處理(排序、搜尋、過濾)後的資料
  const [displayProducts, setDisplayProducts] = useState([])

  function fetchMoreListItems() {
    setTimeout(() => {
      // 在這個範例中，將數字 1 到 5 附加到現有的 products 狀態中，
      // 這表示獲取了新的資料，你應根據你的應用程式需求修改這部分。
      setProducts([...products, ...products, 2, 3, 4, 5])

      // 設定 isFetching 狀態為 false，表示當前資料載入已完成，
      // 並且可以再次觸發無限滾動事件。
      setIsFetching(false)
    }, 1000) // 設定延遲時間為 1000 毫秒 (1 秒)
  }

  // 下面tagTypes是對應到checkbox表單元素
  const [tags, setTags] = useState([])
  const tagTypes = [
    '乾飼料',
    '罐頭',
    '保健食品',
    '寵物衣裝',
    '美容護理',
    '抓板玩具',
    '生活用品',
    '溜繩',
    '寵物外出包',
  ]

  // radio
  const [priceRange, setPriceRange] = useState('所有')
  const priceRangeTypes = [
    '所有',
    '$1 - $499',
    '$500 - $999',
    '$1000 - $1999',
    '$2000 - $2999',
  ]

  // 初始化資料-didMount
  useEffect(() => {
    // 模擬和伺服器要資料
    // 最後設定到狀態中
    setProducts(data.rows)
    setDisplayProducts(data.rows)
  }, [data.rows])

  // 四個表單元素的處理方法
  const handleSearch = (products, searchWord) => {
    // 確保 products 是陣列
    if (!Array.isArray(products)) {
      console.error('products is not an array')
      return []
    }

    let newProducts = [...products]
    console.log([...products])

    if (searchWord.length) {
      newProducts = products.filter((product) => {
        // includes -> String API
        return product.product_name.includes(searchWord)
      })
    }

    return newProducts
  }

  const [searchWord, setSearchWord] = useState('')
  const [sortBy, setSortBy] = useState('')

  //處理價格排序
  const handleSort = (products, sortBy) => {
    let newProducts = [...products]
    console.log([...products])
    console.log(
      [...newProducts].sort((a, b) => a.product_price - b.product_price)
    )

    // 以價格排序-由少至多
    if (sortBy === '1') {
      newProducts = [...newProducts].sort(
        (a, b) => a.product_price - b.product_price
      )
    }

    if (sortBy === '2') {
      newProducts = [...newProducts].sort(
        (a, b) => b.product_price - a.product_price
      )
    }

    // 預設用id 小至大
    if (sortBy === '' && newProducts.length > 0) {
      newProducts = [...newProducts].sort((a, b) => a.pid - b.pid)
    }

    return newProducts
  }

  const handleTags = (products, tags) => {
    let newProducts = [...products]
    console.log([...products])
    // tags = 代表使用者目前勾選的標籤陣列
    //console.log(tags)
    const categoryTagMap = {
      5: '乾飼料',
      6: '罐頭',
      7: '保健食品',
      8: '寵物衣裝',
      9: '美容護理',
      10: '抓板玩具',
      11: '生活用品',
      12: '溜繩',
      13: '寵物外出包',
    }
    // 處理勾選標記
    if (tags.length > 0) {
      newProducts = [...newProducts].filter((product) => {
        let isFound = false

        // 原本資料裡的tags字串轉為陣列
        // 将category_id转换为字符串再转为数组
        const productTags = String(product.category_id).split(',')

        // 将 category_id 转换为对应的标签
        const mappedTags = productTags.map(
          (categoryId) => categoryTagMap[categoryId] || categoryId
        )

        // 用目前使用者勾選的標籤用迴圈找，有找到就回傳true
        return tags.some((tag) => mappedTags.includes(tag))
      })
    }

    return newProducts
  }

  const handlePriceRange = (products, priceRange) => {
    let newProducts = [...products]

    // 處理價格區間選項
    switch (priceRange) {
      case '$1 - $499':
        newProducts = products.filter((p) => {
          return p.product_price <= 499
        })
        break
      case '$500 - $999':
        newProducts = products.filter((p) => {
          return p.product_price >= 500 && p.product_price <= 999
        })
        break
      case '$1000 - $1999':
        newProducts = products.filter((p) => {
          return p.product_price >= 1000 && p.product_price <= 1999
        })
        break
      case '$2000 - $2999':
        newProducts = products.filter((p) => {
          return p.product_price >= 2000 && p.product_price <= 2999
        })
        break
      // 指所有的產品都出現
      default:
        break
    }

    return newProducts
  }

  // 當四個過濾表單元素有更動時
  // componentDidUpdate + didMount
  // ps. 一開始也會載入
  useEffect(() => {
    // 搜尋字串太少不需要搜尋
    if (searchWord.length < 2 && searchWord.length !== 0) return

    // 先開起載入指示器
    //    setIsLoading(true)

    let newProducts = []

    // 處理搜尋
    newProducts = handleSearch(products, searchWord)

    // 處理排序
    newProducts = handleSort(newProducts, sortBy)

    // 處理勾選標記
    newProducts = handleTags(newProducts, tags)

    // 處理價格區間選項
    newProducts = handlePriceRange(newProducts, priceRange)

    setDisplayProducts(newProducts)
  }, [searchWord, products, sortBy, tags, priceRange])

  return (
    <>
      <ReactBsCarousel />
      <div className="web-style">
        <div className="row mt-2 mb-3">
          <h5 className="card-text d-flex justify-content-between align-items-center">
            <span className="ps-3"> </span>
            {/* 價格排序 */}
            <SortBar sortBy={sortBy} setSortBy={setSortBy} />
          </h5>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex" id="wrapper">
              <div className="bg-white me-3" id="sidebar-wrapper">
                <div className="scroll" style={{ width: '15rem' }}>
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {/* 搜尋欄 */}
                    <SearchBar
                      searchWord={searchWord}
                      setSearchWord={setSearchWord}
                    />

                    {/* 價格範圍 */}
                    <FilterBar
                      priceRangeTypes={priceRangeTypes}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      tagTypes={tagTypes}
                      tags={tags}
                      setTags={setTags}
                    />
                  </div>
                </div>
              </div>

              <div id="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    {/* 如果想看純前端畫面(X後端)可解開以下帶JSON假資料 */}
                    {/* {data.map((v, i) => { */}
                    <ProductList products={displayProducts} />

                    {/* 頁碼 */}
                  </div>
                  {/* <PagesBar data={data} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
