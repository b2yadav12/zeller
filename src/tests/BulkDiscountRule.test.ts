import { BulkDiscountRule } from '../../src/rules/BulkDiscountRule';
import { productCatalog } from '../../src/productCatalog';
import { Product } from '../../src/models/Product';

describe('BulkDiscountRule', () => {
  beforeEach(() => {
    productCatalog['ipd'] = new Product({ sku: 'ipd', name: 'Super iPad', price: 20 });
  });

  it('should return regular price if quantity < minQty', () => {
    const rule = new BulkDiscountRule({ sku: 'ipd', minQty: 3, discountedPrice: 15 });
    const total = rule.calculatePrice(2);
    expect(total).toBeCloseTo(2 * 20, 2);
  });

  it('should apply discounted price if quantity >= minQty', () => {
    const rule = new BulkDiscountRule({ sku: 'ipd', minQty: 3, discountedPrice: 15 });
    const total = rule.calculatePrice(3);
    expect(total).toBeCloseTo(3 * 15, 2);
  });

  it('should throw error for unknown SKU', () => {
    const rule = new BulkDiscountRule({ sku: 'unknown', minQty: 2, discountedPrice: 10 });
    expect(() => rule.calculatePrice(2)).toThrow('Unknown SKU: unknown');
  });
});
