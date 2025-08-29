import { 
  addOne, 
  findOneById,
  updateOne,
  incrementOne,
  decrementOne,
  removeOne,
  subtotalPrice,
  totalItems,
  totalPrice,
  generateCartState,
  init 
} from '@/components/hooks/cart-reducer-state';
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

    const decreasedTarget = updatedItems.find(item => item.pid === pidToFind)
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

    const decreasedTarget = updatedItems.find(item => item.pid === pidToFind)
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


describe('cart-reducer-state: removeOne function', () => {
  // 測試案例 1: 成功移除一個存在的商品
  it('should remove an existing item from a cart', () => {
    const pidToFind = 'p001';
    const updatedItems = removeOne(sampleItems, pidToFind)

    // 1. 期望結果: 購物車現在移除一個後(原兩個), 最後只剩一個商品項目
    expect(updatedItems).toHaveLength(1);
    // 2. 驗證陣列中是否已不存在 pid 為 'p001' 的商品
    expect(updatedItems.find(item => item.pid === pidToFind)).toBeUndefined();
    // 3. 期望結果: 可找到 pid 為 'p002' 的舊商品
    expect(updatedItems.find((item) => item.pid === 'p002')).toEqual(sampleItems[1]);
  })

  // 測試案例 2: 空的購物車移除也還是為空
  it('should remove a item from an empty cart', () => {
    const emptyItems: CartItem[] = []
    const pidToFind = 'p001';
    const updatedItems = removeOne(emptyItems, pidToFind)

    // 期望結果: 對空購物車使用移除, 永遠為空
    expect(updatedItems).toHaveLength(0);
    expect(updatedItems).toEqual([]); // 更嚴謹
  })

  // 測試案例 3: 嘗試移除一個不存在的商品
  it('should return the original array if item to remove is not found', () => {
    // 安排 (Arrange): 一個不存在的 pid
    const nonExistentPid = 'p999';

    // 執行 (Act): 呼叫函式
    const updatedItems = removeOne(sampleItems, nonExistentPid);

    // 斷言 (Assert):
    // 1. 驗證回傳的陣列應與原始陣列完全相同
    expect(updatedItems).toEqual(sampleItems);
    // 2. 驗證陣列長度仍然是 2
    expect(updatedItems).toHaveLength(2);
  });

})


describe('cart-reducer-state: subtotalPrice function', () => {
  it('should return correct subtotal from item.price * item.quantity', () => {
    const updatedItems = subtotalPrice(sampleItems)

    expect(updatedItems[0].subtotal).toBe(100) // 100*1
    expect(updatedItems[1].subtotal).toBe(400) // 200*2
  })

  it('should not mutate the original items array', () => {
    const original = [...sampleItems]
    subtotalPrice(sampleItems)
    expect(sampleItems).toEqual(original)
  })

  it('should return empty array if no items', () => {
    const updatedItems = subtotalPrice([])

    expect(updatedItems).toEqual([])
  })
})


describe('cart-reducer-state: totalItems function', () => {
  it('should return correct amount of totalItems', () => {
    const updatedItems = totalItems(sampleItems)

    expect(updatedItems).toBe(3)
  })

  it('should return 0 if no items', () => {
    const updatedItems = totalItems([])

    expect(updatedItems).toEqual(0)
  })
})


describe('cart-reducer-state: totalPrice function', () => {
  it('should return correct price of totalPrice', () => {
    const updatedItems = totalPrice(sampleItems)

    expect(updatedItems).toBe(530)
  })

  it('should return 0 if no items', () => {
    const updatedItems = totalItems([])

    expect(updatedItems).toEqual(0)
  })
})


describe('cart-reducer-state: generateCartState function', () => {
  // 安排 (Arrange): 
  // 測試案例 1: 測試有商品的購物車狀態是否計算正確
  it('should return the correct state for a cart with items', () => {
    // 2. 準備一個要傳入的、可選的 state 物件，用來測試屬性覆蓋
    const incomingState = {
      items: [],
      isEmpty: true,
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
    };

    // 執行 (Act): 呼叫 generateCartState 函式
    const finalState = generateCartState(incomingState, sampleItems);

    // 斷言 (Assert): 逐一驗證回傳狀態物件中的每一個屬性
    // 1. 驗證 isEmpty 應為 false
    expect(finalState.isEmpty).toBe(false);

    // 2. 驗證 totalItems 應為 2 + 1 = 3
    expect(finalState.totalItems).toBe(3);

    // 3. 驗證 totalPrice 應為 (2*100 + 1*300) + 30(運費) = 530
    expect(finalState.totalPrice).toBe(530);

    // 4. 驗證 items 陣列的長度，以及第一個商品的 subtotal 是否被正確計算
    expect(finalState.items).toHaveLength(2);
    expect(finalState.items[0].subtotal).toBe(100);
    expect(finalState.items[1].subtotal).toBe(400);
  });

  // 測試案例 2: 測試空購物車的狀態
  it('should return the correct state for an empty cart', () => {
    // 安排 (Arrange): 一個空的商品陣列
    const items: CartItem[] = [];

    // 執行 (Act): 呼叫函式
    const finalState = generateCartState({}, items);

    // 斷言 (Assert):
    // 1. 驗證 isEmpty 應為 true
    expect(finalState.isEmpty).toBe(true);
    // 2. 驗證 totalItems 應為 0
    expect(finalState.totalItems).toBe(0);
    // 3. 驗證 items 陣列是空的
    expect(finalState.items).toEqual([]);
  });
});
