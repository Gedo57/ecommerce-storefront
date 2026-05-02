import { useLocale } from '../context/LocaleContext';
const categoryItems = [
  { name: 'نساء', icon: '👗' }, { name: 'فساتين كبيرة', icon: '🧥' }, { name: 'أطفال', icon: '🧒' }, { name: 'رجال', icon: '👔' },
  { name: 'حقائب وأمتعة', icon: '👜' }, { name: 'إلكترونيات', icon: '📱' }, { name: 'المنزل والمطبخ', icon: '🏠' }, { name: 'الجمال والصحة', icon: '💄' },
  { name: 'مجوهرات وإكسسوارات', icon: '💍' }, { name: 'أحذية', icon: '👠' }, { name: 'ملابس علوية', icon: '👚' }, { name: 'ملابس نوم', icon: '🩱' },
];
export default function CategoryShowcase() {
  const { t } = useLocale();
  return <section id="categories" className="px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px] rounded-none bg-white px-2 py-4 sm:px-4"><div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">{categoryItems.map((item) => <a key={item.name} href="#products" className="group flex flex-col items-center text-center"><div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f5f5f5] text-4xl transition group-hover:bg-[#ececec] sm:h-28 sm:w-28"><span>{item.icon}</span></div><p className="mt-3 max-w-[120px] text-sm font-medium leading-6 text-black/80">{t(item.name)}</p></a>)}</div></div></section>;
}
