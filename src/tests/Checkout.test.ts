import { Checkout } from '../Checkout';
import { Product } from '../models/Product';
import { productCatalog } from '../productCatalog';
import { BulkDiscountRule } from '../rules/BulkDiscountRule';
import { MultiBuyRule } from '../rules/MultiBuyRule';

describe('Checkout', () => {
  beforeEach(() => {
    // Reset catalog to ensure clean test state
    productCatalog['atv'] = new Product({ sku: 'atv', name: 'Apple TV', price: 50 });
    productCatalog['ipd'] = new Product({ sku: 'ipd', name: 'Super iPad', price: 20 });
    productCatalog['mbp'] = new Product({ sku: 'mbp', name: 'MacBook Pro', price: 30 });
    productCatalog['vga'] = new Product({ sku: 'vga', name: 'VGA adapter', price: 5 });
  });

  it('calculates total with no offers', () => {
    const co = new Checkout();
    co.scan('mbp');
    co.scan('vga');
    expect(co.total()).toBeCloseTo(30 + 5, 2);
  });

  it('applies bulk discount rule (5 iPads)', () => {
    const bulkRule = new BulkDiscountRule({ sku: 'ipd', minQty: 4, discountedPrice: 15 });
    productCatalog['ipd'].addOffer(bulkRule);

    const co = new Checkout();
    for (let i = 0; i < 5; i++) co.scan('ipd');

    expect(co.total()).toBeCloseTo(5 * 15, 2);
  });

  it('applies multi-buy rule (3-for-2 Apple TVs)', () => {
    const multiBuy = new MultiBuyRule({ sku: 'atv', requiredQty: 3, chargeQty: 2 });
    productCatalog['atv'].addOffer(multiBuy);

    const co = new Checkout();
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');

    expect(co.total()).toBeCloseTo(2 * 50, 2); // Pay for 2
  });

  it('applies cheapest rule if multiple offers exist', () => {
    const bulkRule = new BulkDiscountRule({ sku: 'ipd', minQty: 3, discountedPrice: 17 });
    const multiBuy = new MultiBuyRule({ sku: 'ipd', requiredQty: 3, chargeQty: 2 });

    productCatalog['ipd'].addOffer(bulkRule);
    productCatalog['ipd'].addOffer(multiBuy);

    const co = new Checkout();
    for (let i = 0; i < 3; i++) co.scan('ipd');

    // Regular: 3 * 20 = 60
    // Bulk:    3 * 17 = 51
    // MultiBuy: pay for 2 = 2 * 20 = 40 (cheapest)

    expect(co.total()).toBeCloseTo(40, 2);
  });

  it('throws error for unknown SKU', () => {
    const co = new Checkout();
    expect(() => co.scan('unknown')).toThrow('Unknown SKU: unknown');
  });
});
