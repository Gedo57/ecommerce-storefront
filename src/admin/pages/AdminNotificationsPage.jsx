import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import { notificationsFeed } from '../data/adminMockData';

export default function AdminNotificationsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Unread', value: '2' },
          { label: 'Queued', value: '1' },
          { label: 'Automations', value: '6 rules' },
          { label: 'High Priority', value: '2 items' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <AdminSectionCard title="Notification center" subtitle="Operational alerts, finance signals, and workflow messages.">
        <AdminTable
          rowKey="id"
          columns={[
            { key: 'event', label: 'Event' },
            { key: 'target', label: 'Target' },
            { key: 'channel', label: 'Channel' },
            { key: 'priority', label: 'Priority', type: 'badge' },
            { key: 'status', label: 'Status', type: 'badge' },
            { key: 'time', label: 'Time' },
          ]}
          rows={notificationsFeed}
        />
      </AdminSectionCard>
    </div>
  );
}
