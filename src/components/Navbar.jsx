import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MegaMenuPanel from './MegaMenuPanel';
import SearchOverlay from './SearchOverlay';
import { navigationCategories, navigationCategoryMap } from '../data/navigationCategories';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import useProducts from '../hooks/useProducts';

const localeStorageKeys = { country: 'storefront-country' };
const supportedLanguages = [{ code: 'ar', label: 'العربية' }, { code: 'en', label: 'English' }];
const supportedCountries = [{ code: 'EG', label: 'مصر' }, { code: 'SA', label: 'السعودية' }, { code: 'AE', label: 'الإمارات' }, { code: 'UK', label: 'United Kingdom' }];

function UtilityMenu({ icon, label, value, options, onSelect, isOpen, onToggle, dir = 'rtl' }) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base transition ${isOpen ? 'border-white/40 bg-white/18 text-white' : 'border-white/15 bg-white/8 text-white/85 hover:bg-white/14 hover:text-white'}`} title={label} aria-label={label} aria-expanded={isOpen}>
        <span aria-hidden="true">{icon}</span>
      </button>
      {isOpen ? (
        <div dir={dir} className={`absolute top-[calc(100%+10px)] z-[70] min-w-[180px] overflow-hidden rounded-xl border border-black/10 bg-white text-black shadow-[0_18px_40px_rgba(0,0,0,0.18)] ${dir === 'rtl' ? 'left-0 text-right' : 'right-0 text-left'}`}>
          <div className="border-b border-black/8 bg-neutral-50 px-4 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">{label}</p>
            <p className="mt-1 text-sm font-semibold text-black">{value}</p>
          </div>
          <div className="py-1.5">
            {options.map((option) => {
              const active = option.code === value || option.label === value;
              return (
                <button key={option.code} type="button" onClick={() => onSelect(option.code)} className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${active ? 'bg-black text-white' : 'text-black/80 hover:bg-black/5'}`}>
                  <span>{option.label}</span>
                  {active ? <span>✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar({ onOpenCart }) {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistQuantity = useSelector((state) => state.wishlist.totalQuantity);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [country, setCountry] = useState(() => localStorage.getItem(localeStorageKeys.country) || 'EG');
  const [openUtilityMenu, setOpenUtilityMenu] = useState(null);
  const closeTimeoutRef = useRef(null);
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const { language, setLanguage, t, dir } = useLocale();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts();

  useEffect(() => { localStorage.setItem(localeStorageKeys.country, country); }, [country]);
  useEffect(() => {
    function handleEscape(event) { if (event.key === 'Escape') { setActiveCategoryKey(null); setIsSearchOpen(false); setOpenUtilityMenu(null); } }
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) { setActiveCategoryKey(null); setOpenUtilityMenu(null); }
      if (searchRef.current && !searchRef.current.contains(event.target)) { setIsSearchOpen(false); }
    }
    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => { window.removeEventListener('keydown', handleEscape); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const openMenu = (categoryKey) => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); setActiveCategoryKey(categoryKey); };
  const scheduleCloseMenu = () => { closeTimeoutRef.current = setTimeout(() => setActiveCategoryKey(null), 140); };
  const closeMenuImmediately = () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); setActiveCategoryKey(null); };
  const activeCategory = activeCategoryKey ? navigationCategoryMap[activeCategoryKey] : null;
  const searchResults = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => [product.title, product.description, product.category, ...(product.availableColors || []).map((item) => item.name), ...(product.availableSizes || [])].join(' ').toLowerCase().includes(normalized)).slice(0, 6);
  }, [products, searchValue]);
  const suggestedCategories = navigationCategories.slice(0, 8);
  const handleSearchSubmit = (event) => { event.preventDefault(); const query = searchValue.trim(); if (!query) return; setIsSearchOpen(false); navigate(`/search?q=${encodeURIComponent(query)}`); };
  const toggleUtilityMenu = (menuKey) => { setOpenUtilityMenu((current) => (current === menuKey ? null : menuKey)); };
  const selectedLanguageLabel = supportedLanguages.find((item) => item.code === language)?.label || language;
  const selectedCountryLabel = supportedCountries.find((item) => item.code === country)?.label || country;
  const selectedCurrencyLabel = supportedCurrencies.find((item) => item.code === currency)?.label || currency;

  return (
    <header ref={wrapperRef} className="sticky top-0 z-50 border-b border-black/10 bg-black text-white shadow-[0_6px_24px_rgba(0,0,0,0.16)]" onMouseLeave={scheduleCloseMenu} onMouseEnter={() => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }}>
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 xl:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-sm text-white/85 sm:gap-2">
              <Link to={isAuthenticated ? '/account' : '/login'} className="inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 transition hover:bg-white/10">
                <span className="text-white">{isAuthenticated ? user?.name || t('حسابي') : t('تسجيل الدخول')}</span>
              </Link>
              <Link to="/wishlist" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition hover:bg-white/10"><span aria-hidden="true">♡</span><span className="text-xs">{wishlistQuantity}</span></Link>
              <button type="button" onClick={onOpenCart} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition hover:bg-white/10"><span aria-hidden="true">🛒</span><span className="text-xs">{totalQuantity}</span></button>
              <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
              <div className="flex items-center gap-1.5">
                <UtilityMenu icon="💱" label={t('العملة')} value={t(selectedCurrencyLabel)} options={supportedCurrencies.map((item) => ({ ...item, label: t(item.label) }))} onSelect={(code) => { setCurrency(code); setOpenUtilityMenu(null); }} isOpen={openUtilityMenu === 'currency'} onToggle={() => toggleUtilityMenu('currency')} dir={dir} />
                <UtilityMenu icon="🌐" label={t('اللغة')} value={t(selectedLanguageLabel)} options={supportedLanguages.map((item) => ({ ...item, label: t(item.label) }))} onSelect={(code) => { setLanguage(code); setOpenUtilityMenu(null); }} isOpen={openUtilityMenu === 'language'} onToggle={() => toggleUtilityMenu('language')} dir={dir} />
                <UtilityMenu icon="📍" label={t('الدولة')} value={t(selectedCountryLabel)} options={supportedCountries.map((item) => ({ ...item, label: t(item.label) }))} onSelect={(code) => { setCountry(code); setOpenUtilityMenu(null); }} isOpen={openUtilityMenu === 'country'} onToggle={() => toggleUtilityMenu('country')} dir={dir} />
              </div>
            </div>
            <div ref={searchRef} className="order-3 w-full md:order-2 md:max-w-[520px]">
              <form className="relative" onSubmit={handleSearchSubmit}>
                <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onFocus={() => setIsSearchOpen(true)} placeholder={t('ابحثي عن فساتين، أحذية، حقائب...')} className="h-11 w-full rounded-sm border border-white/20 bg-white px-12 text-sm text-black outline-none" aria-label={t('Search')} />
                <button type="submit" className="absolute inset-y-0 left-0 flex w-12 items-center justify-center rounded-l-sm bg-black text-lg text-white">⌕</button>
                <SearchOverlay isOpen={isSearchOpen} query={searchValue} results={searchResults} suggestedCategories={suggestedCategories} onClose={() => setIsSearchOpen(false)} />
              </form>
            </div>
            <Link to="/" className="order-2 shrink-0 md:order-3"><h1 className="text-3xl font-black tracking-[0.22em] text-white sm:text-4xl">SET</h1></Link>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 pt-3 text-sm">
            <nav className="flex flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap">
              {navigationCategories.map((category) => {
                const isActive = activeCategoryKey === category.key;
                return <button key={category.key} type="button" onMouseEnter={() => openMenu(category.key)} onFocus={() => openMenu(category.key)} onClick={() => setActiveCategoryKey((current) => (current === category.key ? null : category.key))} className={`relative whitespace-nowrap border-b-2 pb-1 transition ${isActive ? 'border-white text-white' : 'border-transparent text-white/85 hover:text-white'}`}>{t(category.label)}</button>;
              })}
            </nav>
          </div>
        </div>
      </div>
      {activeCategory ? <div className="hidden lg:block" onMouseEnter={() => openMenu(activeCategory.key)}><MegaMenuPanel category={activeCategory} onClose={closeMenuImmediately} /></div> : null}
    </header>
  );
}
