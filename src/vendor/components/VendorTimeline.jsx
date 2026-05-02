export default function VendorTimeline({ steps }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <h3 className="text-xl font-black text-slate-950">Timeline</h3>
      <div className="mt-5 grid gap-4">
        {steps.map((step, index) => (
          <div key={`${step.label}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`mt-1 h-3 w-3 rounded-full ${step.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              {index !== steps.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-slate-900">{step.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{step.time}</p>
              {step.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{step.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
