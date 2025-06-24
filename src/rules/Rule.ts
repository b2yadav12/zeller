import { Product } from '../models/Product';

export interface PricingRule {
  calculatePrice(qty: number): number;
}
