import { Product } from './models/Product';

export const productCatalog: Record<string, Product> = {
  atv: new Product({ sku: 'atv', name: 'Apple TV', price: 50 }),
  ipd: new Product({ sku: 'ipd', name: 'Super iPad', price: 20 }),
  mbp: new Product({ sku: 'mbp', name: 'MacBook Pro', price: 30 }),
  vga: new Product({ sku: 'vga', name: 'VGA adapter', price: 5 }),
};
