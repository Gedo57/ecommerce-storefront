export default function AdminInfoGrid({ items, columns = 3 }) {
  const gridClass = columns === 4 ? 'xl:grid-cols-4' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
          <p className="mt-2 text-lg font-bold text-slate-950">{item.value}</p>
          {item.note ? <p className="mt-2 text-sm leading-6 text-slate-500">{item.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
