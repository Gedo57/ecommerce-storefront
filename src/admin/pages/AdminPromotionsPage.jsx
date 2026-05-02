import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import { promotions } from '../data/adminMockData';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const columns = [
  { key: 'id', label: 'Promo ID' },
  { key: 'name', label: 'Campaign' },
  { key: 'type', label: 'Type', type: 'badge' },
  { key: 'scope', label: 'Scope' },
  { key: 'usage', label: 'Usage' },
  { key: 'budget', label: 'Budget', render: (value) => formatMoney(value) },
  { key: 'window', label: 'Window' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function AdminPromotionsPage() {
  const active = promotions.filter((item) => item.status === 'Active').length;
  const scheduled = promotions.filter((item) => item.status === 'Scheduled').length;
  const budget = promotions.reduce((sum, item) => sum + item.budget, 0);
  const usage = promotions.reduce((sum, item) => sum + item.usage, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Active campaigns" value={active} meta="currently running" tone="dark" />
        <AdminStatCard label="Scheduled" value={scheduled} meta="queued next" />
        <AdminStatCard label="Tracked budget" value={formatMoney(budget)} meta="visible promotions" tone="accent" />
        <AdminStatCard label="Usage count" value={usage.toLocaleString()} meta="coupon + campaign redemptions" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSectionCard title="Marketing control tower" subtitle="High-level state of discounts, boosts, and marketplace campaigns.">
          <div className="grid gap-3">
            {[
              { label: 'Flash-sale pressure', value: `${promotions.filter((item) => item.type === 'Flash Sale').length} live`, note: 'time-sensitive marketplace conversion' },
              { label: 'Coupon exposure', value: `${promotions.filter((item) => item.type === 'Coupon').length} coupon sets`, note: 'new-customer and retention levers' },
              { label: 'Vendor boosts', value: `${promotions.filter((item) => item.scope === 'Vendor').length} campaigns`, note: 'merchant visibility inventory' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Promotions"
          subtitle="Coupons, flash sales, feature placements, and scheduled campaign windows."
          actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Create promotion</button>}
        >
          <AdminTable columns={columns} rows={promotions} rowKey="id" />
        </AdminSectionCard>
      </div>
    </div>
  );
}
