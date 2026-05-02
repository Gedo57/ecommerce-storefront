import { Link, Navigate, useParams } from 'react-router-dom';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorInfoGrid from '../components/VendorInfoGrid';
import VendorTimeline from '../components/VendorTimeline';
import { vendorOrders } from '../data/vendorMockData';

const orderNotes = {
  '#V-12051': 'Customer selected express delivery and requested minimal packaging damage risk handling.',
  '#V-12052': 'Shipping label has been prepared and waiting courier pickup window.',
  '#V-12053': 'Order delivered successfully with no open support cases.',
  '#V-12054': 'Payment still pending verification before fulfillment can start.',
};

const timelines = {
  Processing: [
    { label: 'Order created', time: 'Apr 21 · 10:14', active: true, note: 'Customer placed the order through storefront checkout.' },
    { label: 'Payment captured', time: 'Apr 21 · 10:16', active: true, note: 'Payment authorized and allocated to merchant queue.' },
    { label: 'Warehouse packing', time: 'Apr 21 · 13:05', active: true, note: 'Merchant team is preparing items for dispatch.' },
    { label: 'Ready to ship', time: 'Pending', active: false, note: 'Awaiting completion of current fulfillment step.' },
  ],
  'Ready to Ship': [
    { label: 'Order created', time: 'Apr 22 · 09:42', active: true },
    { label: 'Payment captured', time: 'Apr 22 · 09:44', active: true },
    { label: 'Label created', time: 'Apr 22 · 11:15', active: true },
    { label: 'Courier pickup', time: 'Pending', active: false },
  ],
  Delivered: [
    { label: 'Order created', time: 'Apr 22 · 08:05', active: true },
    { label: 'Shipped', time: 'Apr 22 · 16:25', active: true },
    { label: 'Out for delivery', time: 'Apr 23 · 09:00', active: true },
    { label: 'Delivered', time: 'Apr 23 · 14:12', active: true, note: 'Proof of delivery marked successful.' },
  ],
  Pending: [
    { label: 'Order created', time: 'Apr 23 · 11:08', active: true },
    { label: 'Awaiting payment', time: 'Open', active: true, note: 'Payment validation is still incomplete.' },
    { label: 'Merchant review', time: 'Pending', active: false },
  ],
};

export default function VendorOrderDetailsPage() {
  const { orderId } = useParams();
  const decodedOrderId = decodeURIComponent(orderId || '');
  const order = vendorOrders.find((item) => item.id === decodedOrderId);

  if (!order) {
    return <Navigate to="/vendor/orders" replace />;
  }

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Order Details"
        title={`Order ${order.id}`}
        description={orderNotes[order.id] || 'Order detail workspace for the merchant team.'}
        actions={
          <Link to="/vendor/orders" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back to Orders
          </Link>
        }
      />

      <VendorInfoGrid
        items={[
          { label: 'Customer', value: order.customer },
          { label: 'Order Total', value: order.total },
          { label: 'Order Status', value: order.status },
          { label: 'Fulfillment', value: order.fulfillment },
          { label: 'Order Date', value: order.date },
          { label: 'Tracking Ref', value: `${order.id.replace('#', 'TRK-')}` },
        ]}
        columns={3}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-xl font-black text-slate-950">Assigned Items</h3>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">SKU</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Item</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Qty</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">SET-DRS-101</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">Satin Evening Dress</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">1</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">$84</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-700">SET-BAG-008</td>
                  <td className="px-4 py-3 text-sm text-slate-700">Mini Leather Bag</td>
                  <td className="px-4 py-3 text-sm text-slate-700">1</td>
                  <td className="px-4 py-3 text-sm text-slate-700">$48</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <VendorTimeline steps={timelines[order.status] || timelines.Processing} />
      </section>
    </div>
  );
}
