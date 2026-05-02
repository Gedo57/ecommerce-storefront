import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminInfoGrid from '../components/AdminInfoGrid';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTimeline from '../components/AdminTimeline';
import { orders, refunds } from '../data/adminMockData';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const order = useMemo(() => orders.find((item) => item.id === orderId), [orderId]);

  if (!order) {
    return (
      <AdminSectionCard title="Order not found" subtitle="The requested order record does not exist in the current admin demo dataset.">
        <Link to="/admin/orders" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Back to orders</Link>
      </AdminSectionCard>
    );
  }

  const relatedRefund = refunds.find((item) => item.orderId === order.id);
  const items = Array.from({ length: order.items }).map((_, index) => ({
    id: `${order.id}-item-${index + 1}`,
    title: `Line item ${index + 1}`,
    sku: `SKU-${order.id.replace('#SET-', '')}-${index + 1}`,
    quantity: 1,
    price: money(Math.max(24, Math.round(order.total / order.items))),
  }));

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Order Details"
        title={order.id}
        description="Operational drill-down for fulfillment, payment state, and customer resolution context."
        backTo="/admin/orders"
        backLabel="Back to Orders"
        actions={<button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Print Summary</button>}
      />

      <AdminInfoGrid
        items={[
          { label: 'Customer', value: order.customer },
          { label: 'Vendor', value: order.vendor },
          { label: 'Payment', value: order.payment },
          { label: 'Order Status', value: order.status },
          { label: 'Items', value: String(order.items) },
          { label: 'Order Total', value: money(order.total) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminSectionCard title="Line items" subtitle="Representative breakdown for the admin operations workflow.">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 bg-white">
                    <td className="px-4 py-4 font-medium text-slate-900">{item.title}</td>
                    <td className="px-4 py-4 text-slate-700">{item.sku}</td>
                    <td className="px-4 py-4 text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-4 text-slate-700">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Fulfillment timeline" subtitle="High-level order progress checkpoints for support and ops.">
          <AdminTimeline
            items={[
              { title: 'Order created', time: order.date, description: `The order was placed by ${order.customer} and routed to ${order.vendor}.` },
              { title: 'Payment check', time: order.payment, description: `Payment state is currently ${order.payment}. Finance and support can use this checkpoint for intervention.` },
              { title: 'Current fulfillment', time: order.status, description: `Current operational state is ${order.status}. Next actions depend on warehouse and carrier readiness.` },
              relatedRefund
                ? { title: 'Refund / return signal', time: relatedRefund.updatedAt, description: `Related refund case ${relatedRefund.id} is ${relatedRefund.status}.` }
                : { title: 'Resolution state', time: 'No refund', description: 'No active refund or return case is currently attached to this order.' },
            ]}
          />
        </AdminSectionCard>
      </div>
    </div>
  );
}
