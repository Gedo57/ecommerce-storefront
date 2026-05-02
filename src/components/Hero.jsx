import { useLocale } from '../context/LocaleContext';

const leftBanners = [
  { title: 'رمز الشباب', subtitle: 'صيحات يومية ناعمة ومريحة' },
  { title: 'إطلالة كاجوال', subtitle: 'ستايل بسيط يناسب كل يوم' },
  { title: 'رومانسية العطلة', subtitle: 'فساتين وخامات أخف للموسم' },
];
const rightBanners = [
  { title: 'DAZY', subtitle: 'ستايل عصري ناعم' },
  { title: 'MOTF', subtitle: 'قطع أنيقة يومية' },
  { title: 'ANEWSTA', subtitle: 'لمسات موضة أبسط' },
];

export default function Hero() {
  const { t, dir } = useLocale();
  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <div className="grid gap-4">
            {leftBanners.map((item, index) => (
              <article key={item.title} className="relative min-h-[86px] overflow-hidden rounded-lg border border-black/10 bg-[linear-gradient(90deg,#d7ccc3_0%,#c3b4a8_35%,#efe8e1_100%)] p-4">
                <div className={`flex h-full items-center justify-between gap-4 ${dir === 'ltr' ? 'flex-row' : ''}`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 text-xl">{['🧥', '👚', '👗'][index]}</div>
                  <div className={dir === 'ltr' ? 'text-left' : 'text-right'}>
                    <h3 className="text-xl font-black text-white drop-shadow-sm">{t(item.title)}</h3>
                    <p className="mt-1 text-xs text-white/85">{t(item.subtitle)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <article className="relative min-h-[262px] overflow-hidden rounded-lg border border-black/10 bg-[linear-gradient(135deg,#e9ddcf_0%,#f5ede5_55%,#e4d4c5_100%)] p-6 md:p-8">
            <div className="grid h-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className={`order-2 ${dir === 'ltr' ? 'text-left lg:order-2' : 'text-right lg:order-1'}`}>
                <p className="text-sm font-bold tracking-wide text-black/75">#SETNewSeason</p>
                <h2 className="mt-2 text-4xl font-black leading-tight text-black sm:text-5xl lg:text-6xl">{t('خصم كبير')}<br />{t('على تشكيلات')}<br />{t('الموسم')}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-black/70 sm:text-base">{t('واجهة أنظف وأقرب لستايل مواقع الفاشون، مع بانر رئيسي أوضح، أقسام أبسط، وفلترة منظمة داخل صفحة المنتجات.')}</p>
                <div className={`mt-6 flex flex-wrap gap-3 ${dir === 'ltr' ? 'justify-start' : 'justify-end'}`}>
                  <a href="#products" className="rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85">{t('تسوّق الآن')}</a>
                  <a href="#categories" className="rounded-md border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5">{t('تصفح الأقسام')}</a>
                </div>
              </div>
              <div className={`order-1 flex items-center justify-center ${dir === 'ltr' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative flex h-[210px] w-full max-w-[360px] items-center justify-center rounded-[28px] bg-white/55 backdrop-blur md:h-[250px]">
                  <div className="absolute -right-4 top-6 h-10 w-10 rounded-full bg-[#f8c9d8]" />
                  <div className="absolute -left-2 bottom-7 h-9 w-9 rounded-full bg-[#ffb74d]" />
                  <div className="absolute left-12 top-5 h-6 w-6 rounded-full bg-[#efe8ff]" />
                  <div className="text-center text-black/80"><div className="text-7xl">🧕🏻👩🏻👧🏻</div><p className="mt-3 text-sm font-semibold">{t('بانر رئيسي واسع على طريقة متاجر الفاشون')}</p></div>
                </div>
              </div>
            </div>
          </article>
          <div className="grid gap-4">
            {rightBanners.map((item) => (
              <article key={item.title} className="min-h-[86px] overflow-hidden rounded-lg border border-black/10 bg-[linear-gradient(135deg,#8f8478_0%,#665a4e_100%)] p-4">
                <div className={`flex h-full flex-col justify-center text-white ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                  <h3 className="text-[2rem] font-light tracking-[0.18em]">{item.title}</h3>
                  <p className="text-xs text-white/80">{t(item.subtitle)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
