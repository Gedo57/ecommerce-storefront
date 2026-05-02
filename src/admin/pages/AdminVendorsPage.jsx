import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminDataToolbar from '../components/AdminDataToolbar';
import { vendors as seededVendors } from '../data/adminMockData';
import { getVendorAccounts, setVendorStatus } from '../../utils/accountStorage';
import { exportRowsToCsv } from '../../utils/export';

function StatusBadge({ value }) {
  const normalized = String(value).toLowerCase();
  const className = normalized.includes('approved') || normalized.includes('active')
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : normalized.includes('pending') || normalized.includes('review')
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>{value}</span>;
}

function ActionButton({ label, onClick, variant = 'secondary' }) {
  const className = variant === 'primary'
    ? 'bg-slate-950 text-white hover:bg-slate-800'
    : variant === 'danger'
      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200';

  return <button type="button" onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${className}`}>{label}</button>;
}

export default function AdminVendorsPage() {
  const [localVendors, setLocalVendors] = useState(() => getVendorAccounts());
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [businessType, setBusinessType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const pendingCount = useMemo(() => localVendors.filter((vendor) => String(vendor.status).toLowerCase() === 'pending').length, [localVendors]);

  const handleStatusChange = (vendorId, nextStatus) => {
    const updated = setVendorStatus(vendorId, nextStatus);
    if (!updated) return;
    setLocalVendors(getVendorAccounts());
  };

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = localVendors.filter((vendor) => {
      const matchesQuery = !normalizedQuery || [vendor.name, vendor.owner, vendor.email, vendor.phone, vendor.id].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'all' || vendor.status === status;
      const matchesType = businessType === 'all' || vendor.businessType === businessType;
      return matchesQuery && matchesStatus && matchesType;
    });

    nextRows.sort((a, b) => {
      switch (sortBy) {
        case 'revenue-desc': return b.revenue - a.revenue;
        case 'orders-desc': return b.orders - a.orders;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      }
    });
    return nextRows;
  }, [localVendors, query, status, businessType, sortBy]);

  const exportColumns = [
    { key: 'id', label: 'Vendor ID' },
    { key: 'name', label: 'Store' },
    { key: 'owner', label: 'Owner' },
    { key: 'email', label: 'Email' },
    { key: 'businessType', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'orders', label: 'Orders' },
    { key: 'revenue', label: 'Revenue' },
  ];

  return (
    <div className="grid gap-6">
      <AdminSectionCard title="Vendor approval center" subtitle={`Review pending merchants and control marketplace access. ${pendingCount} vendor(s) currently waiting for approval.`}>
        <AdminDataToolbar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search store, owner, email, vendor ID"
          filters={[
            { key: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All statuses' }, ...Array.from(new Set(localVendors.map((row) => row.status))).map((value) => ({ value, label: value }))] },
            { key: 'businessType', value: businessType, onChange: setBusinessType, options: [{ value: 'all', label: 'All business types' }, ...Array.from(new Set(localVendors.map((row) => row.businessType))).map((value) => ({ value, label: value }))] },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'newest', label: 'Newest applications' },
            { value: 'revenue-desc', label: 'Highest revenue' },
            { value: 'orders-desc', label: 'Most orders' },
            { value: 'name-asc', label: 'Store A → Z' },
          ]}
          onExport={() => exportRowsToCsv(filteredVendors, exportColumns, 'admin-vendors.csv')}
          resultCount={filteredVendors.length}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Store</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length ? filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-slate-100 bg-white align-top hover:bg-slate-50/80">
                    <td className="px-4 py-4">
                      <Link to={`/admin/vendors/${vendor.id}`} className="font-semibold text-slate-900 underline-offset-4 hover:underline">{vendor.name}</Link>
                      <p className="mt-1 text-xs text-slate-500">{vendor.id}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{vendor.owner}</td>
                    <td className="px-4 py-4 text-slate-700">{vendor.email}</td>
                    <td className="px-4 py-4 text-slate-700">{vendor.businessType}</td>
                    <td className="px-4 py-4"><StatusBadge value={vendor.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/admin/vendors/${vendor.id}`} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">Details</Link>
                        <ActionButton label="Approve" variant="primary" onClick={() => handleStatusChange(vendor.id, 'approved')} />
                        <ActionButton label="Suspend" onClick={() => handleStatusChange(vendor.id, 'suspended')} />
                        <ActionButton label="Reject" variant="danger" onClick={() => handleStatusChange(vendor.id, 'rejected')} />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr className="border-t border-slate-100 bg-white">
                    <td colSpan={6} className="px-4 py-10 text-center text-sm font-medium text-slate-500">No matching vendors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Marketplace vendors snapshot" subtitle="Reference marketplace vendors kept for portfolio presentation and broader admin context.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seededVendors.map((vendor) => (
            <div key={vendor.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/admin/vendors/${vendor.id}`} className="text-lg font-black text-slate-950 underline-offset-4 hover:underline">{vendor.name}</Link>
                  <p className="mt-1 text-sm text-slate-500">Owner: {vendor.owner}</p>
                </div>
                <StatusBadge value={vendor.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>Products: <span className="font-semibold text-slate-900">{vendor.products}</span></p>
                <p>Orders: <span className="font-semibold text-slate-900">{vendor.orders}</span></p>
                <p>Revenue: <span className="font-semibold text-slate-900">${vendor.revenue.toLocaleString()}</span></p>
                <p>Commission: <span className="font-semibold text-slate-900">{vendor.commissionRate}</span></p>
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
