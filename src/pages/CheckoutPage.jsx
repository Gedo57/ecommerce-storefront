import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { calculateCouponDiscount, consumeInventory, createEmail, findCoupon, trackEvent } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';
import TrustBadgesRow from '../components/TrustBadgesRow';

const CHECKOUT_FORM_STORAGE_KEY = 'storefront-checkout-form';

const shippingCountryRates = {
  Egypt: { taxRate: 0.14, standard: 5.99, express: 11.99, freeOver: 140 },
  Bahrain: { taxRate: 0.1, standard: 8.99, express: 16.99, freeOver: 180 },
  UAE: { taxRate: 0.05, standard: 9.99, express: 18.99, freeOver: 200 },
  Saudi: { taxRate: 0.15, standard: 10.99, express: 19.99, freeOver: 220 },
};

const defaultFormState = {
  fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'Egypt', shippingMethod: 'standard', notes: '', paymentMethod: 'cod',
};

function loadStoredCheckoutForm() {
  try {
    const saved = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
    if (!saved) return defaultFormState;
    return { ...defaultFormState, ...JSON.parse(saved) };
  } catch {
    return defaultFormState;
  }
}

function validateCheckoutForm(formData) {
  const nextErrors = {};
  if (formData.fullName.trim().length < 3) nextErrors.fullName = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Please enter a valid email address.';
  if (formData.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Please enter a valid phone number.';
  if (formData.address.trim().length < 8) nextErrors.address = 'Please enter a complete address.';
  if (formData.city.trim().length < 2) nextErrors.city = 'Please enter your city.';
  if (formData.postalCode.trim().length < 4) nextErrors.postalCode = 'Please enter a valid postal code.';
  return nextErrors;
}

function createTrackingTimeline() {
  const now = Date.now();
  return [
    { label: 'Order placed', description: 'تم إنشاء الطلب بنجاح.', date: new Date(now).toISOString() },
    { label: 'Payment pending review', description: 'بانتظار تأكيد طريقة الدفع المختارة.', date: new Date(now + 60 * 60 * 1000).toISOString() },
    { label: 'Packed for shipment', description: 'تم تجهيز المنتجات للشحن.', date: new Date(now + 12 * 60 * 60 * 1000).toISOString() },
    { label: 'Out for delivery', description: 'الطلب خرج مع شركة الشحن.', date: new Date(now + 36 * 60 * 60 * 1000).toISOString() },
  ];
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart);
  const { formatPrice, currency } = useCurrency();
  const { isAuthenticated, addOrder, saveAddress, user } = useAuth();
  const [formData, setFormData] = useState(() => ({ ...loadStoredCheckoutForm(), fullName: user?.name || loadStoredCheckoutForm().fullName, email: user?.email || loadStoredCheckoutForm().email }));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useDocumentMeta({ title: 'Checkout | SET', description: 'الدفع، الكوبونات، الشحن، والتأكيد المحلي للطلبات.' });

  const rateConfig = shippingCountryRates[formData.country] || shippingCountryRates.Egypt;
  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    if (totalPrice >= rateConfig.freeOver && formData.shippingMethod === 'standard') return 0;
    return rateConfig[formData.shippingMethod] || rateConfig.standard;
  }, [formData.shippingMethod, items.length, rateConfig, totalPrice]);
  const couponDiscount = useMemo(() => calculateCouponDiscount(appliedCoupon, totalPrice, shippingCost), [appliedCoupon, totalPrice, shippingCost]);
  const taxBase = Math.max(0, totalPrice - (appliedCoupon?.type === 'percent' || appliedCoupon?.type === 'fixed' ? couponDiscount : 0));
  const taxAmount = taxBase * rateConfig.taxRate;
  const finalTotal = Math.max(0, totalPrice + shippingCost + taxAmount - couponDiscount);

  useEffect(() => {
    localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({ ...current, fullName: current.fullName || user.name, email: current.email || user.email }));
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateCheckoutForm(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || items.length === 0) return;

    setIsSubmitting(true);
    const orderReference = `ORD-${Date.now().toString().slice(-8)}`;
    const successfulOrder = {
      reference: orderReference,
      customerName: formData.fullName.trim(),
      email: formData.email.trim(),
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card payment',
      paymentGatewayLabel: formData.paymentMethod === 'card' ? 'Gateway ready (demo)' : 'COD',
      itemCount: totalQuantity,
      items,
      subtotal: totalPrice,
      shippingCost,
      shippingMethod: formData.shippingMethod,
      taxAmount,
      coupon: appliedCoupon,
      couponDiscount,
      totalBase: finalTotal,
      currency,
      status: 'Packed',
      trackingTimeline: createTrackingTimeline(),
      shippingAddress: {
        fullName: formData.fullName.trim(), phone: formData.phone.trim(), addressLine: formData.address.trim(), city: formData.city.trim(), postalCode: formData.postalCode.trim(), country: formData.country,
      },
      createdAt: new Date().toISOString(),
    };

    if (isAuthenticated) {
      addOrder(successfulOrder);
      saveAddress(successfulOrder.shippingAddress);
    }

    consumeInventory(items);
    createEmail({ to: successfulOrder.email, subject: `Tracking started for ${successfulOrder.reference}`, body: 'تم فتح تتبع محلي لطلبك ويمكنك متابعته من صفحة Track Order.', type: 'tracking' });
    trackEvent('order_placed', { reference: successfulOrder.reference, total: successfulOrder.totalBase });
    dispatch(clearCart());
    localStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);

    window.setTimeout(() => {
      setOrderSuccess(successfulOrder);
      setFormData(defaultFormState);
      setErrors({});
      setIsSubmitting(false);
      setAppliedCoupon(null);
      setCouponCode('');
    }, 350);
  }

  function applyCoupon() {
    const found = findCoupon(couponCode);
    if (!found) {
      setCouponError('الكوبون غير صالح.');
      setAppliedCoupon(null);
      return;
    }
    if (totalPrice < Number(found.minSubtotal || 0)) {
      setCouponError(`الحد الأدنى لاستخدام هذا الكوبون هو ${formatPrice(found.minSubtotal)}.`);
      setAppliedCoupon(null);
      return;
    }
    setCouponError('');
    setAppliedCoupon(found);
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Checkout</p>
          <h1 className="mt-3 text-4xl font-black text-brand-900 sm:text-5xl">Complete your order</h1>
          <p className="mt-4 text-base leading-8 text-brand-900/68">{isAuthenticated ? 'سيتم حفظ الطلب والعنوان والتتبع تلقائياً داخل حسابك.' : 'سجل الدخول لحفظ الطلبات والعناوين وسجل التتبع داخل حسابك.'}</p>
        </div>

        <div className="mb-6"><TrustBadgesRow compact /></div>

        {orderSuccess ? (
          <div className="rounded-[2rem] border border-brand-900/10 bg-white p-8 shadow-soft sm:p-10 text-right">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Order confirmed</p>
            <h2 className="mt-4 text-4xl font-black text-brand-900">Thank you, {orderSuccess.customerName}.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-900/68">Your order was placed successfully. A local confirmation message was added for <span className="font-semibold text-brand-900">{orderSuccess.email}</span>.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-[1.6rem] border border-brand-900/10 bg-brand-50 p-5"><p className="text-sm text-brand-900/55">Reference</p><p className="mt-2 text-lg font-bold text-brand-900">{orderSuccess.reference}</p></div>
              <div className="rounded-[1.6rem] border border-brand-900/10 bg-brand-50 p-5"><p className="text-sm text-brand-900/55">Payment</p><p className="mt-2 text-lg font-bold text-brand-900">{orderSuccess.paymentMethod}</p></div>
              <div className="rounded-[1.6rem] border border-brand-900/10 bg-brand-50 p-5"><p className="text-sm text-brand-900/55">Shipping</p><p className="mt-2 text-lg font-bold capitalize text-brand-900">{orderSuccess.shippingMethod}</p></div>
              <div className="rounded-[1.6rem] border border-brand-900/10 bg-brand-50 p-5"><p className="text-sm text-brand-900/55">Final total</p><p className="mt-2 text-lg font-bold text-brand-900">{formatPrice(orderSuccess.totalBase)}</p></div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="primary-btn">Continue shopping</Link>
              <Link to="/track-order" className="ghost-btn">Track order</Link>
              {isAuthenticated ? <Link to="/account" className="ghost-btn">اذهب إلى حسابي</Link> : null}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="theme-surface rounded-[2rem] p-8 text-center">
            <h2 className="text-2xl font-black text-brand-900">Your cart is empty.</h2>
            <p className="mt-3 text-sm leading-7 text-brand-900/68">Add products to your cart, then return here to complete your order.</p>
            <Link to="/" className="primary-btn mt-6 inline-flex">Back to store</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-brand-900/10 bg-[rgba(255,253,250,0.88)] p-6 shadow-soft sm:p-8 text-right">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">Saved automatically</span>
                <h2 className="text-2xl font-black text-brand-900">Customer details</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {['fullName','email','phone','address','city','postalCode'].map((name) => (
                  <label key={name} className={`block ${['fullName','email','phone','address'].includes(name) ? 'sm:col-span-2' : ''}`}><span className="mb-2 block text-sm text-brand-900/68">{name}</span><input name={name} type={name === 'email' ? 'email' : 'text'} value={formData[name]} onChange={handleChange} className={`checkout-input text-right ${errors[name] ? 'checkout-input-error' : ''}`} />{errors[name] ? <span className="checkout-error-text">{errors[name]}</span> : null}</label>
                ))}
                <label className="block"><span className="mb-2 block text-sm text-brand-900/68">Country</span><select name="country" value={formData.country} onChange={handleChange} className="checkout-input text-right">{Object.keys(shippingCountryRates).map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
                <label className="block"><span className="mb-2 block text-sm text-brand-900/68">Shipping method</span><select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange} className="checkout-input text-right"><option value="standard">Standard</option><option value="express">Express</option></select></label>
                <label className="block sm:col-span-2"><span className="mb-2 block text-sm text-brand-900/68">Order notes</span><textarea name="notes" value={formData.notes} onChange={handleChange} className="checkout-input min-h-[120px] resize-y text-right" /></label>
              </div>
              <div className="mt-8 rounded-[1.6rem] border border-brand-900/10 bg-white p-5">
                <h3 className="text-lg font-bold text-brand-900">Payment method</h3>
                <div className="mt-4 grid gap-3">
                  <label className="checkout-radio"><input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} /><span>Cash on delivery</span></label>
                  <label className="checkout-radio"><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} /><span>Card payment (gateway-ready demo)</span></label>
                </div>
              </div>
              {!isAuthenticated ? <div className="mt-4 rounded-sm border border-[#f5b400]/30 bg-[#fff7e4] px-4 py-3 text-sm text-right text-black/70">للاحتفاظ بالطلبات والعناوين داخل حسابك، <Link to="/login" className="font-bold text-black underline">سجل الدخول أو أنشئ حساب</Link>.</div> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="submit" disabled={isSubmitting} className="primary-btn text-sm disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Placing order...' : 'Place order'}</button>
                <button type="button" onClick={() => dispatch(clearCart())} className="ghost-btn text-sm">Clear cart</button>
              </div>
            </form>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-brand-900/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">{totalQuantity} items</span><h2 className="text-2xl font-black text-brand-900">Order summary</h2></div>
                <div className="mt-6 space-y-4">{items.map((item) => <div key={item.cartLineId || item.id} className="flex items-center gap-4 rounded-[1.5rem] border border-brand-900/10 bg-brand-50 p-4"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.2rem] bg-white p-3"><img src={item.image} alt={item.title} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><Link to={`/product/${item.id}`} className="line-clamp-2 font-semibold text-brand-900 transition hover:text-brand-700">{item.title}</Link><p className="mt-1 text-sm capitalize text-brand-900/55">Qty: {item.quantity}</p><p className="mt-1 text-xs text-brand-900/45">{item.selectedColor?.name || 'Standard'} • {item.selectedSize || 'Standard'} • {item.sku}</p></div><p className="text-sm font-semibold text-brand-700">{formatPrice(item.price * item.quantity)}</p></div>)}</div>
              </div>
              <div className="rounded-[2rem] border border-brand-900/10 bg-white p-6 shadow-soft sm:p-8 text-right">
                <h3 className="text-lg font-bold text-brand-900">Coupon code</h3>
                <div className="mt-4 flex gap-3"><button type="button" onClick={applyCoupon} className="rounded-sm bg-black px-4 py-2 text-sm font-bold text-white">تطبيق</button><input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="WELCOME10 / FREESHIP / SET15" className="checkout-input text-right" /></div>
                {couponError ? <p className="mt-3 text-sm text-red-700">{couponError}</p> : null}
                {appliedCoupon ? <p className="mt-3 text-sm text-emerald-700">تم تطبيق {appliedCoupon.code} — {appliedCoupon.description}</p> : null}
              </div>
              <div className="rounded-[2rem] border border-brand-900/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="space-y-3 text-sm text-brand-900/70">
                  <div className="flex items-center justify-between"><span className="font-semibold text-brand-900">{formatPrice(totalPrice)}</span><span>Subtotal</span></div>
                  <div className="flex items-center justify-between"><span className="font-semibold text-brand-900">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span><span>Shipping</span></div>
                  <div className="flex items-center justify-between"><span className="font-semibold text-brand-900">-{formatPrice(couponDiscount)}</span><span>Coupon discount</span></div>
                  <div className="flex items-center justify-between"><span className="font-semibold text-brand-900">{formatPrice(taxAmount)}</span><span>Estimated tax</span></div>
                </div>
                <div className="my-4 h-px bg-brand-900/10" />
                <div className="flex items-center justify-between"><span className="text-3xl font-black text-brand-700">{formatPrice(finalTotal)}</span><div className="text-right"><span className="text-base font-semibold text-brand-900">Total</span><p className="mt-1 text-sm text-brand-900/55">Free standard shipping on orders above {formatPrice(rateConfig.freeOver)}.</p></div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
