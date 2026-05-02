import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlistItem } from '../redux/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { getLocalizedCategoryName } from '../data/categoryCatalog';
import { useCurrency } from '../context/CurrencyContext';
import { createCartItem } from '../utils/productOptions';

const sortOptions = [
  { value: 'featured', label: 'حسب التوصية' },
  { value: 'price-low', label: 'السعر من الأقل للأعلى' },
  { value: 'price-high', label: 'السعر من الأعلى للأقل' },
  { value: 'rating-high', label: 'الأعلى تقييماً' },
];

function CategoryProductCard({ product }) {
  const { formatPrice } = useCurrency();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isWishlisted = useSelector((state) => state.wishlist.items.some((item) => item.id === product.id));

  const handleAddToCart = () => {
    dispatch(addToCart(createCartItem(product)));
    showToast({ title: 'تمت الإضافة إلى السلة', description: product.title, variant: 'success' });
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product));
    showToast({
      title: isWishlisted ? 'تمت الإزالة من المفضلة' : 'تم الحفظ في المفضلة',
      description: product.title,
    });
  };

  return (
    <article className="group overflow-hidden bg-white transition duration-300 hover:shadow-[0_10px_22px_rgba(0,0,0,0.08)]">
      <div className="relative overflow-hidden bg-[#f4f4f4]">
        <Link to={`/product/${product.id}`} className="block aspect-[0.72] overflow-hidden">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </Link>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
            isWishlisted ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black'
          }`}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="px-2 pb-3 pt-2 text-right">
        <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm leading-6 text-black hover:text-black/70">
          {product.title}
        </Link>
        <div className="mt-1 flex items-center justify-end gap-1 text-[#f5b400]">
          <span className="text-sm font-semibold">★</span>
          <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-sm text-black/60">
          <span>{getLocalizedCategoryName(product.category)}</span>
          <span className="font-black text-black">{formatPrice(product.price)}</span>
        </div>
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          {(product.availableColors || []).slice(0, 3).map((color) => (
            <span key={color.name} className="inline-flex h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.code }} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button type="button" onClick={handleAddToCart} className="inline-flex h-9 items-center rounded-full border border-black/20 px-3 text-xs font-semibold transition hover:bg-black hover:text-white">
            أضف للسلة
          </button>
          <Link to={`/product/${product.id}`} className="text-xs text-black/60 hover:text-black">
            التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="border-t border-black/10 py-4 text-right first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-lg leading-none text-black">+</span>
        <h3 className="text-sm font-bold text-black">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function CategoryListingView({ config, products }) {
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceLimit, setPriceLimit] = useState(600);

  const sizeOptions = useMemo(() => [...new Set(products.flatMap((product) => product.availableSizes || []))], [products]);
  const colorOptions = useMemo(() => {
    const map = new Map();
    products.flatMap((product) => product.availableColors || []).forEach((color) => {
      if (!map.has(color.name)) map.set(color.name, color);
    });
    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter((product) =>
        [product.title, product.description, product.category].join(' ').toLowerCase().includes(search),
      );
    }

    if (selectedSize) {
      result = result.filter((product) => (product.availableSizes || []).includes(selectedSize));
    }

    if (selectedColor) {
      result = result.filter((product) => (product.availableColors || []).some((color) => color.name === selectedColor));
    }

    result = result.filter((product) => product.price <= priceLimit);

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating || a.price - b.price);
    }

    return result;
  }, [priceLimit, products, searchTerm, selectedColor, selectedSize, sortBy]);

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-right">
            <div className="flex flex-wrap justify-end gap-2 text-sm text-black/55">
              <Link to="/" className="hover:text-black">الصفحة الرئيسية</Link>
              <span>/</span>
              <span>{config.label}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-black sm:text-3xl">{config.label}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-black/65">{config.description}</p>
          </div>

          <div className="grid gap-3 rounded-sm bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:grid-cols-3 lg:min-w-[520px]">
            <div className="text-right">
              <p className="text-xs text-black/45">النتائج</p>
              <p className="mt-1 text-lg font-black text-black">{filteredProducts.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-black/45">أسلوب العرض</p>
              <p className="mt-1 text-lg font-black text-black">شبكة المنتجات</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-black/45">الأقسام البارزة</p>
              <div className="mt-2 flex flex-wrap justify-end gap-2">
                {config.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#f1f1f1] px-3 py-1 text-xs font-medium text-black/70">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="order-2 rounded-sm bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)] lg:order-1 lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-sm border border-black/10 px-3 py-2 text-sm text-black outline-none">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <h2 className="text-sm font-black text-black">تصفية</h2>
            </div>

            <FilterGroup title="الفئات">
              <div className="space-y-2 text-sm text-black/70">
                {config.tags.map((tag) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span>{tag}</span>
                    <span className="text-black/30">+</span>
                  </div>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="بحث سريع">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المنتج"
                className="w-full rounded-sm border border-black/10 px-3 py-2.5 text-right text-sm outline-none"
              />
            </FilterGroup>

            <FilterGroup title="المقاس">
              <div className="flex flex-wrap justify-end gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize((current) => (current === size ? '' : size))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      selectedSize === size ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/75'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="اللون">
              <div className="flex flex-wrap justify-end gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor((current) => (current === color.name ? '' : color.name))}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                      selectedColor === color.name ? 'scale-110 border-black ring-2 ring-black/20' : 'border-black/10'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="السعر">
              <input type="range" min="0" max="600" value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} className="w-full" />
              <p className="mt-3 text-sm text-black/60">حتى {priceLimit}</p>
            </FilterGroup>
          </aside>

          <div className="order-1 lg:order-2">
            {filteredProducts.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => <CategoryProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="rounded-sm border border-dashed border-black/15 bg-white p-10 text-center text-sm text-black/55">
                لا توجد منتجات تطابق عوامل التصفية الحالية.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
