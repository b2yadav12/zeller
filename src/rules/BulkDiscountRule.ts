import { PricingRule } from './Rule';
import { productCatalog } from '../productCatalog';

type RuleConfig = {
  sku: string;
  minQty: number;
  discountedPrice: number;
};

export class BulkDiscountRule implements PricingRule {
  sku: string;
  minQty: number;
  discountedPrice: number;

  constructor(config: RuleConfig) {
    this.sku = config.sku;
    this.minQty = config.minQty;
    this.discountedPrice = config.discountedPrice;
  }

  calculatePrice(qty: number): number {
    const product = productCatalog[this.sku];
    if (!product) {
      throw new Error(`Unknown SKU: ${this.sku}`);
    }
    const useDiscount = qty >= this.minQty;
    const price = useDiscount ? this.discountedPrice : product.price;
    return parseFloat((qty * price).toFixed(2));
  }
}