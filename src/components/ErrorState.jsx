export default function ErrorState({ message }) {
  return (
    <div className="rounded-[1.8rem] border border-red-200 bg-white p-6 text-center shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-700">Catalog Error</p>
      <h3 className="mt-3 text-2xl font-black text-brand-900">Unable to load products right now.</h3>
      <p className="mt-3 text-sm leading-7 text-brand-900/70">{message}</p>
      <p className="mt-4 text-sm text-brand-900/55">Please check your connection and try again in a moment.</p>
    </div>
  );
}
