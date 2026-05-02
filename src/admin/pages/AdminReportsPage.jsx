import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import { reportSnapshots, salesTrend, topProductsReport } from '../data/adminMockData';

export default function AdminReportsPage() {
  const maxTrend = Math.max(...salesTrend.map((item) => item.value));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportSnapshots.map((item, index) => (
          <AdminStatCard
            key={item.metric}
            label={item.metric}
            value={item.value}
            meta={`${item.delta} • ${item.period}`}
            tone={index === 0 ? 'dark' : index === 2 ? 'accent' : 'default'}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Revenue trend" subtitle="Weekly directional read for marketplace sales.">
          <div className="grid gap-4 sm:grid-cols-7">
            {salesTrend.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 px-3 py-4">
                <div className="flex h-40 items-end">
                  <div className="w-9 rounded-t-2xl bg-indigo-600" style={{ height: `${Math.max(18, (item.value / maxTrend) * 160)}px` }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}k</p>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Reporting lenses" subtitle="Saved perspectives commonly used by leadership and operations.">
          <div className="grid gap-3">
            {['Sales by vendor', 'Sales by category', 'Refund trend', 'Payment success breakdown', 'Inventory risk report', 'AOV by channel'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Top product performance" subtitle="Best-selling SKUs with return-rate context.">
        <AdminTable
          rowKey="sku"
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'product', label: 'Product' },
            { key: 'vendor', label: 'Vendor' },
            { key: 'unitsSold', label: 'Units Sold' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'returnRate', label: 'Return Rate' },
          ]}
          rows={topProductsReport}
        />
      </AdminSectionCard>
    </div>
  );
}
