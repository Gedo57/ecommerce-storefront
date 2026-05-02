import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import CategoryListingView from '../components/CategoryListingView';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { categoryMatchesProduct, getCategoryConfig } from '../data/categoryCatalog';

export default function CategoryPage() {
  const { categoryKey } = useParams();
  const { products, isLoading, error } = useProducts();
  const config = getCategoryConfig(categoryKey);

  const categoryProducts = useMemo(
    () => products.filter((product) => categoryMatchesProduct(product, categoryKey)),
    [categoryKey, products],
  );

  if (isLoading) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <ErrorState message={error} />
        </div>
      </section>
    );
  }

  return <CategoryListingView config={config} products={categoryProducts} />;
}
