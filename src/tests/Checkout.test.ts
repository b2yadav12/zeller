import { Checkout } from '../Checkout';
import { BulkDiscountRule } from '../rules/BulkDiscountRule';
import { MultiBuyRule } from '../rules/MultiBuyRule';

// Mock product catalog
jest.mock('../productCatalog', () => ({
  productCatalog: {
    A: { sku: 'A', price: 50, name: 'Product A' },
    B: { sku: 'B', price: 30, name: 'Product B' },
    C: { sku: 'C', price: 19.99, name: 'Product C' },
  },
}));

describe('Checkout', () => {
  let checkout: Checkout;
  let bulkDiscountRule: BulkDiscountRule;
  let multiBuyRule: MultiBuyRule;

  beforeEach(() => {
    bulkDiscountRule = new BulkDiscountRule();
    multiBuyRule = new MultiBuyRule();
    checkout = new Checkout([bulkDiscountRule, multiBuyRule]);
  });

  test('should throw error for unknown SKU', () => {
    expect(() => checkout.scan('X')).toThrow('Unknown SKU: X');
  });

  test('should calculate total for single item with no rules', () => {
    checkout.scan('A');
    expect(checkout.total()).toBe(50.00);
  });

  test('should calculate total for multiple items with no rules', () => {
    checkout.scan('A');
    checkout.scan('B');
    checkout.scan('B');
    expect(checkout.total()).toBe(110.00); // 50 + 30 + 30
  });

  test('should apply bulk discount rule when cheapest', () => {
    bulkDiscountRule.addRule('A', 3, 45);
    checkout.scan('A');
    checkout.scan('A');
    checkout.scan('A');
    expect(checkout.total()).toBe(135.00); // 3 * 45
  });

  test('should apply multi-buy rule when cheapest', () => {
    multiBuyRule.addRule('B', 2, 1);
    checkout.scan('B');
    checkout.scan('B');
    expect(checkout.total()).toBe(30.00); // Pay for 1 item
  });

  test('should choose cheapest rule for same SKU', () => {
    bulkDiscountRule.addRule('A', 3, 45); // 3 * 45 = 135
    multiBuyRule.addRule('A', 3, 2); // 2 * 50 = 100
    checkout.scan('A');
    checkout.scan('A');
    checkout.scan('A');
    expect(checkout.total()).toBe(100.00); // Multi-buy rule is cheaper
  });

  test('should handle mixed items with different rules', () => {
    bulkDiscountRule.addRule('A', 3, 45); // 3 * 45 = 135
    multiBuyRule.addRule('B', 2, 1); // 1 * 30 = 30
    checkout.scan('A');
    checkout.scan('A');
    checkout.scan('A');
    checkout.scan('B');
    checkout.scan('B');
    expect(checkout.total()).toBe(165.00); // 135 (A) + 30 (B)
  });

  test('should return zero for empty cart', () => {
    expect(checkout.total()).toBe(0.00);
  });
});
