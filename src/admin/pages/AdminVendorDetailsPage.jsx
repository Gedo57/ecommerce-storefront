import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminInfoGrid from '../components/AdminInfoGrid';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTimeline from '../components/AdminTimeline';
import { products, vendors } from '../data/adminMockData';
import { getVendorAccounts } from '../../utils/accountStorage';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export default function AdminVendorDetailsPage() {
  const { vendorId } = useParams();
  const localVendors = getVendorAccounts();
  const seedVendor = vendors.find((item) => item.id === vendorId);
  const localVendor = localVendors.find((item) => item.id === vendorId);
  const vendor = useMemo(() => {
    if (seedVendor) return { ...seedVendor, source: 'seed' };
    if (localVendor) return { ...localVendor, source: 'local' };
    return null;
  }, [seedVendor, localVendor]);

  if (!vendor) {
    return (
      <AdminSectionCard title="Vendor not found" subtitle="The requested vendor record does not exist in the current admin workspace.">
        <Link to="/admin/vendors" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Back to vendors</Link>
      </AdminSectionCard>
    );
  }

  const vendorProducts = vendor.source === 'seed'
    ? products.filter((item) => item.vendor === vendor.name)
    : [];

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Vendor Details"
        title={vendor.name}
        description="Merchant profile overview with operational scale, onboarding state, and catalog context."
        backTo="/admin/vendors"
        backLabel="Back to Vendors"
        actions={<button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Open Payout Record</button>}
      />

      <AdminInfoGrid
        items={[
          { label: 'Owner', value: vendor.owner },
          { label: 'Email', value: vendor.email || '—' },
          { label: 'Business Type', value: vendor.businessType || 'Marketplace Vendor' },
          { label: 'Status', value: vendor.status },
          { label: 'Products', value: String(vendor.products || vendorProducts.length) },
          { label: 'Revenue', value: money(vendor.revenue) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminSectionCard title="Merchant activity" subtitle="Portfolio-level reference view for vendor performance and relationship management.">
          <AdminTimeline
            items={[
              { title: 'Vendor profile created', time: vendor.createdAt || 'Seeded demo profile', description: 'The merchant profile exists in the current admin dataset and can be reviewed for operations and compliance.' },
              { title: 'Current account status', time: vendor.status, description: `The current merchant status is ${vendor.status}. This drives access, visibility, and payout handling.` },
              { title: 'Commercial snapshot', time: `${vendor.orders || 0} orders`, description: `Current visible revenue is ${money(vendor.revenue)} with a commission rate of ${vendor.commissionRate || '12%'}.` },
            ]}
          />
        </AdminSectionCard>

        <AdminSectionCard title="Catalog snapshot" subtitle="Visible products currently associated with this merchant in the admin sample.">
          {vendorProducts.length ? (
            <div className="grid gap-3">
              {vendorProducts.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.id} • {item.category}</p>
                  <p className="mt-2 text-sm text-slate-600">Stock {item.stock} • Price {money(item.price)} • Status {item.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
              This vendor currently comes from local onboarding data. No separate admin catalog sample is attached yet.
            </div>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
