import { MultiBuyRule } from '../../src/rules/MultiBuyRule';
import { Product } from '../../src/models/Product';
import { productCatalog } from '../../src/productCatalog';

describe('MultiBuyRule', () => {
  beforeEach(() => {
    // Reset productCatalog['atv'] for test isolation
    productCatalog['atv'] = new Product({ sku: 'atv', name: 'Apple TV', price: 50 });
  });

  it('returns regular price when qty < requiredQty', () => {
    const rule = new MultiBuyRule({ sku: 'atv', requiredQty: 3, chargeQty: 2 });
    const total = rule.calculatePrice(2);
    expect(total).toBeCloseTo(2 * 50, 2);
  });

  it('applies "3 for 2" correctly', () => {
    const rule = new MultiBuyRule({ sku: 'atv', requiredQty: 3, chargeQty: 2 });
    const total = rule.calculatePrice(3);
    expect(total).toBeCloseTo(2 * 50, 2);
  });

  it('applies "3 for 2" + remainder', () => {
    const rule = new MultiBuyRule({ sku: 'atv', requiredQty: 3, chargeQty: 2 });
    const total = rule.calculatePrice(4); // 3 = pay for 2, 1 = pay normally
    expect(total).toBeCloseTo((2 + 1) * 50, 2);
  });

  it('handles multiple complete sets', () => {
    const rule = new MultiBuyRule({ sku: 'atv', requiredQty: 3, chargeQty: 2 });
    const total = rule.calculatePrice(6); // 2 sets of "3 for 2"
    expect(total).toBeCloseTo(4 * 50, 2);
  });

  it('throws error for unknown SKU', () => {
    const rule = new MultiBuyRule({ sku: 'unknown', requiredQty: 3, chargeQty: 2 });
    expect(() => rule.calculatePrice(3)).toThrow('Unknown SKU: unknown');
  });
});
