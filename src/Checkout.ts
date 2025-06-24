import { productCatalog } from './productCatalog';

export class Checkout {
  private items: Record<string, number> = {};

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

      // Try all offer and get the cheapest total
      const discountedTotals = product.offers?.map(offer =>
        offer.calculatePrice(qty)
      ) || [];

      const bestPrice = Math.min(regularTotal, ...discountedTotals);
      total += parseFloat(bestPrice.toFixed(2));

      console.log(`SKU: ${sku}, Quantity: ${qty}, Regular Price: $${regularTotal.toFixed(2)}, Discounted Price: $${bestPrice.toFixed(2)}`);
    }

    return parseFloat(total.toFixed(2));
  }
}
