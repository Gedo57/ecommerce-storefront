const features = [
  {
    title: 'Fashion-first browsing',
    description: 'Lighter cards, cleaner spacing, and a more editorial landing section give the storefront a stronger retail identity.',
  },
  {
    title: 'Filter layout inspired by marketplaces',
    description: 'A sidebar-style filter and result controls make the catalog feel closer to a real shopping experience.',
  },
  {
    title: 'Soft premium palette',
    description: 'The UI now blends off-white, white, beige, black, and coffee tones for a calmer and more elegant look.',
  },
];

export default function Features() {
  return (
    <section id="features" className="px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-brand-900/10 bg-[rgba(255,253,250,0.86)] p-8 shadow-soft lg:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Storefront polish</p>
          <h2 className="mt-3 text-3xl font-black text-brand-900 sm:text-4xl">A cleaner shopping atmosphere inspired by fashion retail layouts.</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[1.8rem] border border-brand-900/10 bg-white p-6 shadow-card">
              <h3 className="text-lg font-bold text-brand-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-900/68">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
