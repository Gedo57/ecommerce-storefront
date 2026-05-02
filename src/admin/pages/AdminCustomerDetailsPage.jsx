import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminInfoGrid from '../components/AdminInfoGrid';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTimeline from '../components/AdminTimeline';
import { customers, orders } from '../data/adminMockData';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export default function AdminCustomerDetailsPage() {
  const { customerId } = useParams();
  const customer = useMemo(() => customers.find((item) => item.id === customerId), [customerId]);

  if (!customer) {
    return (
      <AdminSectionCard title="Customer not found" subtitle="The requested customer profile does not exist in the current admin sample.">
        <Link to="/admin/customers" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Back to customers</Link>
      </AdminSectionCard>
    );
  }

  const customerOrders = orders.filter((item) => item.customer === customer.name);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Customer Details"
        title={customer.name}
        description="Customer value, order behavior, and service risk indicators in one profile view."
        backTo="/admin/customers"
        backLabel="Back to Customers"
        actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Create Support Note</button>}
      />

      <AdminInfoGrid
        items={[
          { label: 'Customer ID', value: customer.id },
          { label: 'Email', value: customer.email },
          { label: 'Tier', value: customer.tier },
          { label: 'Orders', value: String(customer.orders) },
          { label: 'Tracked LTV', value: money(customer.spent) },
          { label: 'Status', value: customer.status },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminSectionCard title="Account journey" subtitle="Support-facing checkpoint history for customer value and review state.">
          <AdminTimeline
            items={[
              { title: 'Customer profile active', time: customer.lastOrder, description: `${customer.name} is currently classified as ${customer.tier} tier with status ${customer.status}.` },
              { title: 'Spend quality', time: money(customer.spent), description: `Tracked lifetime value across ${customer.orders} orders in the current sample dataset.` },
              { title: 'Latest commerce signal', time: customer.lastOrder, description: 'Most recent order activity date visible to admin operations.' },
            ]}
          />
        </AdminSectionCard>

        <AdminSectionCard title="Related orders" subtitle="Orders currently visible for this customer in the admin sample.">
          {customerOrders.length ? (
            <div className="grid gap-3">
              {customerOrders.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item.id}</p>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Vendor: {item.vendor}</p>
                  <p className="mt-1 text-sm text-slate-600">Total: {money(item.total)} • Payment: {item.payment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              No related orders are currently visible for this customer in the admin demo dataset.
            </div>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
