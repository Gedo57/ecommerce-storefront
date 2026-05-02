import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import { refunds } from '../data/adminMockData';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const columns = [
  { key: 'id', label: 'Refund ID' },
  { key: 'orderId', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'reason', label: 'Reason' },
  { key: 'amount', label: 'Amount', render: (value) => formatMoney(value) },
  { key: 'method', label: 'Method' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function AdminRefundsPage() {
  const pending = refunds.filter((item) => item.status === 'Pending' || item.status === 'Processing').length;
  const escalated = refunds.filter((item) => item.status === 'Escalated').length;
  const resolved = refunds.filter((item) => item.status === 'Resolved' || item.status === 'Approved').length;
  const totalExposure = refunds.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Open refunds" value={pending} meta="pending or processing" tone="dark" />
        <AdminStatCard label="Escalated" value={escalated} meta="support or finance attention" />
        <AdminStatCard label="Resolved" value={resolved} meta="approved or closed" tone="accent" />
        <AdminStatCard label="Visible exposure" value={formatMoney(totalExposure)} meta="tracked sample value" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSectionCard title="Refund ops" subtitle="Operational queue for returns, finance checks, and merchant follow-up.">
          <div className="grid gap-3">
            {[
              { label: 'Original payment route', value: `${refunds.filter((item) => item.method === 'Original Payment').length} cases`, note: 'gateway-linked refund flow' },
              { label: 'Store credit', value: `${refunds.filter((item) => item.method === 'Store Credit').length} cases`, note: 'wallet or compensation resolution' },
              { label: 'Latest updates', value: refunds[0]?.updatedAt || '—', note: 'most recent queue activity date' },
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
          title="Refund queue"
          subtitle="Return reasons, reimbursement method, amount, and workflow stage."
          actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Export refund report</button>}
        >
          <AdminTable columns={columns} rows={refunds} rowKey="id" />
        </AdminSectionCard>
      </div>
    </div>
  );
}
