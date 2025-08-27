import { addOne, findOneById } from '@/components/hooks/cart-reducer-state';
import type { CartItem } from '@/components/hooks/cart-reducer-state';
import { it } from 'node:test';

const sampleItems: CartItem[] = [
  { pid: 'p001', quantity: 1, price: 100, name: '商品1', name_en: 'P1' },
  { pid: 'p002', quantity: 2, price: 200, name: '商品2', name_en: 'P2' },
];

describe('cart-reducer-state: findOneById function', () => {
  // 成功找到存在的商品
  it('should return the correct item when pid exists', () => {
    const pidToFind = 'p001';
    const itemsAfterAdd = findOneById(sampleItems, pidToFind);

    expect(itemsAfterAdd).toBeDefined();
    expect(itemsAfterAdd?.pid).toBe(pidToFind);
    expect(itemsAfterAdd).toEqual(sampleItems[0]);
  })

  // 在「有東西」的陣列中，找不到目標
  it('should return undefined when pid does not exist', () => {
    const pidToFind = '333';
    const foundItem = findOneById(sampleItems, pidToFind);

    expect(foundItem).toBeUndefined;
  })

  // 在「空」的陣列中，找不到目標
  it('should return undefined when searching in an empty array', () => {
    const emptyItem: CartItem[] = [];
    const pidToFind = 'p001'
    const foundItem = findOneById(emptyItem, pidToFind)

    expect(foundItem).toBeUndefined();
  })
})

describe('cart-reducer-state: addOne function', () => {
  // 測試案例 1: 將一個全新的商品加入空的購物車
  // it = test, 只是影響可讀性
  it('should add a new item to an empty cart', () => {
    const initialItems: CartItem[] = [];
    const newItem: CartItem = {
      pid: 'p001',
      quantity: 1,
      price: 100,
      name: '測試商品1',
      name_en: 'Test Product 1',
    };

    const result = addOne(initialItems, newItem);

    // 期望結果: 購物車中有一個商品
    expect(result).toHaveLength(1);
    // 期望結果: 購物車中的商品就是我們剛剛加入的那個
    expect(result[0]).toEqual(newItem);
  });

  // 測試案例 2: 加入一個已存在的商品，應該只增加其數量
  it('should increase the quantity of an existing item', () => {
    const initialItems: CartItem[] = [
      {
        pid: 'p001',
        quantity: 1,
        price: 100,
        name: '測試商品1',
        name_en: 'Test Product 1',
      },
    ];
    const existingItemToAdd: CartItem = {
      pid: 'p001',
      quantity: 2, // 這次加入數量為 2
      price: 100,
      name: '測試商品1',
      name_en: 'Test Product 1',
    };

    const result = addOne(initialItems, existingItemToAdd);

    // 期望結果: 購物車中仍然只有一個商品項目
    expect(result).toHaveLength(1);
    // 期望結果: 該商品的數量應該是 1 (原始) + 2 (新增) = 3
    expect(result[0].quantity).toBe(3);
  });

  // 測試案例 3: 將一個新商品加入已有其他商品的購物車
  it('should add a new item to a cart that already has other items', () => {
    const initialItems: CartItem[] = [
      {
        pid: 'p001',
        quantity: 1,
        price: 100,
        name: '測試商品1',
        name_en: 'Test Product 1',
      },
    ];
    const newItem: CartItem = {
      pid: 'p002',
      quantity: 1,
      price: 250,
      name: '測試商品2',
      name_en: 'Test Product 2',
    };

    const result = addOne(initialItems, newItem);

    // 期望結果: 購物車現在有兩個商品項目
    expect(result).toHaveLength(2);
    // 期望結果: 可以找到 pid 為 'p002' 的新商品
    expect(result.find((item) => item.pid === 'p002')).toEqual(newItem);
  });
});
