import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { clearWishlist, removeWishlistItem } from '../redux/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { createCartItem } from '../utils/productOptions';

export default function WishlistPage({ onOpenCart }) {
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const items = useSelector((state) => state.wishlist.items);

  const handleMoveToCart = (product) => {
    dispatch(addToCart(createCartItem(product)));
    showToast({ title: 'Added to cart', description: `${product.title.slice(0, 56)}${product.title.length > 56 ? '...' : ''}`, variant: 'success' });
  };

  const handleRemove = (product) => {
    dispatch(removeWishlistItem(product.id));
    showToast({ title: 'Removed from wishlist', description: product.title });
  };

  const handleClear = () => {
    dispatch(clearWishlist());
    showToast({ title: 'Wishlist cleared', description: 'All saved products were removed.' });
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Saved picks</p>
            <h1 className="mt-3 text-4xl font-black text-brand-900 sm:text-5xl">Your Wishlist</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-900/68">
              Keep favorite products in one place, compare them later, or move them straight into the cart when you are ready.
            </p>
          </div>

          {items.length > 0 ? (
            <button type="button" onClick={handleClear} className="ghost-btn text-sm">
              Clear wishlist
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="theme-surface rounded-[2rem] p-8 text-center">
            <h2 className="text-2xl font-black text-brand-900">Your wishlist is empty.</h2>
            <p className="mt-3 text-sm leading-7 text-brand-900/68">
              Save products from the catalog or the product details page, then come back here to review them.
            </p>
            <Link to="/" className="primary-btn mt-6 inline-flex">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((product) => (
              <article key={product.id} className="flex flex-col gap-5 rounded-[2rem] border border-brand-900/10 bg-white p-5 shadow-card sm:flex-row sm:items-center">
                <Link to={`/product/${product.id}`} className="flex h-36 w-full items-center justify-center rounded-[1.6rem] bg-brand-50 p-4 sm:w-40">
                  <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold capitalize text-brand-700">{product.category}</span>
                    <span className="text-sm font-semibold text-brand-700">★ {product.rating.toFixed(1)}</span>
                  </div>

                  <Link to={`/product/${product.id}`} className="mt-3 block text-xl font-bold text-brand-900 transition hover:text-brand-700">
                    {product.title}
                  </Link>
                  <p className="mt-3 text-2xl font-black text-brand-700">{formatPrice(product.price)}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => handleMoveToCart(product)} className="primary-btn text-sm">
                      Add to cart
                    </button>
                    <Link to={`/product/${product.id}`} className="ghost-btn text-sm">
                      View details
                    </Link>
                    <button type="button" onClick={() => handleRemove(product)} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                      Remove
                    </button>
                    <button type="button" onClick={onOpenCart} className="ghost-btn text-sm">
                      Open cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
