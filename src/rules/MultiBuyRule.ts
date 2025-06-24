import { PricingRule } from './Rule';
import { Product } from '../models/Product';

type RuleConfig = {
  requiredQty: number;
  chargeQty: number;
};

export class MultiBuyRule implements PricingRule {
  private rules: Map<string, RuleConfig> = new Map();

  addRule(sku: string, requiredQty: number, chargeQty: number): void {
    this.rules.set(sku, { requiredQty, chargeQty });
  }

  apply(item: Product, qty: number): number {
    const sku = item.sku;
    const rule = this.rules.get(sku);

    if (!rule) {
      return parseFloat((item.price * qty).toFixed(2));
    }

    const sets = Math.floor(qty / rule.requiredQty);
    const remainder = qty % rule.requiredQty;
    const totalQtyToPay = sets * rule.chargeQty + remainder;

    return parseFloat((totalQtyToPay * item.price).toFixed(2));
  }
}
