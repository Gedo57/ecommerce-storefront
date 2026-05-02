import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decreaseQuantity, removeItemCompletely } from '../redux/cartSlice';
import { useCurrency } from '../context/CurrencyContext';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart);
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" aria-label="Close cart overlay" className="absolute inset-0 bg-[#17120f]/45 backdrop-blur-sm" onClick={onClose} />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-brand-900/10 bg-[rgba(255,253,250,0.98)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-900/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Shopping bag</p>
            <h2 className="mt-1 text-2xl font-black text-brand-900">Your Cart</h2>
          </div>
          <button type="button" onClick={onClose} className="ghost-btn !px-4 !py-2 text-sm">
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">0 items</div>
            <h3 className="mt-5 text-2xl font-black text-brand-900">Your cart is empty.</h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-brand-900/68">
              Add products from the catalog, then come back here to review your picks or continue to checkout.
            </p>
            <Link to="/" className="primary-btn mt-5">
              Back to store
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {items.map((item) => (
                <article key={item.cartLineId || item.id} className="rounded-[1.6rem] border border-brand-900/10 bg-white p-4 shadow-card">
                  <div className="flex gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.4rem] bg-brand-50 p-3">
                      <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/product/${item.id}`} className="line-clamp-2 text-base font-bold text-brand-900 transition hover:text-brand-700">
                            {item.title}
                          </Link>
                          <p className="mt-1 text-sm capitalize text-brand-900/55">{item.category}</p>
                          <p className="mt-2 text-xs text-brand-900/60">{item.selectedColor?.name || 'Standard'} • {item.selectedSize || 'Standard'}</p>
                          <p className="mt-1 text-[11px] text-brand-900/45">{item.sku}</p>
                        </div>
                        <p className="text-sm font-semibold text-brand-700">{formatPrice(item.price)}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-brand-900/10 bg-brand-50">
                          <button type="button" onClick={() => dispatch(decreaseQuantity(item.cartLineId || item.id))} className="px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-100">
                            −
                          </button>
                          <span className="min-w-12 text-center text-sm font-semibold text-brand-900">{item.quantity}</span>
                          <button type="button" onClick={() => dispatch(addToCart(item))} className="px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-100">
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm text-brand-900/70">
                            Total: <span className="font-semibold text-brand-900">{formatPrice(item.price * item.quantity)}</span>
                          </p>
                          <button type="button" onClick={() => dispatch(removeItemCompletely(item.cartLineId || item.id))} className="text-sm font-semibold text-red-700 transition hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-brand-900/10 px-5 py-5 sm:px-6">
              <div className="rounded-[1.6rem] border border-brand-900/10 bg-white p-5">
                <div className="flex items-center justify-between text-sm text-brand-900/70">
                  <span>Items</span>
                  <span className="font-semibold text-brand-900">{totalQuantity}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-brand-900/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-brand-900/70">
                  <span>Estimated shipping</span>
                  <span className="font-semibold text-brand-900">Free</span>
                </div>
                <div className="mt-4 h-px bg-brand-900/10" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-brand-900">Order total</span>
                  <span className="text-2xl font-black text-brand-700">{formatPrice(totalPrice)}</span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => dispatch(clearCart())} className="ghost-btn text-sm">
                    Clear cart
                  </button>
                  <Link to="/checkout" className="primary-btn text-center text-sm">
                    Go to checkout
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
