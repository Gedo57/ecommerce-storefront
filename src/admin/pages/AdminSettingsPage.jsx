import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import { systemSettings } from '../data/adminMockData';

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <AdminSectionCard title="System settings" subtitle="Marketplace-level configuration states for commerce operations.">
        <AdminTable
          rowKey="key"
          columns={[
            { key: 'key', label: 'Setting' },
            { key: 'value', label: 'Value' },
            { key: 'owner', label: 'Owner' },
            { key: 'scope', label: 'Scope' },
            { key: 'status', label: 'Status', type: 'badge' },
          ]}
          rows={systemSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Configuration packs" subtitle="Operational bundles usually exposed in advanced admin tooling.">
        <div className="grid gap-3">
          {[
            'Store profile and contact data',
            'Default currency and pricing behavior',
            'Tax and checkout configuration',
            'Authentication and password policy',
            'Vendor onboarding rules',
            'Notification routing defaults',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
