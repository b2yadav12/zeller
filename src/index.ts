import { Checkout } from './Checkout';
import { BulkDiscountRule } from './rules/BulkDiscountRule';
import { MultiBuyRule } from './rules/MultiBuyRule';
import { productCatalog } from './productCatalog';

const { atv, ipd, vga } = productCatalog;

const ipdBulkRule = new BulkDiscountRule({
  sku: ipd.sku,
  minQty: 3,
  discountedPrice: 10, // Price per unit when buying 3 or more iPads
});

ipd.addOffer(ipdBulkRule);

const atvMultiBuyRule = new MultiBuyRule({
  sku: atv.sku,
  requiredQty: 3,
  chargeQty: 2, // Pay for 2 Apple TVs when buying 3
});

atv.addOffer(atvMultiBuyRule);

// Adding & removing offers for iPad For Testing
const ipdBulkOffer2 = new BulkDiscountRule({
  sku: ipd.sku,
  minQty: 2,
  discountedPrice: 1,
});
ipd.addOffer(ipdBulkOffer2);
ipd.removeOffer(ipdBulkOffer2);

const checkout = new Checkout()

checkout.scan(atv.sku);
checkout.scan(atv.sku);
checkout.scan(atv.sku);
checkout.scan(vga.sku);
checkout.scan(ipd.sku);
checkout.scan(ipd.sku);
checkout.scan(ipd.sku);

const actualTotal = checkout.total();

console.log(`Total: $${actualTotal}`);
