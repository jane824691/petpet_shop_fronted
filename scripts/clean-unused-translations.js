const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// 配置
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

// 從文件中提取翻譯鍵
function extractTranslationKeys(content) {
    const keys = new Set();

    // 匹配 intl.formatMessage({ id: 'key' }) 模式
    const formatMessageRegex = /intl\.formatMessage\(\s*\{\s*id\s*:\s*['"`]([^'"`]+)['"`]\s*\}\s*\)/g;
    let match;

    while ((match = formatMessageRegex.exec(content)) !== null) {
        keys.add(match[1]);
    }

    return Array.from(keys);
}

// 掃描所有源文件
async function scanSourceFiles() {
    const allKeys = new Set();

    try {
        for (const pattern of CONFIG.sourceDirs) {
            const files = await glob(pattern, {
                ignore: CONFIG.excludePatterns,
                nodir: true
            }) || [];

            for (const file of files) {
                try {
                    const content = fs.readFileSync(file, 'utf8');
                    const keys = extractTranslationKeys(content);
                    keys.forEach(key => allKeys.add(key));
                } catch (error) {
                    console.warn(`無法讀取文件 ${file}:`, error.message);
                }
            }
        }
    } catch (error) {
        console.error('掃描文件時發生錯誤:', error.message);
    }

    return Array.from(allKeys).sort();
}

// 讀取翻譯文件
function readTranslationFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // 更安全的解析方式：使用 Function 構造函數
        const cleanContent = content
            .replace(/export\s+const\s+\w+\s*=\s*/, '')
            .replace(/;\s*$/, '');

        // 使用 Function 構造函數來安全地執行代碼
        const parseFunction = new Function(`return ${cleanContent}`);
        return parseFunction();
    } catch (error) {
        console.error(`無法讀取翻譯文件 ${filePath}:`, error.message);
        return {};
    }
}

// 寫入翻譯文件
function writeTranslationFile(filePath, translations) {
    try {
        const fileName = path.basename(filePath, '.js');
        const varName = fileName === 'zh-TW' ? 'zhTW' : 'enUS';

        const content = `export const ${varName} = ${JSON.stringify(translations, null, 2)}`;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已更新 ${filePath}`);
    } catch (error) {
        console.error(`無法寫入翻譯文件 ${filePath}:`, error.message);
    }
}

// 清理未使用的翻譯
async function cleanUnusedTranslations() {
    console.log('🔍 開始掃描源文件...');
    const usedKeys = await scanSourceFiles();
    console.log(`📊 找到 ${usedKeys.length} 個使用的翻譯鍵:`);
    usedKeys.forEach(key => console.log(`  - ${key}`));

    try {
        // 處理每個翻譯文件
        const translationFiles = await glob(`${CONFIG.localesDir}/*.js`) || [];

        for (const filePath of translationFiles) {
            console.log(`\n📝 處理文件: ${filePath}`);

            const translations = readTranslationFile(filePath);
            const originalCount = Object.keys(translations).length;

            // 找出未使用的鍵
            const unusedKeys = Object.keys(translations).filter(key => !usedKeys.includes(key));

            if (unusedKeys.length > 0) {
                console.log(`❌ 發現 ${unusedKeys.length} 個未使用的翻譯鍵:`);
                unusedKeys.forEach(key => console.log(`  - ${key}`));

                // 移除未使用的鍵
                const cleanedTranslations = {};
                usedKeys.forEach(key => {
                    if (translations[key]) {
                        cleanedTranslations[key] = translations[key];
                    } else {
                        console.warn(`⚠️  翻譯鍵 "${key}" 在 ${path.basename(filePath)} 中缺失`);
                    }
                });

                // 寫入清理後的文件
                writeTranslationFile(filePath, cleanedTranslations);
                console.log(`✅ 已移除 ${unusedKeys.length} 個未使用的翻譯鍵`);
                console.log(`📈 翻譯鍵數量: ${originalCount} → ${Object.keys(cleanedTranslations).length}`);
            } else {
                console.log('✅ 沒有發現未使用的翻譯鍵');
            }
        }
    } catch (error) {
        console.error('處理翻譯文件時發生錯誤:', error.message);
    }

    console.log('\n🎉 清理完成！');
}

// 生成報告
async function generateReport() {
    console.log('📋 生成翻譯使用報告...\n');
    
    try {
        const usedKeys = await scanSourceFiles();
        const translationFiles = (await glob(`${CONFIG.localesDir}/*.js`)) || [];
        
        console.log('=== 翻譯使用報告 ===');
        console.log(`總共使用的翻譯鍵: ${usedKeys.length}`);
        
        for (const filePath of translationFiles) {
            const translations = readTranslationFile(filePath);
            const fileName = path.basename(filePath);
            
            console.log(`\n📄 ${fileName}:`);
            console.log(`  總翻譯鍵: ${Object.keys(translations).length}`);
            
            const missingKeys = usedKeys.filter(key => !translations[key]);
            const unusedKeys = Object.keys(translations).filter(key => !usedKeys.includes(key));
            
            if (missingKeys.length > 0) {
                console.log(`  ❌ 缺失的翻譯鍵: ${missingKeys.length}`);
                missingKeys.forEach(key => console.log(`    - ${key}`));
            }
            
            if (unusedKeys.length > 0) {
                console.log(`  ⚠️  未使用的翻譯鍵: ${unusedKeys.length}`);
                unusedKeys.forEach(key => console.log(`    - ${key}`));
            }
            
            if (missingKeys.length === 0 && unusedKeys.length === 0) {
                console.log('  ✅ 翻譯文件完整且無冗餘');
            }
        }
    } catch (error) {
        console.error('生成報告時發生錯誤:', error.message);
    }
}

// 主函數
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'clean':
                await cleanUnusedTranslations();
                break;
            case 'report':
                await generateReport();
                break;
            default:
                console.log('使用方法:');
                console.log('  node scripts/clean-unused-translations.js clean   # 清理未使用的翻譯');
                console.log('  node scripts/clean-unused-translations.js report  # 生成使用報告');
                break;
        }
    } catch (error) {
        console.error('執行腳本時發生錯誤:', error.message);
        process.exit(1);
    }
}

// 檢查是否直接運行此腳本
if (require.main === module) {
    main();
}

module.exports = {
    cleanUnusedTranslations,
    generateReport,
    scanSourceFiles
}; 