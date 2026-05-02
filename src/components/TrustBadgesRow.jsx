const defaultBadges = [
  { title: 'شحن سريع', description: 'خيارات Standard و Express مع وقت توصيل واضح.' },
  { title: 'إرجاع سهل', description: 'سياسة إرجاع واستبدال واضحة داخل صفحات الدعم.' },
  { title: 'دفع آمن', description: 'Checkout منظم مع وسائل دفع جاهزة للربط لاحقًا.' },
  { title: 'منتج أصلي', description: 'واجهة توضح الثقة والشفافية قبل إتمام الشراء.' },
];

export default function TrustBadgesRow({ badges = defaultBadges, compact = false }) {
  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
      {badges.map((badge) => (
        <div key={badge.title} className="rounded-sm border border-black/10 bg-[#faf7f3] p-4 text-right">
          <p className="text-sm font-black text-black">{badge.title}</p>
          <p className="mt-2 text-xs leading-6 text-black/65">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
