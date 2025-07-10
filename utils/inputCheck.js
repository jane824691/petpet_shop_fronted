// 安全防護工具函數
const SecurityUtils = {
    // XSS 防護：移除危險的 HTML 標籤和屬性
    sanitizeHTML: (input) => {
        if (typeof input !== 'string') return ''

        // 移除所有 HTML 標籤
        const stripped = input.replace(/<[^>]*>/g, '')

        // 移除危險的 JavaScript 事件處理器
        const noScript = stripped.replace(/javascript:/gi, '')

        // 移除其他危險的協議
        const noProtocols = noScript.replace(/(data|vbscript|mocha|livescript):/gi, '')

        // 移除 JavaScript 相關的危險關鍵字和函數調用
        const noJSKeywords = noProtocols
            .replace(/\b(alert|confirm|prompt|eval|setTimeout|setInterval|Function|execScript)\s*\([^)]*\)/gi, '') // 移除完整的危險函數調用
            .replace(/\b(document|window|location|history|navigator)\s*\./gi, '') // 移除危險物件存取
            .replace(/\b(onload|onerror|onclick|onmouseover|onfocus|onblur|onchange|onsubmit)\s*=/gi, '') // 移除事件處理器
            .replace(/\b(script|iframe|object|embed|form|input|textarea|select|button)\b/gi, '') // 移除危險標籤名稱
            .replace(/\b(src|href|action|data|value)\s*=/gi, '') // 移除危險屬性
            .replace(/[<>]/g, '') // 移除任何剩餘的尖括號
            .replace(/[;{}()]/g, '') // 移除 JavaScript 語法字符

        return noJSKeywords.trim()
    },

    // 輸入驗證：檢查是否包含危險字符
    validateInput: (input) => {
        if (typeof input !== 'string') return false

        // 檢查是否包含危險的 HTML 實體
        const dangerousPatterns = [
            /&[#x]?[0-9a-f]+;/gi,  // HTML 實體
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // script 標籤
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,  // iframe 標籤
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,  // object 標籤
            /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,     // embed 標籤
            /on\w+\s*=/gi,  // 事件處理器
            /javascript:/gi,  // JavaScript 協議
            /data:/gi,       // data 協議
            /vbscript:/gi,   // VBScript 協議
        ]

        return !dangerousPatterns.some(pattern => pattern.test(input))
    },

    // 長度驗證
    validateLength: (input, min = 1, max = 300) => {
        if (typeof input !== 'string') return false
        const length = input.trim().length
        return length >= min && length <= max
    },

    // 內容類型驗證
    validateContent: (input) => {
        if (typeof input !== 'string') return false

        // 檢查是否只包含空白字符
        if (!input.trim()) return false

        // 檢查是否包含過多的重複字符（可能是垃圾內容）
        const repeatedChars = /(.)\1{10,}/g
        if (repeatedChars.test(input)) return false

        // 檢查是否包含過多的特殊字符
        const specialCharRatio = (input.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length / input.length
        if (specialCharRatio > 0.5) return false

        return true
    },

    // 綜合安全檢查
    securityCheck: (input) => {
        const sanitized = SecurityUtils.sanitizeHTML(input)
        const isValidInput = SecurityUtils.validateInput(sanitized)
        const isValidLength = SecurityUtils.validateLength(sanitized)
        const isValidContent = SecurityUtils.validateContent(sanitized)

        return {
            isValid: isValidInput && isValidLength && isValidContent,
            sanitized,
            errors: {
                invalidInput: !isValidInput,
                invalidLength: !isValidLength,
                invalidContent: !isValidContent
            }
        }
    }
}

export default SecurityUtils