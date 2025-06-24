import { PricingRule } from './Rule';
import { Product } from '../models/Product';

type RuleConfig = {
  minQty: number;
  discountedPrice: number;
};

export class BulkDiscountRule implements PricingRule {
  private rules: Map<string, RuleConfig> = new Map();

  addRule(sku: string, minQty: number, discountedPrice: number): void {
    this.rules.set(sku, { minQty, discountedPrice });
  }

  apply(item: Product, qty: number): number {
    const sku = item.sku;
    const rule = this.rules.get(sku);

    if (!rule) {
      return parseFloat((item.price * qty).toFixed(2));
    }

    const useDiscount = qty >= rule.minQty;
    const price = useDiscount ? rule.discountedPrice : item.price;
    return parseFloat((qty * price).toFixed(2));
  }
}