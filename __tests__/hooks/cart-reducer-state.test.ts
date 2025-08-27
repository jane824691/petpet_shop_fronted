import { addOne, findOneById, updateOne, incrementOne, decrementOne } from '@/components/hooks/cart-reducer-state';
import type { CartItem } from '@/components/hooks/cart-reducer-state';

const sampleItems: CartItem[] = [
  { pid: 'p001', quantity: 1, price: 100, name: '商品1', name_en: 'P1' },
  { pid: 'p002', quantity: 2, price: 200, name: '商品2', name_en: 'P2' },
];

describe('cart-reducer-state: findOneById function', () => {
  // 測試案例 1: 成功找到存在的商品
  it('should return the correct item when pid exists', () => {
    const pidToFind = 'p001';
    const itemsAfterAdd = findOneById(sampleItems, pidToFind);

    expect(itemsAfterAdd).toBeDefined();
    expect(itemsAfterAdd?.pid).toBe(pidToFind);
    expect(itemsAfterAdd).toEqual(sampleItems[0]);
  })

  // 測試案例 2: 在「有東西」的陣列中，找不到目標
  it('should return undefined when pid does not exist', () => {
    const pidToFind = '333';
    const foundItem = findOneById(sampleItems, pidToFind);

    expect(foundItem).toBeUndefined;
  })

  // 測試案例 3: 在「空」的陣列中，找不到目標
  it('should return undefined when searching in an empty array', () => {
    const emptyItem: CartItem[] = [];
    const pidToFind = 'p001'
    const foundItem = findOneById(emptyItem, pidToFind)

    expect(foundItem).toBeUndefined();
  })
})


describe('cart-reducer-state: updateOne function', () => {

  // 測試案例 1: 成功更新商品
  it('should update an existing item correctly', () => {
    const pidToUpdate: CartItem = { pid: 'p002', quantity: 3, price: 300, name: '商品2', name_en: 'P2' };
    const itemsAfterUpdate = updateOne(sampleItems, pidToUpdate)

    expect(itemsAfterUpdate).toBeDefined();
    // 驗證 p002 商品是否真的被新資料取代了 (數量價格)
    expect(itemsAfterUpdate.find(item => item.pid === 'p002')).toEqual(pidToUpdate)
    // 驗證 p001 這個不相關的商品是否保持原樣，沒有被動到
    expect(itemsAfterUpdate.find(item => item.pid === 'p001')).toEqual(sampleItems[0])
    expect(itemsAfterUpdate).toHaveLength(2);
  })

  // 測試案例 2: 嘗試更新一個不存在的商品
  it('should update an existing item correctly', () => {
    const noExistentItem: CartItem = { pid: 'p999', quantity: 9, price: 999, name: '商品9', name_en: 'P9' };
    const itemsAfterUpdate = updateOne(sampleItems, noExistentItem)

    expect(itemsAfterUpdate).toEqual(sampleItems)
  })

  // 測試案例 3: 嘗試更新一個空的陣列
  it('should return an empty array when updating an empty array', () => {
    // 安排 (Arrange): 準備一個空的陣列和一個更新用的商品
    const emptyItem: CartItem[] = []
    const pidToUpdate: CartItem = { pid: 'p002', quantity: 3, price: 300, name: '商品2', name_en: 'P2' };
    const itemsAfterUpdate = updateOne(emptyItem, pidToUpdate)

    expect(itemsAfterUpdate).toEqual([])
    expect(itemsAfterUpdate).toHaveLength(0)
  })
})


describe('cart-reducer-state: incrementOne function', () => {
  // 測試案例: 成功更新某pid項目的數量+1
  it('should increase quantity +1 depends on pid', () => {
    const pidToFind = 'p002';
    const updatedItems = incrementOne(sampleItems, pidToFind)

    const incrementItem = updatedItems.find(item => item.pid === pidToFind)
    const unchangedItem = updatedItems.find(item => item.pid === 'p001')
    // 驗證真正要改動的數量, 有如預期改動
    expect(incrementItem?.quantity).toBe(3)
    // means pid='p002' quantity never been changed
    expect(unchangedItem?.quantity).toBe(sampleItems[0].quantity)
    expect(unchangedItem).toBe(sampleItems[0])
  })
})

describe('cart-reducer-state: decrementOne function', () => {
  it('should decrease quantity -1 depends on pid', () => {
    const pidToFind = 'p002';
    const updatedItems = decrementOne(sampleItems, pidToFind)

    const decreasedTarget = updatedItems.find( item => item.pid === pidToFind)
    const unchangedItem = updatedItems.find(item => item.pid === 'p001')
    // 測試依照某pid更新項目的數量+1
    expect(decreasedTarget?.quantity).toBe(1)
    // 未改變的其他物件, 數量測試不得被改動到
    expect(unchangedItem?.quantity).toBe(sampleItems[0].quantity) 
    expect(unchangedItem).toBe(sampleItems[0])
  })

  // 依照某pid更新項目的數量-1。最小為1, 不得為0
  it('should decrease but the smallest amount is 1 rather 0', () => {
    const pidToFind = 'p001';
    const updatedItems = decrementOne(sampleItems, pidToFind)

    const decreasedTarget = updatedItems.find( item => item.pid === pidToFind)
    expect(decreasedTarget?.quantity).not.toBe(0)
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
