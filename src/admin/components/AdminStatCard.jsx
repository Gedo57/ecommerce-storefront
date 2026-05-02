export default function AdminStatCard({ label, value, meta, tone = 'default' }) {
  const toneClass = {
    default: 'bg-white',
    dark: 'bg-slate-950 text-white',
    accent: 'bg-indigo-50',
  }[tone] || 'bg-white';

  return (
    <div className={`rounded-3xl border border-slate-200 p-5 shadow-sm ${toneClass}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{meta}</span>
      </div>
    </div>
  );
}
