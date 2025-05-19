// export const API_SERVER = 'http://localhost:3002'
export const API_SERVER = 'https://petpet-shop-backend.zeabur.app'


//* 商品相關
export const CHECK = API_SERVER + '/member/check' // method: GET, 取得用戶資料
export const PRODUCT = API_SERVER + '/product/api' // method: GET, 商品總列表
export const PRODUCT_RECOMMEND = API_SERVER + '/product/recommend' // method: GET, 商品總列表
export const ONE_PRODUCT = API_SERVER + '/product/one' // /product/one/2
export const ORDER_LIST_ADD = API_SERVER + '/order-list/add'
export const ORDER_LIST_ALL = API_SERVER + '/order-list/api' // 所有會員所有訂單資料
export const ORDER_LIST = API_SERVER + '/order-list/person' // 某筆會員底下的所有訂單資料
export const ONE_ORDER = API_SERVER + '/order-list/one' // /order-list/one/2 某筆會員底下的某筆訂單, 詳細品項


//* 評論相關
export const COMMENTS = API_SERVER + '/comments' // method: post, 評論總列表
export const COMMENTS_ONE = API_SERVER + '/comments/one' // method: post, 某筆商品底下評論
export const COMMENTS_ADD = API_SERVER + '/comments/add' // method: post, 某筆商品底下評論


//* 會員相關

// ---------- 登入
export const LOGIN = API_SERVER + '/login-jwt' // method: POST, 欄位 account, password
export const GET_MEMBER_DATA = API_SERVER + '/member' // 塞入資料到會員中心 (讀取)
export const REGISTER_ADD = API_SERVER + '/register-list/add' // method: POST, src是後端檔名+router.post("/add")路徑
export const PUT_MEMBER_DATA = API_SERVER + '/member/edit' // 修改會籍資料
// --- 優惠券相關的路由
export const COUPON = API_SERVER + '/favorite/coupon2' // method: POST, 取得用戶資料(新增優惠券)
export const COUPON_ADD = API_SERVER + '/coupon-list/add' // method: POST, src是後端檔名+router.post("/add")路徑
// 中介表新增資料
export const COUPON_USE_ADD = API_SERVER + '/coupon-list/coupon-use/add' // method: POST, src是後端檔名+router.post("/add")路徑
export const COUPON_SHOW = API_SERVER + '/coupon-show/add' //玩遊戲後coupon產生頁面的fetch路由
export const GET_COUPON_DATA = API_SERVER + '/coupon-show' // 塞入資料到優惠券
