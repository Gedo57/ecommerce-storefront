import { useMemo, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorTableCard from '../components/VendorTableCard';
import { useToast } from '../../context/ToastContext';
import {
  adjustVendorInventory,
  getVendorInventory,
  getVendorInventoryLogs,
} from '../../utils/vendorOperationsStorage';

const emptyAdjustment = {
  sku: '',
  adjustmentType: 'increase',
  quantity: '',
  reason: '',
};

export default function VendorInventoryPage() {
  const { showToast } = useToast();
  const [inventoryVersion, setInventoryVersion] = useState(0);
  const [form, setForm] = useState(emptyAdjustment);

  const inventory = useMemo(() => getVendorInventory(), [inventoryVersion]);
  const logs = useMemo(() => getVendorInventoryLogs(), [inventoryVersion]);

  const lowStockCount = inventory.filter((item) => item.available > 0 && item.available <= 10).length;
  const outOfStockCount = inventory.filter((item) => item.available <= 0).length;
  const totalAvailable = inventory.reduce((sum, item) => sum + item.available, 0);

  const rows = inventory.map((item) => ({
    ...item,
    status: item.available <= 0 ? 'Out of Stock' : item.available <= 10 ? 'Low Stock' : 'Healthy',
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.sku || !form.quantity) {
      showToast({ title: 'Missing inventory fields', description: 'Select an SKU and enter a quantity.' });
      return;
    }

    const updated = adjustVendorInventory(form);
    if (!updated) {
      showToast({ title: 'Inventory update failed', description: 'The selected SKU could not be updated.' });
      return;
    }

    setInventoryVersion((current) => current + 1);
    setForm(emptyAdjustment);
    showToast({
      title: 'Inventory updated',
      description: `${updated.product} now has ${updated.available} available units.`,
      variant: 'success',
    });
  };

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Phase 4D"
        title="Inventory Actions"
        description="Adjust stock, capture restock reasons, and review recent inventory movements from one operations module."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Available Units', value: totalAvailable, note: 'Current sellable stock across vendor warehouses.' },
          { label: 'Low Stock SKUs', value: lowStockCount, note: 'Items below healthy stock threshold.' },
          { label: 'Out of Stock', value: outOfStockCount, note: 'Catalog lines currently unavailable.' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <VendorTableCard
          title="Inventory Health"
          description="Warehouse-level stock visibility with live status derived from available units."
          columns={[
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'sku', label: 'SKU' },
            { key: 'product', label: 'Product' },
            { key: 'available', label: 'Available' },
            { key: 'reserved', label: 'Reserved' },
            { key: 'incoming', label: 'Incoming' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-xl font-black text-slate-950">Stock Adjustment</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Increase, decrease, or register incoming units with a logged operational reason.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              SKU
              <select value={form.sku} onChange={(e) => setForm((current) => ({ ...current, sku: e.target.value }))} className="filter-select">
                <option value="">Select SKU</option>
                {inventory.map((item) => <option key={item.sku} value={item.sku}>{item.sku} · {item.product}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Adjustment Type
              <select value={form.adjustmentType} onChange={(e) => setForm((current) => ({ ...current, adjustmentType: e.target.value }))} className="filter-select">
                <option value="increase">Increase available</option>
                <option value="decrease">Decrease available</option>
                <option value="incoming">Add incoming units</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Quantity
              <input type="number" min="1" value={form.quantity} onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))} className="checkout-input" placeholder="12" />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Reason
              <textarea value={form.reason} onChange={(e) => setForm((current) => ({ ...current, reason: e.target.value }))} className="checkout-input min-h-[120px]" placeholder="Supplier restock, cycle count correction, damaged units removed..." />
            </label>

            <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Apply Inventory Action
            </button>
          </form>
        </section>
      </div>

      <VendorTableCard
        title="Inventory Log"
        description="Recent adjustments recorded from the vendor workspace."
        columns={[
          { key: 'createdAt', label: 'Timestamp' },
          { key: 'sku', label: 'SKU' },
          { key: 'action', label: 'Action' },
          { key: 'quantity', label: 'Qty' },
          { key: 'reason', label: 'Reason' },
        ]}
        rows={logs.slice(0, 8)}
      />
    </div>
  );
}
