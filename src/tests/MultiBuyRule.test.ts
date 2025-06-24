import { MultiBuyRule } from '../rules/MultiBuyRule';
import { Product } from '../models/Product';

describe('MultiBuyRule', () => {
  let rule: MultiBuyRule;
  let product: Product;

  beforeEach(() => {
    rule = new MultiBuyRule();
    product = { sku: 'A', price: 50, name: 'Product A' };
  });

  test('should return regular price when no rule exists for SKU', () => {
    const result = rule.apply(product, 3);
    expect(result).toBe(150.00);
  });

  test('should apply regular price when quantity is less than requiredQty', () => {
    rule.addRule('A', 3, 2);
    const result = rule.apply(product, 2);
    expect(result).toBe(100.00);
  });

  test('should apply multi-buy discount for exact requiredQty', () => {
    rule.addRule('A', 3, 2);
    const result = rule.apply(product, 3);
    expect(result).toBe(100.00); // Pay for 2 items instead of 3
  });

  test('should apply multi-buy discount for multiple sets and remainder', () => {
    rule.addRule('A', 3, 2);
    const result = rule.apply(product, 7);
    expect(result).toBe(250.00); // 2 sets (4 items paid) + 1 remainder = 5 items paid
  });

  test('should handle different SKUs independently', () => {
    const productB = { sku: 'B', price: 30, name: 'Product B' };
    rule.addRule('A', 3, 2);
    rule.addRule('B', 2, 1);

    expect(rule.apply(product, 3)).toBe(100.00); // Pay for 2 items for A
    expect(rule.apply(productB, 2)).toBe(30.00); // Pay for 1 item for B
    expect(rule.apply(product, 1)).toBe(50.00); // Regular price for A
    expect(rule.apply(productB, 1)).toBe(30.00); // Regular price for B
  });

  test('should handle decimal prices correctly', () => {
    const productC = { sku: 'C', price: 19.99, name: 'Product C' };
    rule.addRule('C', 2, 1);

    expect(rule.apply(productC, 1)).toBe(19.99);
    expect(rule.apply(productC, 2)).toBe(19.99); // Pay for 1 item
    expect(rule.apply(productC, 3)).toBe(39.98); // Pay for 1 (set) + 1 (remainder)
  });

  test('should update rule for existing SKU', () => {
    rule.addRule('A', 3, 2);
    rule.addRule('A', 4, 3); // Update rule for SKU A

    expect(rule.apply(product, 4)).toBe(150.00); // Pay for 3 items
    expect(rule.apply(product, 3)).toBe(150.00); // Regular price for 3 items
  });
});
