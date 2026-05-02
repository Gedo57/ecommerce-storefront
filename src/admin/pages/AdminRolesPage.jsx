import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import { rolePermissions } from '../data/adminMockData';

export default function AdminRolesPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Role templates', value: '5 active', note: 'Admin, Ops, Support, Finance, Content' },
          { title: 'Permission groups', value: '18', note: 'Scoped by products, orders, finance, CMS' },
          { title: 'Audit coverage', value: 'High', note: 'Critical actions require elevated access' },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>

      <AdminSectionCard title="Roles and permissions" subtitle="Reference permission matrix for staff-level access control.">
        <AdminTable
          rowKey="role"
          columns={[
            { key: 'role', label: 'Role' },
            { key: 'users', label: 'Users' },
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'finance', label: 'Finance' },
            { key: 'cms', label: 'CMS' },
            { key: 'status', label: 'Status', type: 'badge' },
          ]}
          rows={rolePermissions}
        />
      </AdminSectionCard>
    </div>
  );
}
