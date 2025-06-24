import { Checkout } from './Checkout';
import { BulkDiscountRule } from './rules/BulkDiscountRule';
import { MultiBuyRule } from './rules/MultiBuyRule';
import { productCatalog } from './productCatalog';

const { atv, ipd, vga } = productCatalog;

const bulkRule = new BulkDiscountRule();
bulkRule.addRule(ipd.sku, 4, 10); // iPad bulk discount

const multiBuyRule = new MultiBuyRule();
multiBuyRule.addRule(atv.sku, 3, 2); // 3-for-2 Apple TV

const checkout = new Checkout([bulkRule, multiBuyRule])

checkout.scan(atv.sku);
checkout.scan(atv.sku);
checkout.scan(atv.sku);
checkout.scan(vga.sku);

const actualTotal = checkout.total();

console.log(`Total: $${actualTotal}`);
