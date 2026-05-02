import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlistItem } from '../redux/wishlistSlice';
import useProductDetails from '../hooks/useProductDetails';
import useProducts from '../hooks/useProducts';
import ErrorState from '../components/ErrorState';
import ProductCard from '../components/ProductCard';
import TrustBadgesRow from '../components/TrustBadgesRow';
import { useToast } from '../context/ToastContext';
import { getLocalizedCategoryName } from '../data/categoryCatalog';
import { useCurrency } from '../context/CurrencyContext';
import { createCartItem, getDefaultSelection } from '../utils/productOptions';
import { saveRecentlyViewed, trackEvent } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';

function ProductDetailsSkeleton() {
  return <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[620px_minmax(0,1fr)]"><div className="h-[760px] animate-pulse bg-[#efefef]" /><div className="space-y-4"><div className="h-5 w-64 animate-pulse rounded bg-[#ededed]" /><div className="h-16 w-full animate-pulse rounded bg-[#ededed]" /><div className="h-10 w-32 animate-pulse rounded bg-[#ededed]" /><div className="h-56 w-full animate-pulse rounded bg-[#ededed]" /></div></div></section>;
}

function InfoRow({ title, value, accent }) {
  return <div className="flex items-center justify-between border-b border-black/8 py-4 text-sm last:border-b-0"><span className={accent ? 'font-semibold text-[#1a9b55]' : 'text-black/75'}>{value}</span><span className="font-medium text-black">{title}</span></div>;
}

function getFitMessage(rating = 0) {
  if (rating >= 4.7) return 'مطابق للمقاس في أغلب المراجعات';
  if (rating >= 4.3) return 'يميل لأن يكون True to Size';
  return 'يفضل مراجعة المقاسات قبل الشراء';
}

function getSizeGuide(category, sizes = []) {
  if (category === 'electronics') {
    return [
      { label: 'المقاس', value: 'Standard' },
      { label: 'التوصية', value: 'تحقق من المواصفات قبل الشراء' },
    ];
  }

  return sizes.map((size, index) => ({
    label: size,
    value: `${84 + (index * 6)} - ${90 + (index * 6)} cm`,
  }));
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { product, isLoading, error } = useProductDetails(productId);
  const { products } = useProducts();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.items.filter((item) => String(item.id) === String(productId)));
  const isWishlisted = useSelector((state) => state.wishlist.items.some((item) => String(item.id) === String(productId)));
  const { formatPrice } = useCurrency();

  const defaultSelection = useMemo(() => (product ? getDefaultSelection(product) : null), [product]);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const resolvedColor = selectedColor || defaultSelection?.color?.name || '';
  const resolvedSize = selectedSize || defaultSelection?.size || '';

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((variant) => variant.color.name === resolvedColor && variant.size === resolvedSize) || product.variants[0];
  }, [product, resolvedColor, resolvedSize]);

  useEffect(() => {
    if (product) saveRecentlyViewed(product);
  }, [product]);

  useDocumentMeta({ title: product ? `${product.title} | SET` : 'Product | SET', description: product?.description || 'تفاصيل المنتج والمخزون والمراجعات.' });

  const gallery = useMemo(() => {
    if (!product || !selectedVariant) return [];
    return Array.from({ length: 6 }, (_, index) => ({ id: index, image: selectedVariant.image || product.image, bg: ['#f2efec', '#ebe7e2', '#f5f2ef', '#ece7e1', '#f4f1ec', '#ece8e4'][index % 6] }));
  }, [product, selectedVariant]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  }, [product, products]);

  const sizeGuideRows = useMemo(() => getSizeGuide(product?.category, product?.availableSizes || []), [product]);
  const activeImage = gallery[selectedThumb] ?? gallery[0];
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const canBuy = selectedVariant?.stock > 0;

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !canBuy) return;
    dispatch(addToCart(createCartItem(product, { color: selectedVariant.color, size: selectedVariant.size, sku: selectedVariant.sku, image: selectedVariant.image, imageBg: selectedVariant.imageBg, stock: selectedVariant.stock })));
    trackEvent('add_to_cart', { productId: product.id, sku: selectedVariant.sku });
    showToast({ title: 'تمت الإضافة إلى عربة التسوق', description: `${product.title} — ${selectedVariant.color.name} / ${selectedVariant.size}`, variant: 'success' });
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product));
    showToast({ title: isWishlisted ? 'تمت الإزالة من المفضلة' : 'تم الحفظ في المفضلة', description: product.title });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: product.title, url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast({ title: 'تم نسخ رابط المنتج', description: 'يمكنك مشاركته الآن.' });
      }
    } catch {}
  };

  if (isLoading) return <ProductDetailsSkeleton />;
  if (error) return <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px]"><ErrorState message={error} /></div></section>;
  if (!product || !selectedVariant) return null;

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex flex-wrap justify-end gap-2 text-sm text-black/55"><Link to="/" className="hover:text-black">الصفحة الرئيسية</Link><span>/</span><span>{getLocalizedCategoryName(product.category)}</span><span>/</span><span className="line-clamp-1 max-w-[700px] text-black/70">{product.title}</span></div>
        <div className="grid gap-8 lg:grid-cols-[620px_minmax(0,1fr)] xl:grid-cols-[680px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1"><div className="grid gap-4 xl:grid-cols-[72px_minmax(0,1fr)]"><div className="order-2 flex gap-3 overflow-x-auto xl:order-1 xl:flex-col">{gallery.map((item, index) => <button key={item.id} type="button" onClick={() => setSelectedThumb(index)} className={`overflow-hidden border transition ${selectedThumb === index ? 'border-black' : 'border-black/10'}`} style={{ backgroundColor: item.bg }}><img src={item.image} alt="thumbnail" className="h-20 w-20 object-contain" /></button>)}</div><div className="order-1 overflow-hidden border border-black/10" style={{ backgroundColor: activeImage?.bg ?? '#f2efec' }}><img src={activeImage?.image} alt={product.title} className="h-[760px] w-full object-contain" /></div></div></div>
          <div className="order-1 text-right lg:order-2"><div className="max-w-[620px] lg:mr-auto lg:max-w-[560px]">
            <div className="flex items-start justify-between gap-4"><button type="button" onClick={handleShare} className="inline-flex h-10 w-10 items-center justify-center border border-black/15 text-xl transition hover:bg-black hover:text-white">↗</button><div className="flex-1"><h1 className="text-xl leading-8 text-black sm:text-2xl">{product.title}</h1><div className="mt-2 flex flex-wrap justify-end gap-2 text-sm text-black/55"><span>{selectedVariant.sku}</span><span>•</span><span className="font-medium text-[#f5b400]">★★★★★</span><span className="text-[#f5b400]">({product.reviewCount})</span></div></div></div>
            <div className="mt-4 border-b border-black/10 pb-5"><p className="text-4xl font-black text-black">{formatPrice(product.price)}</p></div>
            <div className="mt-5 flex items-center justify-between"><div className="flex items-center gap-3">{product.availableColors.map((color) => <button key={color.name} type="button" onClick={() => setSelectedColor(color.name)} className={`relative h-8 w-8 rounded-full border ${resolvedColor === color.name ? 'border-black ring-2 ring-black/15' : 'border-black/10'}`} style={{ backgroundColor: color.code }} title={color.name} />)}</div><div><p className="text-sm text-black/55">اللون</p><p className="mt-1 font-semibold text-black">{resolvedColor}</p></div></div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">{product.availableSizes.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${resolvedSize === size ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/70'}`}>{size}</button>)}</div>
            <div className="mt-4 rounded-sm border border-[#f5b400]/30 bg-[#fff8e8] p-4 text-right"><div className="flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setShowSizeGuide((current) => !current)} className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white">{showSizeGuide ? 'إخفاء Size Guide' : 'فتح Size Guide'}</button><div><p className="text-sm text-black/55">Check My Size</p><p className="mt-1 font-black text-black">{getFitMessage(product.rating)}</p></div></div>{showSizeGuide ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{sizeGuideRows.map((row) => <div key={row.label} className="rounded-sm border border-black/10 bg-white p-3"><p className="text-sm font-black text-black">{row.label}</p><p className="mt-1 text-sm text-black/65">{row.value}</p></div>)}</div> : null}</div>
            <div className="mt-6 rounded-sm bg-[#faf6f1] p-4 text-right"><p className="text-sm text-black/55">المخزون الحالي للـ variant المختار</p><p className={`mt-2 text-lg font-black ${canBuy ? 'text-[#1a9b55]' : 'text-red-700'}`}>{canBuy ? `${selectedVariant.stock} متاح` : 'نفد المخزون'}</p></div>
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={handleAddToCart} disabled={!canBuy} className="primary-btn disabled:cursor-not-allowed disabled:opacity-50">أضف للسلة {totalCartQuantity ? `(${totalCartQuantity})` : ''}</button><button type="button" onClick={handleToggleWishlist} className="ghost-btn">{isWishlisted ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}</button></div>
            <div className="mt-6"><TrustBadgesRow compact /></div>
            <div className="mt-8 rounded-sm border border-black/10 bg-white px-5"><InfoRow title="الفئة" value={getLocalizedCategoryName(product.category)} /><InfoRow title="SKU" value={selectedVariant.sku} /><InfoRow title="المخزون" value={canBuy ? `${selectedVariant.stock} available` : 'Out of stock'} accent={canBuy} /><InfoRow title="الوصف" value={product.description} /></div>
            <div className="mt-8 rounded-sm border border-black/10 bg-white p-5"><h2 className="text-right text-xl font-black text-black">Reviews</h2><div className="mt-4 space-y-4">{product.reviews.map((review) => <div key={review.id} className="rounded-sm border border-black/10 p-4 text-right"><div className="flex items-center justify-between"><span className="text-sm text-[#f5b400]">{'★'.repeat(review.rating)}</span><span className="font-bold text-black">{review.author}</span></div><p className="mt-2 text-sm leading-7 text-black/65">{review.comment}</p></div>)}</div></div>
          </div></div>
        </div>

        {relatedProducts.length ? (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-3 text-right"><p className="text-sm text-black/55">Recommended / Related</p><h2 className="text-3xl font-black text-black">منتجات مرتبطة قد تعجبك</h2></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
