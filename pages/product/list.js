import { useEffect, useState } from 'react'
// 解開以下可不接後端 接純假資料
// import data from '@/data/Product.json'
import SortBar from './components/SortBar/'
import SearchBar from './components/SearchBar/'
import FilterBar from './components/FilterBar/'
import ProductList from './components/ProductList'
import { useRouter } from 'next/router'
import { PRODUCT } from '@/components/my-const'
import PagesBar from '@/components/PagesBar'
import { CatLoader } from '@/components/hooks/use-loader/components'
import { useIntl } from 'react-intl'

export default function List() {
  const [data, setData] = useState({})
  const router = useRouter()
  const intl = useIntl()
  const lang = intl.locale 
  const [searchWord, setSearchWord] = useState('') // 搜尋關鍵字狀態
  const [priceRange, setPriceRange] = useState(intl.formatMessage({ id: 'product.all' })) // radio選項
  const [priceHigh, setPriceHigh] = useState('') //價格區間
  const [priceLow, setPriceLow] = useState('')
  const [sortBy, setSortBy] = useState('') // 價格排序
  // 下面tagTypes是對應到checkbox表單元素
  const [tags, setTags] = useState([])
  const [tagsNum, setTagsNum] = useState([])
  const tagTypes = [
    intl.formatMessage({ id: 'product.dryFood' }),
    intl.formatMessage({ id: 'product.canned' }),
    intl.formatMessage({ id: 'product.supplement' }),
    intl.formatMessage({ id: 'product.clothes' }),
    intl.formatMessage({ id: 'product.beauty' }),
    intl.formatMessage({ id: 'product.toy' }),
    intl.formatMessage({ id: 'product.living' }),
    intl.formatMessage({ id: 'product.leash' }),
    intl.formatMessage({ id: 'product.bag' }),
  ]
  const categoryTagMap = {
    5: intl.formatMessage({ id: 'product.dryFood' }),
    6: intl.formatMessage({ id: 'product.canned' }),
    7: intl.formatMessage({ id: 'product.supplement' }),
    8: intl.formatMessage({ id: 'product.clothes' }),
    9: intl.formatMessage({ id: 'product.beauty' }),
    10: intl.formatMessage({ id: 'product.toy' }),
    11: intl.formatMessage({ id: 'product.living' }),
    12: intl.formatMessage({ id: 'product.leash' }),
    13: intl.formatMessage({ id: 'product.bag' }),
  }

  // 取後端page資料
  const getListData = async () => {
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const sortByParam =
        sortBy === 'cheap' ? 'cheap' : sortBy === 'expensive' ? 'expensive' : ''

      // 根據使用者選擇的標籤(tags)查找對應的標籤 種類id

      const currentTagsNum = tags
        .map((tag) => {
          // 在 categoryTagMap 中查找標籤對應的 種類id
          for (const [tagId, tagName] of Object.entries(categoryTagMap)) {
            if (tagName === tag) {
              return parseInt(tagId) // 將 種類id 轉換為數字
            }
          }
          return null
        })
        .filter((tagId) => tagId !== null)
        .join(',') // 過濾空值並將 種類id 陣列轉換為逗號分隔的字串

      // 實際呼叫後端api
      const r = await fetch(
        PRODUCT +
          `?page=${page}&searchWord=${searchWord}&priceLow=${priceLow}&priceHigh=${priceHigh}&sortBy=${sortByParam}&tag=${currentTagsNum}`,
          {
            headers: {
              'Accept-Language': lang, // 很多後端（尤其是 Express、NestJS、Spring Boot 等）會優先判斷 Accept-Language header，而不是 query string
            },
            cache: 'no-store', // 防止快取
          }
        )
      const d = await r.json()
      setData(d)
    } catch (error) {
      // console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (!router.isReady) return

    const page = +router.query.page || 1
    if (page < 1) return

    getListData()
  }, [router.query.page, searchWord, priceLow, priceHigh, sortBy, tags, lang])

  // 當搜尋關鍵字改變時將頁面重設為第 1 頁
  useEffect(() => {
    router.push({ pathname: router.pathname, query: { page: 1 } }, undefined, {
      shallow: true,
    })
  }, [searchWord, priceLow, priceHigh, sortBy, tags, lang])

  // 設定四種搜尋方式
  // 1. 從伺服器來的原始資料
  const [products, setProducts] = useState([])

  // 2. 用於網頁上經過各種處理(排序、搜尋、過濾)後的資料
  const [displayProducts, setDisplayProducts] = useState([])

  const priceRangeTypes = [
    intl.formatMessage({ id: 'product.all' }),
    intl.formatMessage({ id: 'product.priceRange1' }),
    intl.formatMessage({ id: 'product.priceRange2' }),
    intl.formatMessage({ id: 'product.priceRange3' }),
    intl.formatMessage({ id: 'product.priceRange4' }),
  ]

  // 四種搜尋表單的處理方法
  const handleSearch = (products, searchWord) => {
    // 確保 products 是陣列
    if (!Array.isArray(products)) {
      return []
    }

    let newProducts = [...products]

    if (searchWord.length) {
      newProducts = products.filter((product) => {
        // includes -> String API
        return product.product_name.includes(searchWord)
      })
    }

    return newProducts
  }

  // 處理價格排序
  const handleSort = (products, sortBy) => {
    let newProducts = [...products]

    // 以價格排序-由少至多
    if (sortBy === 'cheap') {
      newProducts = [...newProducts].sort(
        (a, b) => a.product_price - b.product_price
      )
    }

    if (sortBy === 'expensive') {
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

  // 商品篩選種類選項
  const handleTags = (products, tags) => {
    let newProducts = [...products]
    let allTags = []

    if (tags.length > 0) {
      newProducts = newProducts.filter((product) => {
        const productTags = String(product.category_id).split(',').map(Number)
        const mappedTags = productTags.map(
          (category_id) => categoryTagMap[category_id] || category_id
        )

        if (tags.some((tag) => mappedTags.includes(tag))) {
          allTags.push(product.category_id)
          return true
        }

        return false
      })
    } else {
      newProducts = [...products] // 如果沒有選定條件, 則顯示全部
    }

    setTagsNum([...new Set(allTags)]) // 用 Set 排除重複值
    return newProducts
  }

  // 處理價格區間選項
  const handlePriceRange = (products, priceRange) => {
    let newProducts = [...products]
    let newPriceLow, newPriceHigh
    switch (priceRange) {
      case '所有':
        newPriceLow = ''
        newPriceHigh = ''
        break
      case '$1 - $499':
        newPriceLow = 1
        newPriceHigh = 499
        newProducts = products.filter((p) => {
          return p.product_price <= 499
        })
        break
      case '$500 - $999':
        newPriceLow = 500
        newPriceHigh = 999
        newProducts = products.filter((p) => {
          return p.product_price >= 500 && p.product_price <= 999
        })
        break
      case '$1000 - $1999':
        newPriceLow = 1000
        newPriceHigh = 1999
        newProducts = products.filter((p) => {
          return p.product_price >= 1000 && p.product_price <= 1999
        })
        break
      case '$2000 - $2999':
        newPriceLow = 2000
        newPriceHigh = 2999
        newProducts = products.filter((p) => {
          return p.product_price >= 2000 && p.product_price <= 2999
        })
        break
      // 指所有的產品都出現
      default:
        newPriceLow = ''
        newPriceHigh = ''
        break
    }
    setPriceLow(newPriceLow)
    setPriceHigh(newPriceHigh)
    return newProducts
  }

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
      <div className="web-style">
        <div className="px-2 py-5">
          <div className="px-1 px-md-5 d-block d-md-flex" id="wrapper">
            {/* 手機版才出現的下拉按鈕 */}
            <div className="row d-md-none">
              <div className="col-12 mt-4 mb-2 text-center">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#sidebarCollapse"
                  aria-expanded="false"
                  aria-controls="sidebarCollapse"
                >
                  {intl.formatMessage({ id: 'product.filterBtn' })}
                </button>
              </div>
            </div>

            {/* Sidebar 區塊（桌機版顯示 / 手機版收折）*/}
            <div
              className="bg-white me-3 collapse d-md-block"
              id="sidebarCollapse"
            >
              <div
                className="scroll mx-auto mx-md-0"
                style={{ width: '15rem' }}
              >
                <div
                  className="accordion accordion-flush text-center text-md-start"
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

            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center w-100">
                <CatLoader />
              </div>
            ) : (
              <>
                <div className="d-flex flex-column px-0 px-md-1">
                  <div className="row mt-2 mb-3">
                    <h5 className="card-text d-flex justify-content-center justify-content-md-between align-items-center">
                      <span className="ps-3"> </span>
                      {/* 價格排序 */}
                      <SortBar sortBy={sortBy} setSortBy={setSortBy} />
                    </h5>
                  </div>
                  <div id="page-content-wrapper">
                    <div className="container-fluid">
                      <div className="row row-cols-2 row-cols-md-3 g-4">
                        {/* 如果想看純前端畫面(no後端)可解開以下帶JSON假資料 */}
                        {/* {data.map((v, i) => { */}

                        <ProductList products={displayProducts} />

                        {/* 頁碼 */}
                      </div>
                    </div>
                    <PagesBar data={data} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
