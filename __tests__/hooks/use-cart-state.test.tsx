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

const sampleItems: CartItem[] = [
    { pid: 'p001', quantity: 1, price: 100, name: '商品1', name_en: 'P1' },
    { pid: 'p002', quantity: 2, price: 200, name: '商品2', name_en: 'P2' },
];

describe('useCart hook: addItem', () => {
    // 在每個測試後清除 localStorage，確保測試之間互相獨立
    afterEach(() => {
        localStorage.clear();
    });

    // 測試案例 1: 成功將一個新商品加入購物車
    it('should add a new item to the cart', () => {
        // 執行 (Act): 使用 renderHook 來渲染 useCart，並傳入我們的 Wrapper
        const { result } = renderHook(() => useCart(), { wrapper: AllTheProviders });

        // 執行會更新狀態的動作時，必須包在 act() 中
        act(() => {
            result.current.addItem(sampleItems[0]);
        });

        // 斷言 (Assert): 驗證購物車狀態是否正確更新
        // 1. 驗證購物車中的商品總數
        expect(result.current.cart.totalItems).toBe(1);
        // 2. 驗證購物車總金額 (100 + 30運費)
        expect(result.current.cart.totalPrice).toBe(130);
        // 3. 驗證商品陣列中包含了我們剛加入的商品
        expect(result.current.items[0].pid).toBe('p001');
    });

    // 測試案例 2: 加入同一個商品兩次，數量應該要增加
    it('should increment quantity when adding an existing item', () => {
        const { result } = renderHook(() => useCart(), { wrapper: AllTheProviders });

        // 第一次加入
        act(() => {
            result.current.addItem(sampleItems[0]);
        });

        // 第二次加入同一個商品
        act(() => {
            result.current.addItem(sampleItems[0]);
        });

        // 斷言 (Assert):
        // 1. 驗證商品總數應為 2 (1+1)
        expect(result.current.cart.totalItems).toBe(2);
        // 2. 驗證購物車中只有一種類型的商品
        expect(result.current.items).toHaveLength(1);
        // 3. 驗證該商品的數量是 2
        expect(result.current.items[0].quantity).toBe(2);
        // 4. 驗證總金額 (100*2 + 30運費)
        expect(result.current.cart.totalPrice).toBe(230);
    });
});


describe('useCart hook: removeItem', () => {
    let result: { current: ReturnType<typeof useCart> };

    // 在每個測試前，都重新渲染 Hook
    beforeEach(() => {
        const { result: hookResult } = renderHook(() => useCart(), { wrapper: AllTheProviders });
        result = hookResult;
    });

    // 在每個測試後清除 localStorage，確保測試之間互相獨立
    afterEach(() => {
        localStorage.clear();
    });

    // 測試案例 1: 成功將一個商品從購物車移除
    it('should remove an item from the cart', () => {
        // Arrange: 先加入一個商品
        act(() => {
            result.current.addItem(sampleItems[0]);
        });

        // Act: 移除該商品
        act(() => {
            result.current.removeItem(sampleItems[0].pid);
        });

        // Assert: 驗證購物車為空，但保留運費
        expect(result.current.cart.totalItems).toBe(0);
        expect(result.current.cart.items).toEqual([]);
        expect(result.current.cart.totalPrice).toBe(30); // 剩下運費
    });

    // 測試案例 2: 從空購物車移除商品時，購物車應保持為空
    it('should keep the cart empty when removing from an empty cart', () => {
        // Act: 從空購物車移除
        act(() => {
            result.current.removeItem(sampleItems[0].pid);
        });

        // Assert: 驗證購物車仍然是空的
        expect(result.current.cart.totalItems).toBe(0);
        expect(result.current.cart.items).toEqual([]);
        expect(result.current.cart.totalPrice).toBe(30);
    });

    // 測試案例 3: 從有多個商品的購物車中，只移除其中一個
    it('should remove only one item from a cart with multiple items', () => {
        // Arrange: 加入兩個不同的商品
        act(() => {
            result.current.addItem(sampleItems[0]); // price: 100, quantity: 1
            result.current.addItem(sampleItems[1]); // price: 200, quantity: 2
        });

        // Act: 移除第一個商品
        act(() => {
            result.current.removeItem(sampleItems[0].pid);
        });

        // Assert: 驗證第一個商品被移除，第二個商品還在
        expect(result.current.cart.items).toHaveLength(1);
        expect(result.current.cart.items[0].pid).toBe(sampleItems[1].pid);
        expect(result.current.cart.totalItems).toBe(2); // 第二個商品的數量
        expect(result.current.cart.totalPrice).toBe(200 * 2 + 30); // 430
    });

    // 測試案例 4: 嘗試移除不存在的商品時，購物車不應有任何改變
    it('should not change the cart when removing a non-existent item', () => {
        // Arrange: 加入一個商品
        act(() => {
            result.current.addItem(sampleItems[0]); // price: 100, quantity: 1
        });

        // Act: 嘗試移除一個不存在的商品
        act(() => {
            result.current.removeItem('p999');
        });

        // Assert: 驗證購物車狀態沒有改變
        expect(result.current.cart.items).toHaveLength(1);
        expect(result.current.cart.totalItems).toBe(1);
        expect(result.current.cart.totalPrice).toBe(100 * 1 + 30); // 130
    });
});