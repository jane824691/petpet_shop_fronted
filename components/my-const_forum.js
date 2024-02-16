// 這是一個設定路由的檔案


export const API_SERVER = "http://localhost:3002";

//所有最新文章排序
export const AB_LIST = API_SERVER + "/forum-address/api";

//所有熱門文章排序
export const AB_LIST2 = API_SERVER + "/forum-address/api2";

//毛孩小毛病-最新 文章排序
export const AB_LIST3 = API_SERVER + "/forum-address/api3";

//毛孩小毛病-熱門 文章排序
export const AB_LIST4 = API_SERVER + "/forum-address/api4";

//可愛貓狗-最新 文章排序
export const AB_LIST5 = API_SERVER + "/forum-address/api5";

//可愛貓狗-熱門 文章排序
export const AB_LIST6 = API_SERVER + "/forum-address/api6";

//浪你喜翻我-最新 文章排序
export const AB_LIST7 = API_SERVER + "/forum-address/api7";

//浪你喜翻我-熱門 文章排序
export const AB_LIST8 = API_SERVER + "/forum-address/api8";

//喵汪生活-最新 文章排序
export const AB_LIST9 = API_SERVER + "/forum-address/api9";

//喵汪生活-熱門 文章排序
export const AB_LIST10 = API_SERVER + "/forum-address/api10";










//撰寫文章
export const AB_CREATE  = API_SERVER + "/forum-address/add"; //method: POST


//撰寫留言
export const AB_CREATE2  = API_SERVER + "/forum-address/add2"; //method: POST


//我寫的文章們
//http://localhost:3002/forum-address/api/somebody_creation
export const AB_CREATION  = API_SERVER + "/forum-address/api/somebody_creation"; //method: ??



//取得某一筆資料
//http://localhost:3002/forum-address/api/edit/22
export const AB_GET_ONE =API_SERVER+"/forum-address/api/edit"; //method: POST
//AB_GET_ONE + "/188"
//取得某一筆資料


//修改某一筆資料
//   /forum-address/edit/:article_id
export const AB_EDIT_ONE =API_SERVER+"/forum-address/edit"; //method: POST
//修改某一筆資料

//顯示文章跟留言資料
//http://localhost:3002/forum-address/api/detail_article_comment/191
export const AB_COMMENT =API_SERVER+"/forum-address/api/detail_article_comment"; //method: POST 
//顯示文章跟留言資料


//顯示文章留言數
//http://localhost:3002/forum-address/api/detail_article_comment/191
export const AB_COUNT_COMMENT =API_SERVER+"/forum-address/api/count_comment"; //method: POST 
//顯示文章留言數







//刪除某一筆資料
//http://localhost:3002/forum-address/:article_id
export const AB_DEL_ONE =API_SERVER+"/forum-address"; //method: DELETE
//刪除某一筆資料
