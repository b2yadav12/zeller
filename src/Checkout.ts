import { PricingRule } from './rules/Rule';
import { productCatalog } from './productCatalog';

export class Checkout {
  private items: Record<string, number> = {};

  constructor(private rules: PricingRule[]) {}

  scan(sku: string): void {
    if (!productCatalog[sku]) {
      throw new Error(`Unknown SKU: ${sku}`);
    }
    this.items[sku] = (this.items[sku] || 0) + 1;
  }

  total(): number {
    let total = 0;

    for (const [sku, qty] of Object.entries(this.items)) {
      const product = productCatalog[sku];
      const regularTotal = product.price * qty;

      // Try all rules and get the cheapest total
      const discountedTotals = this.rules.map(rule =>
        rule.apply(product, qty)
      );

      const bestPrice = Math.min(regularTotal, ...discountedTotals);
      total += parseFloat(bestPrice.toFixed(2));

      console.log(`SKU: ${sku}, Quantity: ${qty}, Regular Price: $${regularTotal.toFixed(2)}, Discounted Price: $${bestPrice.toFixed(2)}`);
    }

    return parseFloat(total.toFixed(2));
  }
}
