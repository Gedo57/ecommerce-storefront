import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productsApi';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');

        const data = await fetchProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while loading products.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    isLoading,
    error,
  };
}
