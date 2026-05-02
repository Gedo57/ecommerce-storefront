import { useCurrency } from '../context/CurrencyContext';

const collectionColumns = [
  { title: 'عروض كبرى', badge: '⚡', items: [
    { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', price: 22.91, note: 'تخفيضات سريعة' },
    { image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80', price: 3.96, note: 'خصم 1%' },
  ]},
  { title: 'أهم الترندات', badge: '🔥', items: [
    { image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', price: 67, note: 'ترندات نسائية أنيقة' },
    { image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', price: 4, note: 'إضافة أنيقة' },
  ]},
  { title: 'منطقة العظمة', badge: '✨', items: [
    { image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', price: 11.36, note: 'خصم 5%' },
    { image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', price: 34.89, note: 'خصم 8%' },
  ]},
];

function CollectionColumn({ column, formatPrice }) {
  return (
    <article className="rounded-sm bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
      <div className="mb-3 flex items-center justify-between"><span className="text-sm">{column.badge}</span><h3 className="text-base font-black text-black">{column.title}</h3></div>
      <div className="grid grid-cols-2 gap-2">
        {column.items.map((item) => (
          <div key={`${column.title}-${item.image}`} className="text-right">
            <div className="overflow-hidden bg-[#f4f4f4]"><img src={item.image} alt={column.title} className="aspect-[0.85] w-full object-cover" /></div>
            <p className="mt-2 text-sm font-bold text-[#f56b00]">{formatPrice(item.price)}</p>
            <p className="text-xs text-[#f56b00]">{item.note}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function HomeCollectionsSection() {
  const { formatPrice } = useCurrency();
  return <section className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px]"><div className="grid gap-4 lg:grid-cols-3">{collectionColumns.map((column) => <CollectionColumn key={column.title} column={column} formatPrice={formatPrice} />)}</div></div></section>;
}
