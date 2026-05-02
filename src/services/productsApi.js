import { mockProducts } from '../data/mockProducts';
import { getVariantStock, initializeInventory } from '../utils/commerceStorage';
import { enrichProduct } from '../utils/productOptions';

function mapProduct(product) {
  const base = enrichProduct({
    id: product.id,
    title: product.title,
    category: product.category,
    price: Number(product.price),
    image: product.image,
    rating: Number(product?.rating?.rate ?? product.rating ?? 0),
    description: product.description || 'Product description',
  });

  initializeInventory(base.variants);

  return {
    ...base,
    variants: base.variants.map((variant) => ({ ...variant, stock: getVariantStock(variant.sku, variant.stock) })),
  };
}

export async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error(`Failed to fetch products. Status: ${response.status}`);
    const data = await response.json();
    return data.map(mapProduct);
  } catch {
    return mockProducts.map(mapProduct);
  }
}

export async function fetchProductById(productId) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) throw new Error(`Failed to fetch product details. Status: ${response.status}`);
    const data = await response.json();
    return mapProduct(data);
  } catch {
    const fallback = mockProducts.find((item) => String(item.id) === String(productId)) || mockProducts[0];
    return mapProduct(fallback);
  }
}
