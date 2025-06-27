# 翻譯清理腳本使用指南

## 概述

這個腳本可以幫助你檢測並清理翻譯文件中未使用的翻譯鍵，保持翻譯文件的整潔和一致性。

## 功能

- 🔍 **掃描源文件**：自動掃描 `pages` 和 `components` 目錄中的所有 JS/JSX 文件
- 📊 **檢測使用情況**：找出所有實際使用的翻譯鍵
- 🧹 **清理未使用鍵**：移除翻譯文件中未使用的翻譯鍵
- 📋 **生成報告**：提供詳細的翻譯使用情況報告

## 使用方法

### 1. 生成翻譯使用報告

在執行清理之前，建議先查看報告：

```bash
npm run report-translations
```

或者直接運行：

```bash
node scripts/clean-unused-translations.js report
```

這會顯示：
- 總共使用的翻譯鍵數量
- 每個翻譯文件的狀態
- 缺失的翻譯鍵
- 未使用的翻譯鍵

### 2. 清理未使用的翻譯

執行清理操作：

```bash
npm run clean-translations
```

或者直接運行：

```bash
node scripts/clean-unused-translations.js clean
```

這會：
- 掃描所有源文件
- 找出實際使用的翻譯鍵
- 移除翻譯文件中未使用的鍵
- 顯示清理結果

## 腳本配置

腳本會掃描以下目錄：
- `./pages/**/*.js`
- `./components/**/*.js`
- `./pages/**/*.jsx`
- `./components/**/*.jsx`

排除的目錄：
- `node_modules`
- `.next`
- `scripts`
- `locales`

## 檢測模式

腳本會檢測以下格式的翻譯使用：

```javascript
// 單引號
intl.formatMessage({ id: 'header.home' })

// 雙引號
intl.formatMessage({ id: "member.profile" })

// 模板字符串
intl.formatMessage({ id: `common.submit` })
```

## 輸出範例

### 報告模式輸出

```
📋 生成翻譯使用報告...

=== 翻譯使用報告 ===
總共使用的翻譯鍵: 45

📄 zh-TW.js:
  總翻譯鍵: 50
  ⚠️  未使用的翻譯鍵: 5
    - footer.aboutUs
    - footer.contactUs
    - footer.privacyPolicy
    - footer.termsOfService
    - product.search

📄 en-US.js:
  總翻譯鍵: 50
  ⚠️  未使用的翻譯鍵: 5
    - footer.aboutUs
    - footer.contactUs
    - footer.privacyPolicy
    - footer.termsOfService
    - product.search
```

### 清理模式輸出

```
🔍 開始掃描源文件...
📊 找到 45 個使用的翻譯鍵:
  - cart.checkout
  - cart.discount
  - cart.emptyCart
  - cart.orderDetails
  - cart.shipping
  - cart.shoppingCart
  - cart.totalAmount
  - common.back
  - common.cancel
  - common.confirm
  - common.delete
  - common.edit
  - common.error
  - common.loading
  - common.optional
  - common.required
  - common.save
  - common.submit
  - common.success
  - header.cart
  - header.favorite
  - header.food
  - header.home
  - header.living
  - header.login
  - header.logout
  - header.member
  - header.outdoor
  - header.products
  - header.toy
  - member.account
  - member.address
  - member.backToMemberPage
  - member.backToPrevious
  - member.backToPreviousPage
  - member.birthday
  - member.city
  - member.completeEdit
  - member.completeRegister
  - member.confirm
  - member.contactAddress
  - member.continueEdit
  - member.continueRegister
  - member.detailedAddress
  - member.district
  - member.editData
  - member.editFailure
  - member.editSuccess
  - member.email
  - member.firstName
  - member.id
  - member.lastName
  - member.login
  - member.logout
  - member.nextStep
  - member.password
  - member.personalInfo
  - member.phoneNumber
  - member.pleaseCompleteData
  - member.pleaseCompleteRegisterData
  - member.pleaseEnterAccount
  - member.pleaseEnterAddress
  - member.pleaseEnterDate
  - member.pleaseEnterEmail
  - member.pleaseEnterId
  - member.pleaseEnterPassword
  - member.pleaseEnterPhone
  - member.register
  - member.registerFailure
  - member.registerSuccess
  - member.redirectToMemberCenter
  - member.required
  - member.zipcode
  - validation.accountFormat
  - validation.addressFormat
  - validation.emailFormat
  - validation.firstnameChinese
  - validation.idFormat
  - validation.lastnameChinese
  - validation.passwordFormat
  - validation.phoneFormat
  - validation.zipcodeRequired

📝 處理文件: ./locales/zh-TW.js
❌ 發現 5 個未使用的翻譯鍵:
  - footer.aboutUs
  - footer.contactUs
  - footer.privacyPolicy
  - footer.termsOfService
  - product.search
✅ 已移除 5 個未使用的翻譯鍵
📈 翻譯鍵數量: 50 → 45
✅ 已更新 ./locales/zh-TW.js

📝 處理文件: ./locales/en-US.js
❌ 發現 5 個未使用的翻譯鍵:
  - footer.aboutUs
  - footer.contactUs
  - footer.privacyPolicy
  - footer.termsOfService
  - product.search
✅ 已移除 5 個未使用的翻譯鍵
📈 翻譯鍵數量: 50 → 45
✅ 已更新 ./locales/en-US.js

🎉 清理完成！
```

## 注意事項

1. **備份重要文件**：在執行清理之前，建議先備份翻譯文件
2. **檢查報告**：先運行報告模式查看會影響哪些翻譯鍵
3. **測試應用**：清理後請測試應用確保沒有遺漏的翻譯
4. **版本控制**：建議在 Git 中提交清理前的狀態

## 故障排除

### 常見問題

1. **腳本無法運行**
   - 確保 Node.js 版本 >= 14
   - 檢查文件路徑是否正確

2. **解析錯誤**
   - 檢查翻譯文件格式是否正確
   - 確保翻譯文件是有效的 JavaScript 對象

3. **遺漏翻譯鍵**
   - 檢查是否有動態生成的翻譯鍵
   - 確認所有翻譯使用都使用 `intl.formatMessage()` 格式

## 自定義配置

如果需要修改掃描範圍，可以編輯 `scripts/clean-unused-translations.js` 中的 `CONFIG` 對象：

```javascript
const CONFIG = {
  localesDir: './locales',
  sourceDirs: [
    './pages/**/*.js',
    './components/**/*.js',
    './pages/**/*.jsx',
    './components/**/*.jsx'
  ],
  excludePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/scripts/**',
    '**/locales/**'
  ]
};
``` 