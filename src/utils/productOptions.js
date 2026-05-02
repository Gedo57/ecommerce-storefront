const CATEGORY_COLOR_PRESETS = {
  "men's clothing": [
    { name: 'أسود', code: '#151515' },
    { name: 'رمادي فحمي', code: '#494949' },
    { name: 'كستنائي', code: '#6f3d2c' },
    { name: 'كاكي', code: '#9b8c6d' },
  ],
  "women's clothing": [
    { name: 'أسود', code: '#171717' },
    { name: 'أوف وايت', code: '#f4efe8' },
    { name: 'وردي غباري', code: '#c18a9c' },
    { name: 'عنابي', code: '#7c2d3b' },
  ],
  jewelery: [
    { name: 'ذهبي', code: '#d4af37' },
    { name: 'فضي', code: '#c0c0c0' },
    { name: 'روز جولد', code: '#b76e79' },
  ],
  electronics: [
    { name: 'أسود', code: '#121212' },
    { name: 'فضي', code: '#b8bcc4' },
    { name: 'أزرق ليلي', code: '#2f4d74' },
  ],
};

const CATEGORY_SIZE_PRESETS = {
  "men's clothing": ['S', 'M', 'L', 'XL', '2XL'],
  "women's clothing": ['XS', 'S', 'M', 'L', 'XL'],
  jewelery: ['One Size'],
  electronics: ['Standard'],
};

function hashCode(value = '') {
  return String(value)
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
}

function pickBySeed(items, seed, count) {
  if (!items.length) return [];
  const ordered = [...items].sort((a, b) => {
    const av = Math.abs(hashCode(`${seed}-${typeof a === 'string' ? a : a.name}`));
    const bv = Math.abs(hashCode(`${seed}-${typeof b === 'string' ? b : b.name}`));
    return av - bv;
  });
  return ordered.slice(0, Math.min(count, ordered.length));
}

function buildReviews(product) {
  const reviewTemplates = [
    'الخامة ممتازة والتفصيل طلع أفضل من المتوقع.',
    'المقاس مضبوط جداً والتغليف كان نظيف.',
    'اللون مطابق للصور وجودة المنتج واضحة.',
    'المنتج عملي ويستاهل السعر بصراحة.',
    'التجربة كانت ممتازة وسأكرر الشراء مرة ثانية.',
  ];

  const reviewers = ['Ahmed', 'Mariam', 'Nour', 'Youssef', 'Salma'];
  const seed = Math.abs(hashCode(product.title));

  return reviewTemplates.slice(0, 3).map((comment, index) => ({
    id: `${product.id}-review-${index + 1}`,
    author: reviewers[(seed + index) % reviewers.length],
    rating: Math.min(5, Math.max(4, Math.round(product.rating + (index % 2 === 0 ? 0 : 0.2)))),
    comment,
  }));
}

export function enrichProduct(product) {
  const availableColors = pickBySeed(CATEGORY_COLOR_PRESETS[product.category] || CATEGORY_COLOR_PRESETS.electronics, product.title, 3);
  const availableSizes = pickBySeed(CATEGORY_SIZE_PRESETS[product.category] || ['Standard'], product.title, CATEGORY_SIZE_PRESETS[product.category]?.length || 1);
  const baseStock = 4 + (Math.abs(hashCode(product.title)) % 9);

  const variants = availableColors.flatMap((color, colorIndex) =>
    availableSizes.map((size, sizeIndex) => ({
      sku: `SKU-${product.id}-${colorIndex + 1}-${sizeIndex + 1}`,
      color,
      size,
      stock: Math.max(1, baseStock - sizeIndex),
      image: product.image,
      imageBg: ['#f2efec', '#ebe7e2', '#f5f2ef', '#ece7e1', '#f4f1ec', '#ece8e4'][(colorIndex + sizeIndex) % 6],
    })),
  );

  return {
    ...product,
    availableColors,
    availableSizes,
    variants,
    stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
    reviews: buildReviews(product),
    reviewCount: Math.max(8, Math.round(product.rating * 37)),
  };
}

export function getDefaultSelection(product) {
  const fallbackColor = product.availableColors?.[0] || { name: 'Standard', code: '#111111' };
  const fallbackSize = product.availableSizes?.[0] || 'Standard';
  const variant = product.variants?.find((item) => item.color.name === fallbackColor.name && item.size === fallbackSize) || product.variants?.[0];

  return {
    color: variant?.color || fallbackColor,
    size: variant?.size || fallbackSize,
    sku: variant?.sku || `SKU-${product.id}-default`,
    image: variant?.image || product.image,
    imageBg: variant?.imageBg || '#f2efec',
  };
}

export function createCartItem(product, selection) {
  const resolved = selection || getDefaultSelection(product);
  return {
    ...product,
    selectedColor: resolved.color,
    selectedSize: resolved.size,
    sku: resolved.sku,
    image: resolved.image || product.image,
    imageBg: resolved.imageBg,
    cartLineId: `${product.id}::${resolved.color.name}::${resolved.size}`,
  };
}
