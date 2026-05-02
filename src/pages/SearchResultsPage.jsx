import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { navigationCategories } from '../data/navigationCategories';
import { useDocumentMeta } from '../utils/seo';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, isLoading, error } = useProducts();

  useDocumentMeta({ title: query ? `${query} | Search | SET` : 'Search | SET', description: 'نتائج البحث داخل واجهة المتجر.' });

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return products.filter((product) => {
      const haystack = [
        product.title,
        product.description,
        product.category,
        ...(product.availableColors || []).map((item) => item.name),
        ...(product.availableSizes || []),
      ].join(' ').toLowerCase();

      return haystack.includes(normalized);
    });
  }, [normalized, products]);

  const categorySuggestions = useMemo(() => {
    if (!normalized) return navigationCategories.slice(0, 6);
    return navigationCategories.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, 6);
  }, [normalized]);

  if (isLoading) {
    return <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px]"><LoadingState /></div></section>;
  }

  if (error) {
    return <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px]"><ErrorState message={error} /></div></section>;
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] text-right">
        <p className="text-sm text-black/55">Search</p>
        <h1 className="mt-2 text-4xl font-black text-black">{query ? `نتائج البحث عن: ${query}` : 'ابحث عن منتج أو فئة'}</h1>
        <p className="mt-3 text-sm text-black/60">{results.length} نتيجة مطابقة في الواجهة الحالية.</p>

        {categorySuggestions.length ? (
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {categorySuggestions.map((item) => (
              <Link key={item.key} to={`/category/${item.key}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-black/15 bg-white p-10 text-sm text-black/60">
              لا توجد نتائج مطابقة. جرّب اسم منتج آخر أو افتح إحدى الفئات المقترحة.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
