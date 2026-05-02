import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import AdminDataToolbar from '../components/AdminDataToolbar';
import { customers } from '../data/adminMockData';
import { exportRowsToCsv } from '../../utils/export';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const columns = [
  { key: 'id', label: 'Customer ID', render: (value, row) => <Link to={`/admin/customers/${row.id}`} className="font-semibold text-slate-950 underline-offset-4 hover:underline">{value}</Link> },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'tier', label: 'Tier', type: 'badge' },
  { key: 'orders', label: 'Orders' },
  { key: 'spent', label: 'LTV', render: (value) => formatMoney(value), exportValue: (value) => value },
  { key: 'lastOrder', label: 'Last Order' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'actions', label: 'Actions', render: (_, row) => <Link to={`/admin/customers/${row.id}`} className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">View Details</Link> },
];

export default function AdminCustomersPage() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('spent-desc');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = customers.filter((row) => {
      const matchesQuery = !normalizedQuery || [row.id, row.name, row.email, row.tier, row.status].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesTier = tier === 'all' || row.tier === tier;
      const matchesStatus = status === 'all' || row.status === status;
      return matchesQuery && matchesTier && matchesStatus;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'orders-desc': return b.orders - a.orders;
        case 'orders-asc': return a.orders - b.orders;
        case 'spent-asc': return a.spent - b.spent;
        default: return b.spent - a.spent;
      }
    });

    return nextRows;
  }, [query, tier, status, sortBy]);

  const activeCount = customers.filter((item) => item.status === 'Active').length;
  const vipCount = customers.filter((item) => item.tier === 'VIP' || item.tier === 'Gold').length;
  const totalSpend = customers.reduce((sum, item) => sum + item.spent, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Customers" value={customers.length} meta={`${activeCount} active`} tone="dark" />
        <AdminStatCard label="VIP + Gold" value={vipCount} meta="high value segments" />
        <AdminStatCard label="Tracked LTV" value={formatMoney(totalSpend)} meta="current visible sample" tone="accent" />
        <AdminStatCard label="Needs Review" value={customers.filter((item) => item.status !== 'Active').length} meta="suspended or flagged" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSectionCard title="Segmentation snapshot" subtitle="Quick view of customer mix and action priority.">
          <div className="grid gap-3">
            {[
              { label: 'VIP / Gold accounts', value: `${vipCount} customers`, note: 'loyalty, retention, concierge offers' },
              { label: 'Recently active', value: `${activeCount} customers`, note: 'opened orders or recent purchases' },
              { label: 'Review queue', value: `${customers.filter((item) => item.status === 'Review').length} accounts`, note: 'manual checks or edge cases' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Customer management" subtitle="Profile status, spend quality, and recent order activity.">
          <AdminDataToolbar
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search customer name, email, ID"
            filters={[
              { key: 'tier', value: tier, onChange: setTier, options: [{ value: 'all', label: 'All tiers' }, ...Array.from(new Set(customers.map((row) => row.tier))).map((value) => ({ value, label: value }))] },
              { key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(customers.map((row) => row.status))).map((value) => ({ value, label: value }))] },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: 'spent-desc', label: 'Highest LTV' },
              { value: 'spent-asc', label: 'Lowest LTV' },
              { value: 'orders-desc', label: 'Most orders' },
              { value: 'orders-asc', label: 'Fewest orders' },
              { value: 'name-asc', label: 'Name A → Z' },
            ]}
            onExport={() => exportRowsToCsv(filteredRows, columns, 'admin-customers.csv')}
            resultCount={filteredRows.length}
          />
          <AdminTable columns={columns} rows={filteredRows} rowKey="id" />
        </AdminSectionCard>
      </div>
    </div>
  );
}
