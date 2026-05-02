import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTable from '../components/AdminTable';
import AdminDataToolbar from '../components/AdminDataToolbar';
import { products } from '../data/adminMockData';
import { exportRowsToCsv } from '../../utils/export';

const columns = [
  { key: 'id', label: 'SKU / ID', render: (value, row) => <Link to={`/admin/products/${row.id}`} className="font-semibold text-slate-950 underline-offset-4 hover:underline">{value}</Link> },
  { key: 'title', label: 'Product' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'price', label: 'Price', render: (value) => `$${value}`, exportValue: (value) => value },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'actions', label: 'Actions', render: (_, row) => <Link to={`/admin/products/${row.id}`} className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">View Details</Link> },
];

export default function AdminProductsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = products.filter((row) => {
      const matchesQuery = !normalizedQuery || [row.id, row.title, row.vendor, row.category, row.status].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'all' || row.category === category;
      const matchesStatus = status === 'all' || row.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'price-desc': return b.price - a.price;
        case 'price-asc': return a.price - b.price;
        case 'stock-desc': return b.stock - a.stock;
        case 'stock-asc': return a.stock - b.stock;
        default: return a.title.localeCompare(b.title);
      }
    });

    return nextRows;
  }, [query, category, status, sortBy]);

  return (
    <div className="grid gap-6">
      <AdminSectionCard
        title="Products control"
        subtitle="Moderate catalog quality, watch stock, and manage marketplace assortments."
        actions={(
          <>
            <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Import products</button>
            <button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Add product</button>
          </>
        )}
      >
        <AdminDataToolbar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search product, SKU, vendor"
          filters={[
            { key: 'category', value: category, onChange: setCategory, options: [{ value: 'all', label: 'All categories' }, ...Array.from(new Set(products.map((row) => row.category))).map((value) => ({ value, label: value }))] },
            { key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(products.map((row) => row.status))).map((value) => ({ value, label: value }))] },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'title-asc', label: 'Title A → Z' },
            { value: 'price-desc', label: 'Highest price' },
            { value: 'price-asc', label: 'Lowest price' },
            { value: 'stock-desc', label: 'Highest stock' },
            { value: 'stock-asc', label: 'Lowest stock' },
          ]}
          onExport={() => exportRowsToCsv(filteredRows, columns, 'admin-products.csv')}
          resultCount={filteredRows.length}
        />
        <AdminTable columns={columns} rows={filteredRows} rowKey="id" />
      </AdminSectionCard>
    </div>
  );
}
