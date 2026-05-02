import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import AdminDataToolbar from '../components/AdminDataToolbar';
import { orders } from '../data/adminMockData';
import { exportRowsToCsv } from '../../utils/export';

const columns = [
  { key: 'id', label: 'Order ID', render: (value, row) => <Link to={`/admin/orders/${encodeURIComponent(row.id)}`} className="font-semibold text-slate-950 underline-offset-4 hover:underline">{value}</Link> },
  { key: 'customer', label: 'Customer' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total', render: (value) => `$${value}`, exportValue: (value) => value },
  { key: 'payment', label: 'Payment', type: 'badge' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'date', label: 'Date' },
  { key: 'actions', label: 'Actions', render: (_, row) => <Link to={`/admin/orders/${encodeURIComponent(row.id)}`} className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">View Details</Link> },
];

export default function AdminOrdersPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = orders.filter((row) => {
      const matchesQuery = !normalizedQuery || [row.id, row.customer, row.vendor, row.status, row.payment, row.date].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'all' || row.status === status;
      const matchesPayment = payment === 'all' || row.payment === payment;
      return matchesQuery && matchesStatus && matchesPayment;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return a.date.localeCompare(b.date);
        case 'total-desc': return b.total - a.total;
        case 'total-asc': return a.total - b.total;
        default: return b.date.localeCompare(a.date);
      }
    });

    return nextRows;
  }, [query, status, payment, sortBy]);

  return (
    <div className="grid gap-6">
      <AdminSectionCard
        title="Orders management"
        subtitle="Filter, review, and operate marketplace orders from one place."
        actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Bulk actions</button>}
      >
        <AdminDataToolbar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search order ID, customer, vendor"
          filters={[
            { key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(orders.map((row) => row.status))).map((value) => ({ value, label: value }))] },
            { key: 'payment', value: payment, onChange: setPayment, options: [{ value: 'all', label: 'All payment states' }, ...Array.from(new Set(orders.map((row) => row.payment))).map((value) => ({ value, label: value }))] },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'date-desc', label: 'Newest first' },
            { value: 'date-asc', label: 'Oldest first' },
            { value: 'total-desc', label: 'Highest total' },
            { value: 'total-asc', label: 'Lowest total' },
          ]}
          onExport={() => exportRowsToCsv(filteredRows, columns, 'admin-orders.csv')}
          resultCount={filteredRows.length}
        />
        <AdminTable columns={columns} rows={filteredRows} rowKey="id" />
      </AdminSectionCard>
    </div>
  );
}
