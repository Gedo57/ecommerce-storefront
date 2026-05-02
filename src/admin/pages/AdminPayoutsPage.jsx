import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import { payouts } from '../data/adminMockData';

export default function AdminPayoutsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Pending Review', value: '2 batches' },
          { label: 'Ready to Release', value: '$17,640' },
          { label: 'On Hold', value: '1 vendor' },
          { label: 'Paid This Cycle', value: '$11,160' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <AdminSectionCard
        title="Vendor payouts"
        subtitle="Settlement readiness, commission visibility, and payment-cycle state."
        actions={<button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Release selected</button>}
      >
        <AdminTable
          rowKey="id"
          columns={[
            { key: 'id', label: 'Batch' },
            { key: 'vendor', label: 'Vendor' },
            { key: 'cycle', label: 'Cycle' },
            { key: 'gross', label: 'Gross' },
            { key: 'commission', label: 'Commission' },
            { key: 'net', label: 'Net' },
            { key: 'status', label: 'Status', type: 'badge' },
          ]}
          rows={payouts}
        />
      </AdminSectionCard>
    </div>
  );
}
