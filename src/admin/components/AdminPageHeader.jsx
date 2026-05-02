import { Link } from 'react-router-dom';

export default function AdminPageHeader({ eyebrow = 'Admin Detail', title, description, backTo = '/admin', backLabel = 'Back', actions }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <Link to={backTo} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            {backLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
