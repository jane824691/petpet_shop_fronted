import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/components/hooks/use-cart-state';
import type { CartItem } from '@/components/hooks/cart-reducer-state';
import { ReactNode } from 'react';
// 由於 CartProvider 依賴 useLanguage，我們需要模擬 (mock) 這個 Hook
// 我們讓它回傳一個固定的語言 'zh-TW'
jest.mock('@/components/contexts/LanguageContext', () => ({
    useLanguage: () => ({
        locale: 'zh-TW',
        setLocale: jest.fn(), // mock一個空函式
    }),
}));

// 建立一個包含所有 Provider 的 Wrapper 元件
// 這樣我們測試的 useCart Hook 才能在正確的環境中運作
const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return <CartProvider>{children}</CartProvider>;
};

describe('useCart hook: addItem', () => {
    // 在每個測試後清除 localStorage，確保測試之間互相獨立
    afterEach(() => {
        localStorage.clear();
    });

    // 測試案例 1: 成功將一個新商品加入購物車
    it('should add a new item to the cart', () => {
        // 執行 (Act): 使用 renderHook 來渲染 useCart，並傳入我們的 Wrapper
        const { result } = renderHook(() => useCart(), { wrapper: AllTheProviders });

        // 準備要加入的商品
        const productToAdd: CartItem = {
            pid: 'p001',
            quantity: 1,
            price: 150,
            name: '測試商品',
            name_en: 'Test Product',
        };

        // 執行會更新狀態的動作時，必須包在 act() 中
        act(() => {
            result.current.addItem(productToAdd);
        });

        // 斷言 (Assert): 驗證購物車狀態是否正確更新
        // 1. 驗證購物車中的商品總數
        expect(result.current.cart.totalItems).toBe(1);
        // 2. 驗證購物車總金額 (150 + 30運費)
        expect(result.current.cart.totalPrice).toBe(180);
        // 3. 驗證商品陣列中包含了我們剛加入的商品
        expect(result.current.items[0].pid).toBe('p001');
    });

    // 測試案例 2: 加入同一個商品兩次，數量應該要增加
    it('should increment quantity when adding an existing item', () => {
        const { result } = renderHook(() => useCart(), { wrapper: AllTheProviders });

        const productToAdd: CartItem = {
            pid: 'p001',
            quantity: 1,
            price: 150,
            name: '測試商品',
            name_en: 'Test Product',
        };

        // 第一次加入
        act(() => {
            result.current.addItem(productToAdd);
        });

        // 第二次加入同一個商品
        act(() => {
            result.current.addItem(productToAdd);
        });

        // 斷言 (Assert):
        // 1. 驗證商品總數應為 2 (1+1)
        expect(result.current.cart.totalItems).toBe(2);
        // 2. 驗證購物車中只有一種類型的商品
        expect(result.current.items).toHaveLength(1);
        // 3. 驗證該商品的數量是 2
        expect(result.current.items[0].quantity).toBe(2);
        // 4. 驗證總金額 (150*2 + 30運費)
        expect(result.current.cart.totalPrice).toBe(330);
    });
});