import { Product } from './models/Product';

export const productCatalog: Record<string, Product> = {
  atv: { sku: 'atv', name: 'Apple TV', price: 12 },
  ipd: { sku: 'ipd', name: 'Super iPad', price: 20 },
  mbp: { sku: 'mbp', name: 'MacBook Pro', price: 30 },
  vga: { sku: 'vga', name: 'VGA adapter', price: 5 },
};
