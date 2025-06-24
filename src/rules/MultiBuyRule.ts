import { PricingRule } from './Rule';
import { productCatalog } from '../productCatalog';

type RuleConfig = {
  sku: string;
  requiredQty: number;
  chargeQty: number;
};

export class MultiBuyRule implements PricingRule {
  sku: string;
  requiredQty: number;
  chargeQty: number;

  constructor(config: RuleConfig) {
    this.sku = config.sku;
    this.requiredQty = config.requiredQty;
    this.chargeQty = config.chargeQty;
  }

  calculatePrice(qty: number): number {
    const product = productCatalog[this.sku];
    if (!product) {
      throw new Error(`Unknown SKU: ${this.sku}`);
    }

    const sets = Math.floor(qty / this.requiredQty);
    const remainder = qty % this.requiredQty;
    const totalQtyToPay = sets * this.chargeQty + remainder;

    return parseFloat((totalQtyToPay * product.price).toFixed(2));
  }
}
