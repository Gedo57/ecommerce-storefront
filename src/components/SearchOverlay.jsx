import { Link } from 'react-router-dom';
import { getLocalizedCategoryName } from '../data/categoryCatalog';
import { useCurrency } from '../context/CurrencyContext';
import { useLocale } from '../context/LocaleContext';
export default function SearchOverlay({ isOpen, query, results = [], suggestedCategories = [], onClose }) {
  const { formatPrice } = useCurrency();
  const { t, dir } = useLocale();
  if (!isOpen) return null;
  return <div dir={dir} className={`absolute inset-x-0 top-full z-50 mt-2 rounded-sm border border-black/10 bg-white p-4 text-black shadow-[0_24px_48px_rgba(0,0,0,0.18)] ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
    {query.trim() ? <><div className="mb-4 flex items-center justify-between gap-3 border-b border-black/10 pb-3"><Link to={`/search?q=${encodeURIComponent(query)}`} onClick={onClose} className="text-sm font-bold text-black hover:text-black/70">{t('عرض كل النتائج')}</Link><p className="text-sm text-black/55">{t('نتائج البحث المباشرة')}</p></div>{results.length ? <div className="space-y-3">{results.slice(0, 6).map((product) => <Link key={product.id} to={`/product/${product.id}`} onClick={onClose} className="flex items-center gap-3 rounded-sm border border-black/8 p-3 transition hover:bg-black/[0.03]"><div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#f4f4f4] p-2"><img src={product.image} alt={product.title} className="h-full w-full object-contain" /></div><div className={`min-w-0 flex-1 ${dir === 'ltr' ? 'text-left' : 'text-right'}`}><p className="line-clamp-1 text-sm font-semibold text-black">{product.title}</p><p className="mt-1 text-xs text-black/55">{t(getLocalizedCategoryName(product.category))}</p><p className="mt-1 text-sm font-black text-black">{formatPrice(product.price)}</p></div></Link>)}</div> : <div className="rounded-sm bg-[#faf7f3] p-4 text-sm text-black/60">{t('لا توجد نتائج مطابقة الآن. جرّب كلمة أخرى أو افتح صفحة النتائج الكاملة.')}</div>}</> : <><p className="text-sm text-black/55">{t('اقتراحات سريعة')}</p><div className={`mt-3 flex flex-wrap gap-2 ${dir === 'ltr' ? 'justify-start' : 'justify-end'}`}>{suggestedCategories.map((item) => <Link key={item.key} to={`/category/${item.key}`} onClick={onClose} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white">{t(item.label)}</Link>)}</div></>}
  </div>;
}
