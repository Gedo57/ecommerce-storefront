export default function VendorTableCard({ title, description, columns, rows, controls = null, emptyMessage = 'No matching records found.' }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {controls ? <div className="mb-4">{controls}</div> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={row.id || row.sku || index} className="odd:bg-slate-50/40">
                {columns.map((column) => (
                  <td key={column.key} className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="border-b border-slate-100 px-4 py-10 text-center text-sm font-medium text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
