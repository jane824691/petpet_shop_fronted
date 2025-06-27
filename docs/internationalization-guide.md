# 國際化 (i18n) 使用指南

## 概述

本專案使用 `react-intl` 來實現多語言支援，目前支援繁體中文 (zh-TW) 和英文 (en-US)。

## 檔案結構

```
locales/
├── zh-TW.js          # 繁體中文翻譯
└── en-US.js          # 英文翻譯

components/contexts/
└── LanguageContext.js # 語言上下文提供者

docs/
└── internationalization-guide.md  # 本指南
```

## 使用方法

### 1. 在組件中使用翻譯

```jsx
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/contexts/LanguageContext'

function MyComponent() {
  const intl = useIntl()
  const { locale, changeLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{intl.formatMessage({ id: 'header.home' })}</h1>
      <button onClick={() => changeLanguage('en-US')}>
        切換到英文
      </button>
    </div>
  )
}
```

### 2. 語言切換

```jsx
const { locale, changeLanguage } = useLanguage()

// 切換到英文
changeLanguage('en-US')

// 切換到繁體中文
changeLanguage('zh-TW')

// 檢查當前語言
const isZH = locale === 'zh-TW'
```

### 3. 添加新的翻譯

在 `locales/zh-TW.js` 和 `locales/en-US.js` 中添加新的翻譯鍵值對：

```javascript
// locales/zh-TW.js
export const zhTW = {
  // ... 現有翻譯
  "new.key": "新的翻譯",
  "button.submit": "送出"
}

// locales/en-US.js
export const enUS = {
  // ... 現有翻譯
  "new.key": "New Translation",
  "button.submit": "Submit"
}
```

## 翻譯鍵命名規範

建議使用點分隔的命名方式，按功能模組分類：

- `header.*` - 頁面標題相關
- `member.*` - 會員相關
- `product.*` - 商品相關
- `cart.*` - 購物車相關
- `common.*` - 通用按鈕和文字
- `validation.*` - 驗證訊息

## 注意事項

1. 所有翻譯鍵都必須在兩個語言檔案中都有對應的翻譯
2. 使用 `intl.formatMessage()` 來獲取翻譯文字
3. 語言切換會即時生效，無需重新載入頁面
4. 翻譯檔案使用扁平化的鍵值對結構，不支援巢狀物件

## 翻譯鍵命名規範

- 使用點號分隔層級結構
- 使用小寫字母與底線
- 按功能模組分類

例如：
- `header.login` - 頁首的登入按鈕
- `member.profile` - 會員資料
- `validation.emailFormat` - 電子信箱格式驗證

## 常用翻譯鍵

### Header 相關
- `header.home` - 首页
- `header.products` - 商品
- `header.cart` - 購物車
- `header.member` - 會員中心
- `header.login` - 登陸
- `header.logout` - 登出

### 會員相關
- `member.profile` - 會員訊息
- `member.editProfile` - 編輯資料
- `member.register` - 會員註冊
- `member.personalInfo` - 個人資料
- `member.contactAddress` - 聯絡地址

### 表單欄位
- `member.lastName` - 姓氏
- `member.firstName` - 名字
- `member.phoneNumber` - 電話號碼
- `member.birthday` - 出生年月日
- `member.email` - 信箱
- `member.address` - 地址

### 驗證訊息
- `validation.lastnameChinese` - 姓氏需填寫中文
- `validation.emailFormat` - EMAIL 格式錯誤
- `validation.requiredField` - 此欄位為必填

### 通用按鈕
- `common.submit` - 送出
- `common.cancel` - 取消
- `common.save` - 儲存
- `common.back` - 返回

## 注意是像

1. **語言持久化**：選擇的語言會儲存在 localStorage 中，重新整理頁面後仍保留所選語言
2. **預設語言**：預設為繁体中文 (zh-TW)
3. **翻譯鍵一致性**：請確保中英文翻譯檔中的鍵名完全一致
4. **動態内容**：對於動態內容可使用 `intl.formatMessage` 的參數功能

## 動態翻譯範例

```jsx
// 带參數的翻譯
intl.formatMessage(
  { id: 'welcome.message' },
  { name: userName }
)

// 翻譯檔案中的定義
{
  "welcome.message": "歡迎 {name}！"
}
```

## 故障排除

1. **翻譯無法顯示**：請檢查翻譯鍵是否正確
2. **語言切換無效**：請確保元件已被 LanguageProvider 包裹
3. **翻譯鍵缺失**：控制台會顯示警告，請補上對應的翻譯

## 擴充功能

如需新增其他語言，可依以下步驟操作：
1. 建立新的翻譯檔（如 ja-JP.js）
2. 在 `LanguageContext.js` 中加入新語言支援
3. 更新語言切換邏輯