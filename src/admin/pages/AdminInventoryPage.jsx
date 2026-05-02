import AdminSectionCard from '../components/AdminSectionCard';
import AdminStatCard from '../components/AdminStatCard';
import AdminTable from '../components/AdminTable';
import { inventoryHealth } from '../data/adminMockData';

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'product', label: 'Product' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'onHand', label: 'On Hand' },
  { key: 'reserved', label: 'Reserved' },
  { key: 'reorderPoint', label: 'Reorder Point' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function AdminInventoryPage() {
  const lowStock = inventoryHealth.filter((item) => item.status === 'Low Stock').length;
  const outOfStock = inventoryHealth.filter((item) => item.status === 'Out of Stock').length;
  const healthy = inventoryHealth.filter((item) => item.status === 'Healthy').length;
  const totalUnits = inventoryHealth.reduce((sum, item) => sum + item.onHand, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total visible units" value={totalUnits} meta="sample inventory" tone="dark" />
        <AdminStatCard label="Healthy SKUs" value={healthy} meta="within stock threshold" />
        <AdminStatCard label="Low stock" value={lowStock} meta="needs replenishment" tone="accent" />
        <AdminStatCard label="Out of stock" value={outOfStock} meta="recovery required" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard title="Inventory controls" subtitle="Priority operational checks for stock flow and warehouse coverage.">
          <div className="grid gap-3">
            {[
              { label: 'Reorder now', value: `${lowStock + outOfStock} SKUs`, note: 'below target stock or unavailable' },
              { label: 'Reserved units', value: inventoryHealth.reduce((sum, item) => sum + item.reserved, 0), note: 'committed to open orders' },
              { label: 'Warehouse count', value: new Set(inventoryHealth.map((item) => item.warehouse)).size, note: 'locations currently represented' },
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
          title="Inventory health"
          subtitle="SKU-level stock visibility across warehouses and vendors."
          actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Download stock report</button>}
        >
          <AdminTable columns={columns} rows={inventoryHealth} rowKey="sku" />
        </AdminSectionCard>
      </div>
    </div>
  );
}
