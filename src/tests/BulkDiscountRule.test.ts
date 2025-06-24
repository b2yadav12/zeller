import { BulkDiscountRule } from '../rules/BulkDiscountRule';
import { Product } from '../models/Product';

describe('BulkDiscountRule', () => {
  let rule: BulkDiscountRule;
  let product: Product;

  beforeEach(() => {
    rule = new BulkDiscountRule();
    product = { sku: 'A', price: 50, name: 'Product A' };
  });

  test('should return regular price when no rule exists for SKU', () => {
    const result = rule.apply(product, 3);
    expect(result).toBe(150.00);
  });

  test('should apply regular price when quantity is less than or equal to minQty', () => {
    rule.addRule('A', 3, 45);
    const result = rule.apply(product, 2);
    expect(result).toBe(100.00);
  });

  test('should apply discounted price when quantity exceeds minQty', () => {
    rule.addRule('A', 3, 45);
    const result = rule.apply(product, 4);
    expect(result).toBe(180.00);
  });

  test('should handle different SKUs independently', () => {
    const productB = { sku: 'B', price: 30, name: 'Product B' };
    rule.addRule('A', 3, 45);
    rule.addRule('B', 2, 25);

    expect(rule.apply(product, 4)).toBe(180.00); // Discounted price for A
    expect(rule.apply(productB, 3)).toBe(75.00); // Discounted price for B
    expect(rule.apply(product, 1)).toBe(50.00); // Regular price for A
    expect(rule.apply(productB, 1)).toBe(30.00); // Regular price for B
  });

  test('should handle decimal prices correctly', () => {
    const productC = { sku: 'C', price: 19.99, name: 'Product C' };
    rule.addRule('C', 2, 15.99);
    
    expect(rule.apply(productC, 1)).toBe(19.99);
    expect(rule.apply(productC, 3)).toBe(47.97);
  });

  test('should update rule for existing SKU', () => {
    rule.addRule('A', 3, 45);
    rule.addRule('A', 2, 40); // Update rule for SKU A

    expect(rule.apply(product, 2)).toBe(80.00); // New discounted price
    expect(rule.apply(product, 1)).toBe(50.00); // Regular price
  });
});