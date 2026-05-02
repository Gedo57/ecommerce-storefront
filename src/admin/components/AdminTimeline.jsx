export default function AdminTimeline({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-3 w-3 rounded-full bg-slate-950" />
            {index < items.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
          </div>
          <div className="pb-5">
            <p className="text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{item.time}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
