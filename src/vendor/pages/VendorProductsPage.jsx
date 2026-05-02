import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorTableCard from '../components/VendorTableCard';
import VendorDataToolbar from '../components/VendorDataToolbar';
import { getVendorWorkspaceProducts } from '../../utils/vendorWorkspaceStorage';
import { exportRowsToCsv } from '../../utils/export';

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

const exportColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'basePrice', label: 'Base Price' },
  { key: 'salePrice', label: 'Sale Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
];

export default function VendorProductsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updated-desc');
  const products = useMemo(() => getVendorWorkspaceProducts(), []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = products.filter((product) => {
      const matchesQuery = !normalizedQuery || [product.sku, product.name, product.category, product.brand, product.status].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'all' || product.status === status;
      return matchesQuery && matchesStatus;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'stock-desc': return b.stock - a.stock;
        case 'stock-asc': return a.stock - b.stock;
        default: return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
      }
    });
    return nextRows;
  }, [products, query, status, sortBy]);

  const rows = filteredProducts.map((product) => ({
    sku: product.sku,
    name: product.name,
    price: product.salePrice > 0 ? `${formatMoney(product.salePrice)} sale / ${formatMoney(product.basePrice)}` : formatMoney(product.basePrice),
    stock: product.stock,
    status: product.status,
    action: (
      <div className="flex flex-wrap gap-2">
        <Link to={`/vendor/products/${product.id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">Details</Link>
        <Link to={`/vendor/products/${product.id}/edit`} className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800">Edit</Link>
      </div>
    ),
  }));

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Phase 4C"
        title="Vendor Products"
        description="Catalog now supports search, filtering, sorting, and export so the merchant can operate the product table like a real workspace."
        actions={<Link to="/vendor/products/new" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Add Product</Link>}
      />

      <VendorTableCard
        title="Catalog List"
        description="Use filters and export to operate the product queue more efficiently."
        controls={
          <VendorDataToolbar
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search product, SKU, category, brand"
            filters={[{ key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(products.map((row) => row.status))).map((value) => ({ value, label: value }))] }]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[{ value: 'updated-desc', label: 'Recently updated' }, { value: 'name-asc', label: 'Name A → Z' }, { value: 'stock-desc', label: 'Highest stock' }, { value: 'stock-asc', label: 'Lowest stock' }]}
            onExport={() => exportRowsToCsv(filteredProducts, exportColumns, 'vendor-products.csv')}
            resultCount={filteredProducts.length}
          />
        }
        columns={[
          { key: 'sku', label: 'SKU' },
          { key: 'name', label: 'Product' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Actions' },
        ]}
        rows={rows}
      />
    </div>
  );
}
