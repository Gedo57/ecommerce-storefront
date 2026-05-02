import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import { reviews } from '../data/adminMockData';

const columns = [
  { key: 'id', label: 'Review ID' },
  { key: 'product', label: 'Product' },
  { key: 'customer', label: 'Customer' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'rating', label: 'Rating', type: 'badge' },
  { key: 'summary', label: 'Summary' },
  { key: 'flagged', label: 'Flagged', type: 'badge' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function AdminReviewsPage() {
  const flagged = reviews.filter((item) => item.flagged === 'Yes').length;
  const published = reviews.filter((item) => item.status === 'Published').length;
  const hidden = reviews.filter((item) => item.status === 'Hidden').length;
  const reviewQueue = reviews.filter((item) => item.status !== 'Published').length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Published" value={published} meta="live on storefront" tone="dark" />
        <AdminStatCard label="Flagged" value={flagged} meta="requires moderation" />
        <AdminStatCard label="Hidden" value={hidden} meta="suppressed from PDP" tone="accent" />
        <AdminStatCard label="Queue" value={reviewQueue} meta="needs action" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminSectionCard title="Moderation priorities" subtitle="Review quality, fraud risk, and merchant response workload.">
          <div className="grid gap-3">
            {[
              { label: 'Flagged content', value: `${flagged} review`, note: 'possible service issue or moderation trigger' },
              { label: 'Hidden reviews', value: `${hidden} hidden`, note: 'requires final decision or cleanup' },
              { label: 'Open moderation', value: `${reviewQueue} pending`, note: 'publish, hide, or escalate' },
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
          title="Reviews moderation"
          subtitle="Customer sentiment, moderation status, and vendor visibility."
          actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Export moderation log</button>}
        >
          <AdminTable columns={columns} rows={reviews} rowKey="id" />
        </AdminSectionCard>
      </div>
    </div>
  );
}
