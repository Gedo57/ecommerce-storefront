import VendorStatCard from '../components/VendorStatCard';
import VendorTableCard from '../components/VendorTableCard';
import { vendorInventory, vendorOrders, vendorStats } from '../data/vendorMockData';

export default function VendorDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vendorStats.map((item) => (
          <VendorStatCard key={item.label} title={item.label} value={item.value} note={item.note} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <VendorTableCard
          title="Recent Orders"
          description="Live operational view for the merchant team."
          columns={[
            { key: 'id', label: 'Order' },
            { key: 'customer', label: 'Customer' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status' },
          ]}
          rows={vendorOrders}
        />
        <VendorTableCard
          title="Stock Watch"
          description="Fast snapshot of stock health across core SKUs."
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'product', label: 'Product' },
            { key: 'available', label: 'Available' },
            { key: 'incoming', label: 'Incoming' },
          ]}
          rows={vendorInventory}
        />
      </section>
    </div>
  );
}
