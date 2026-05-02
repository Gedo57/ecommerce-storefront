function Badge({ value }) {
  const normalized = String(value).toLowerCase();
  const className = normalized.includes('active') || normalized.includes('paid') || normalized.includes('delivered')
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : normalized.includes('pending') || normalized.includes('review') || normalized.includes('processing') || normalized.includes('ready')
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : normalized.includes('return') || normalized.includes('refund') || normalized.includes('suspend') || normalized.includes('out')
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>{value}</span>;
}

export default function AdminTable({ columns, rows, rowKey, emptyMessage = 'No matching records found.' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr key={row[rowKey]} className="border-t border-slate-100 bg-white align-top hover:bg-slate-50/80">
                {columns.map((column) => {
                  const value = row[column.key];
                  if (column.type === 'badge') {
                    return (
                      <td key={column.key} className="px-4 py-4">
                        <Badge value={value} />
                      </td>
                    );
                  }
                  if (column.render) {
                    return (
                      <td key={column.key} className="px-4 py-4 text-slate-700">
                        {column.render(value, row)}
                      </td>
                    );
                  }
                  return (
                    <td key={column.key} className="px-4 py-4 text-slate-700">
                      {value}
                    </td>
                  );
                })}
              </tr>
            )) : (
              <tr className="border-t border-slate-100 bg-white">
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm font-medium text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
