import { useEffect, useState } from 'react';
import { fetchProductById } from '../services/productsApi';

export default function useProductDetails(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError('');
        const data = await fetchProductById(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while loading the product.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (productId) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, isLoading, error };
}
