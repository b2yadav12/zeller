import { Product } from '../models/Product';

export interface PricingRule {
  apply(item: Product, qty: number): number;
}
