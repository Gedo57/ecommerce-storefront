import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import { cmsBlocks } from '../data/adminMockData';

export default function AdminCmsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Published Blocks', value: '12' },
          { label: 'Scheduled', value: '4' },
          { label: 'Drafts', value: '7' },
          { label: 'Policy Pages', value: '9' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <AdminSectionCard
        title="Content management"
        subtitle="Homepage, policies, landing pages, and merchandising content blocks."
        actions={<button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Create block</button>}
      >
        <AdminTable
          rowKey="id"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'section', label: 'Section' },
            { key: 'owner', label: 'Owner' },
            { key: 'lastUpdated', label: 'Last Updated' },
            { key: 'schedule', label: 'Schedule' },
            { key: 'status', label: 'Status', type: 'badge' },
          ]}
          rows={cmsBlocks}
        />
      </AdminSectionCard>
    </div>
  );
}
