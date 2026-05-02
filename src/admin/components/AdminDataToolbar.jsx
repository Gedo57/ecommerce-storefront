export default function AdminDataToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  sortValue,
  onSortChange,
  sortOptions = [],
  onExport,
  resultCount,
}) {
  return (
    <div className="mb-5 grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(160px,1fr))_auto]">
      <input
        type="text"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
      />

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ))}

      <select
        value={sortValue}
        onChange={(event) => onSortChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <button type="button" onClick={onExport} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Export CSV
      </button>

      <div className="flex items-center justify-end rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 xl:col-span-full xl:justify-start">
        {resultCount} result(s)
      </div>
    </div>
  );
}
