import { useMemo } from 'react';
import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import BestSellersSection from '../components/BestSellersSection';
import HomeCollectionsSection from '../components/HomeCollectionsSection';
import FlashSaleSection from '../components/FlashSaleSection';
import useProducts from '../hooks/useProducts';
import { getContentSettings, getRecentlyViewed } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';
import { useLocale } from '../context/LocaleContext';
export default function HomePage() { const { products } = useProducts(); const content = getContentSettings(); const recentlyViewed = getRecentlyViewed(); const { t } = useLocale(); useDocumentMeta({ title: content.heroTitle, description: content.heroSubtitle }); const bestSellers = useMemo(() => [...products].sort((a, b) => b.rating - a.rating || b.price - a.price).slice(0, 10), [products]); return <><Hero /><div className="mx-auto mt-6 max-w-[1400px] rounded-sm bg-black px-4 py-3 text-right text-sm text-white sm:px-6 lg:px-8">{t(content.announcement)}</div><CategoryShowcase /><HomeCollectionsSection /><FlashSaleSection products={bestSellers.slice(0, 4)} /><BestSellersSection products={bestSellers} />{recentlyViewed.length ? <section className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px] text-right"><h2 className="text-2xl font-black text-black">{t('شوهد مؤخرًا')}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recentlyViewed.slice(0, 4).map((item) => <div key={item.id} className="rounded-sm border border-black/10 p-4"><img src={item.image} alt={item.title} className="mx-auto h-36 w-full object-contain" /><p className="mt-3 line-clamp-2 text-sm text-black">{item.title}</p></div>)}</div></div></section> : null}</>; }
