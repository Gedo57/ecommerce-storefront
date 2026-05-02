import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorTableCard from '../components/VendorTableCard';
import VendorDataToolbar from '../components/VendorDataToolbar';
import { vendorOrders } from '../data/vendorMockData';
import { exportRowsToCsv } from '../../utils/export';

const exportColumns = [
  { key: 'id', label: 'Order' },
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'fulfillment', label: 'Fulfillment' },
];

export default function VendorOrdersPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = vendorOrders.filter((row) => {
      const matchesQuery = !normalizedQuery || [row.id, row.customer, row.total, row.status, row.fulfillment, row.date].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'all' || row.status === status;
      return matchesQuery && matchesStatus;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return a.date.localeCompare(b.date);
        case 'customer-asc': return a.customer.localeCompare(b.customer);
        default: return b.date.localeCompare(a.date);
      }
    });
    return nextRows;
  }, [query, status, sortBy]);

  const rows = filteredRows.map((order) => ({
    ...order,
    action: <Link to={`/vendor/orders/${encodeURIComponent(order.id)}`} className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800">View Order</Link>,
  }));

  return (
    <div className="grid gap-6">
      <VendorPageHeader eyebrow="Operations" title="Vendor Orders" description="Orders now support search, filtering, sorting, and CSV export for faster operational follow-up." />
      <VendorTableCard
        title="Order Queue"
        description="Orders assigned to the current merchant account."
        controls={
          <VendorDataToolbar
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search order, customer, fulfillment"
            filters={[{ key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(vendorOrders.map((row) => row.status))).map((value) => ({ value, label: value }))] }]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[{ value: 'date-desc', label: 'Newest first' }, { value: 'date-asc', label: 'Oldest first' }, { value: 'customer-asc', label: 'Customer A → Z' }]}
            onExport={() => exportRowsToCsv(filteredRows, exportColumns, 'vendor-orders.csv')}
            resultCount={filteredRows.length}
          />
        }
        columns={[
          { key: 'id', label: 'Order' },
          { key: 'date', label: 'Date' },
          { key: 'customer', label: 'Customer' },
          { key: 'total', label: 'Total' },
          { key: 'status', label: 'Status' },
          { key: 'fulfillment', label: 'Fulfillment' },
          { key: 'action', label: 'Actions' },
        ]}
        rows={rows}
      />
    </div>
  );
}
