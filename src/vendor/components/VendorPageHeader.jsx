import { Link } from 'react-router-dom';

export default function VendorPageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">{eyebrow}</p> : null}
          <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
