import { PricingRule } from '../rules/Rule';

export interface ProductType {
  sku: string;
  name: string;
  price: number;
  offers?: PricingRule[];
}

export class Product implements ProductType {
  sku: string;
  name: string;
  price: number;
  offers?: PricingRule[];

  constructor(prd: ProductType, offers?: PricingRule[]) {
    const { sku, name, price } = prd;
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.offers = offers || [];
  }

  addOffer(offer: PricingRule): void {
    this.offers?.push(offer);
  }

  removeOffer(offer: PricingRule): void {
    this.offers = this.offers?.filter(o => o !== offer);
  }
}
