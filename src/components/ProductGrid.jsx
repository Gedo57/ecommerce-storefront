import { useEffect, useMemo, useState } from 'react';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';
import ProductCard from './ProductCard';

const sortOptions = [
  { value: 'featured', label: 'الأكثر صلة' },
  { value: 'price-low', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-high', label: 'السعر: من الأعلى للأقل' },
  { value: 'rating-high', label: 'الأعلى تقييماً' },
  { value: 'name-asc', label: 'الاسم: أ - ي' },
];

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_STEP = 8;

function formatCategoryLabel(category) {
  if (category === 'all') return 'الكل';
  return category
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function ProductGrid({
  products,
  totalProducts,
  isLoading,
  error,
  onOpenCart,
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  sortBy,
  onSortByChange,
  categories,
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchTerm, selectedCategory, sortBy]);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const hasMoreProducts = visibleProducts.length < products.length;

  const resetFilters = () => {
    onSearchTermChange('');
    onSelectedCategoryChange('all');
    onSortByChange('featured');
  };

  return (
    <section id="products" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-3 border-b border-black/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-right">
            <h2 className="text-2xl font-black text-black sm:text-3xl">منتجات مختارة لك</h2>
            <p className="mt-1 text-sm text-black/60">{products.length} منتج بعد الفلترة • إجمالي المنتجات من الـ API: {totalProducts}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-black/65">
            <span className="rounded-full bg-[#f3f3f3] px-3 py-2">واجهة أنظف</span>
            <span className="rounded-full bg-[#f3f3f3] px-3 py-2">فلترة أبسط</span>
            <span className="rounded-full bg-[#f3f3f3] px-3 py-2">ستايل أقرب لمتاجر الفاشون</span>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="order-2 lg:order-1">
              {products.length === 0 ? (
                <div className="rounded-lg border border-black/10 bg-white p-8 text-center">
                  <h3 className="text-2xl font-black text-black">لا توجد منتجات مطابقة.</h3>
                  <p className="mt-3 text-sm leading-7 text-black/65">جرّب كلمة بحث مختلفة أو غيّر الفئة أو أعد ضبط الفلاتر.</p>
                  <button type="button" onClick={resetFilters} className="mt-5 rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85">
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-black/70">
                      {searchTerm ? <span className="rounded-full bg-[#f3f3f3] px-3 py-1.5">بحث: {searchTerm}</span> : null}
                      {selectedCategory !== 'all' ? <span className="rounded-full bg-[#f3f3f3] px-3 py-1.5">{formatCategoryLabel(selectedCategory)}</span> : null}
                      {!searchTerm && selectedCategory === 'all' ? <span className="rounded-full bg-[#f3f3f3] px-3 py-1.5">كل المنتجات</span> : null}
                    </div>
                    <div className="text-sm text-black/55">عرض {visibleProducts.length} من {products.length}</div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onOpenCart={onOpenCart} />
                    ))}
                  </div>

                  {hasMoreProducts ? (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((current) => current + LOAD_MORE_STEP)}
                        className="rounded-md border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
                      >
                        عرض المزيد
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <aside className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-36">
              <div className="rounded-lg border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3">
                  <h3 className="text-lg font-black text-black">تصفية</h3>
                  <button type="button" onClick={resetFilters} className="text-sm font-medium text-black/60 transition hover:text-black">
                    إعادة الضبط
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <label className="block text-right">
                    <span className="mb-2 block text-sm font-semibold text-black">ابحثي</span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => onSearchTermChange(event.target.value)}
                      placeholder="ابحثي باسم المنتج"
                      className="filter-input text-right"
                    />
                  </label>

                  <label className="block text-right">
                    <span className="mb-2 block text-sm font-semibold text-black">الفئة</span>
                    <select
                      value={selectedCategory}
                      onChange={(event) => onSelectedCategoryChange(event.target.value)}
                      className="filter-select text-right"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {formatCategoryLabel(category)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-right">
                    <span className="mb-2 block text-sm font-semibold text-black">الترتيب</span>
                    <select
                      value={sortBy}
                      onChange={(event) => onSortByChange(event.target.value)}
                      className="filter-select text-right"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-black/10 bg-white p-5 text-right">
                <h4 className="text-base font-black text-black">مقترحات سريعة</h4>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => onSelectedCategoryChange(category)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        selectedCategory === category ? 'border-black bg-black text-white' : 'border-black/10 bg-[#f7f7f7] text-black hover:bg-[#ededed]'
                      }`}
                    >
                      {formatCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
