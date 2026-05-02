export default function AdminSectionCard({ title, subtitle, actions, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-950">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="px-5 py-5 lg:px-6">{children}</div>
    </section>
  );
}
