const VENDOR_PRODUCTS_KEY = 'vendor-workspace-products';
const VENDOR_PRODUCT_DRAFT_KEY = 'vendor-workspace-product-draft';

const defaultProducts = [
  {
    id: 'vprod-1',
    sku: 'SET-DRS-101',
    name: 'Satin Evening Dress',
    description: 'Fluid satin occasion dress with clean drape and elevated evening silhouette.',
    category: 'Dresses',
    brand: 'SET Atelier',
    basePrice: 84,
    salePrice: 74,
    stock: 22,
    status: 'Active',
    tags: ['occasion', 'evening', 'satin'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Emerald'],
    images: ['Lookbook hero', 'Back detail', 'Fabric close-up'],
    createdAt: '2026-04-10T11:00:00.000Z',
    updatedAt: '2026-04-21T09:30:00.000Z',
  },
  {
    id: 'vprod-2',
    sku: 'SET-TOP-204',
    name: 'Tailored Blazer',
    description: 'Structured blazer for desk-to-dinner styling with polished shoulder shape.',
    category: 'Outerwear',
    brand: 'SET Studio',
    basePrice: 66,
    salePrice: 0,
    stock: 7,
    status: 'Low Stock',
    tags: ['blazer', 'tailored'],
    sizes: ['M', 'L'],
    colors: ['Stone'],
    images: ['Front look', 'Detail lapel'],
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-22T14:00:00.000Z',
  },
  {
    id: 'vprod-3',
    sku: 'SET-BAG-008',
    name: 'Mini Leather Bag',
    description: 'Compact carry piece with structured body and detachable chain strap.',
    category: 'Accessories',
    brand: 'SET Leather',
    basePrice: 48,
    salePrice: 42,
    stock: 31,
    status: 'Active',
    tags: ['bag', 'leather', 'mini'],
    sizes: ['One Size'],
    colors: ['Burgundy', 'Black'],
    images: ['Front bag', 'Inside view'],
    createdAt: '2026-03-28T12:00:00.000Z',
    updatedAt: '2026-04-18T12:30:00.000Z',
  },
  {
    id: 'vprod-4',
    sku: 'SET-SHO-911',
    name: 'Square Heel Sandals',
    description: 'Square-toe heel with soft straps for occasion dressing and weekend wear.',
    category: 'Shoes',
    brand: 'SET Walk',
    basePrice: 57,
    salePrice: 0,
    stock: 0,
    status: 'Out of Stock',
    tags: ['shoes', 'heels'],
    sizes: ['37', '38', '39'],
    colors: ['Cream'],
    images: ['Pair shot'],
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-20T16:10:00.000Z',
  },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeProduct(product) {
  const salePrice = Number(product.salePrice || 0);
  const basePrice = Number(product.basePrice || 0);
  const stock = Number(product.stock || 0);

  let status = product.status || 'Draft';
  if (status !== 'Draft' && status !== 'Archived') {
    if (stock <= 0) status = 'Out of Stock';
    else if (stock <= 10) status = 'Low Stock';
    else status = 'Active';
  }

  return {
    id: product.id || `vprod-${Date.now()}`,
    sku: String(product.sku || '').trim(),
    name: String(product.name || '').trim(),
    description: String(product.description || '').trim(),
    category: String(product.category || '').trim(),
    brand: String(product.brand || '').trim(),
    basePrice,
    salePrice,
    stock,
    status,
    tags: Array.isArray(product.tags) ? product.tags : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    images: Array.isArray(product.images) ? product.images : [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getVendorWorkspaceProducts() {
  const existing = readJson(VENDOR_PRODUCTS_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    writeJson(VENDOR_PRODUCTS_KEY, defaultProducts);
    return defaultProducts;
  }
  const normalized = existing.map(normalizeProduct);
  writeJson(VENDOR_PRODUCTS_KEY, normalized);
  return normalized;
}

export function saveVendorWorkspaceProducts(products) {
  writeJson(VENDOR_PRODUCTS_KEY, products.map(normalizeProduct));
}

export function getVendorWorkspaceProductById(productId) {
  return getVendorWorkspaceProducts().find((product) => product.id === productId) || null;
}

export function createVendorWorkspaceProduct(payload) {
  const products = getVendorWorkspaceProducts();
  const created = normalizeProduct({ ...payload, id: `vprod-${Date.now()}` });
  const nextProducts = [created, ...products];
  saveVendorWorkspaceProducts(nextProducts);
  return created;
}

export function updateVendorWorkspaceProduct(productId, payload) {
  const products = getVendorWorkspaceProducts();
  let updatedProduct = null;
  const nextProducts = products.map((product) => {
    if (product.id !== productId) return product;
    updatedProduct = normalizeProduct({ ...product, ...payload, id: product.id, createdAt: product.createdAt });
    return updatedProduct;
  });
  saveVendorWorkspaceProducts(nextProducts);
  return updatedProduct;
}

export function saveVendorProductDraft(draft) {
  writeJson(VENDOR_PRODUCT_DRAFT_KEY, draft);
}

export function getVendorProductDraft() {
  return readJson(VENDOR_PRODUCT_DRAFT_KEY, null);
}

export function clearVendorProductDraft() {
  localStorage.removeItem(VENDOR_PRODUCT_DRAFT_KEY);
}
