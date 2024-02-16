import { useEffect, useState } from 'react'
// 解開以下可不接後端 接純假資料
// import data from '@/data/Product.json'
import ReactBsCarousel from '@/components/product/ReactBsCarousel'
import SortBar from './components/SortBar/'
import SearchBar from './components/SearchBar/'
import FilterBar from './components/FilterBar/'
import ProductList from './components/ProductList'
import { useRouter } from 'next/router'
import { PRODUCT } from '@/components/my-const'
import PagesBar from './components/PagesBar'
import { CatLoader } from '@/components/hooks/use-loader/components'

//import PagesBar from './components/ProductList/PagesBarTest'

import Link from 'next/link'
import {
  BsChevronRight,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsChevronLeft,
} from 'react-icons/bs'

export default function List() {
  const [data, setData] = useState({})
  const router = useRouter()

  //取page資料
  const getListData = async () => {
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const r = await fetch(PRODUCT + `?page=${page}`)
      const d = await r.json()
      setData(d)
    } catch (ex) {}
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
  // 載入指示的spinner動畫用的
  const [isLoading, setIsLoading] = useState(false)

  //x秒後自動關掉spinner(設定isLoading為false)
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading])

  // 初始化資料-didMount
  useEffect(() => {
    // 先開起載入指示器
    setIsLoading(true)

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
        console.log(productTags)

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
    setIsLoading(true)

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
                    {/* 如果想看純前端畫面(no後端)可解開以下帶JSON假資料 */}
                    {/* {data.map((v, i) => { */}
                    {isLoading ? (
                      <CatLoader />
                    ) : (
                      <>
                        <ProductList products={displayProducts} />
                        <PagesBar data={data} />
                      </>
                    )}

                    {/* 頁碼 */}
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
