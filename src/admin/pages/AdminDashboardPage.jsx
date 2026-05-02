import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import { adminAlerts, adminOverview, orders, salesTrend, vendors } from '../data/adminMockData';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export default function AdminDashboardPage() {
  const maxTrend = Math.max(...salesTrend.map((item) => item.value));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Gross revenue" value={formatMoney(adminOverview.revenue)} meta="+12.4% vs last week" tone="dark" />
        <AdminStatCard label="Orders" value={adminOverview.orders.toLocaleString()} meta="284 open workflows" />
        <AdminStatCard label="Active vendors" value={adminOverview.activeVendors} meta="9 under review" tone="accent" />
        <AdminStatCard label="Catalog size" value={adminOverview.products.toLocaleString()} meta={`AOV ${formatMoney(adminOverview.avgOrderValue)}`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <AdminSectionCard
          title="Sales momentum"
          subtitle="Week-level trend snapshot for the marketplace."
          actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">View full reports</button>}
        >
          <div className="grid gap-4 sm:grid-cols-7">
            {salesTrend.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 px-3 py-4">
                <div className="flex h-44 items-end">
                  <div
                    className="w-9 rounded-t-2xl bg-slate-950 transition-all"
                    style={{ height: `${Math.max(18, (item.value / maxTrend) * 176)}px` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}k</p>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Priority alerts" subtitle="Operational signals that need attention today.">
          <div className="grid gap-3">
            {adminAlerts.map((alert) => (
              <div key={alert.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{alert.detail}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {alert.tone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Recent orders" subtitle="Latest marketplace orders across all vendors.">
          <div className="grid gap-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{order.id}</p>
                  <p className="mt-1 text-sm text-slate-500">{order.customer} • {order.vendor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                  <span className="text-sm font-semibold text-slate-900">{formatMoney(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Top vendors" subtitle="Fast snapshot of vendor performance and fulfillment health.">
          <div className="grid gap-3">
            {vendors.slice(0, 4).map((vendor) => (
              <div key={vendor.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{vendor.name}</p>
                  <p className="mt-1 text-sm text-slate-500">Owner: {vendor.owner}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatMoney(vendor.revenue)}</p>
                  <p className="mt-1 text-xs text-slate-500">{vendor.orders} orders • {vendor.status}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
