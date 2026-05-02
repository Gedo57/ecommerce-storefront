import { useEffect, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getVendorSettings, saveVendorSettings } from '../../utils/vendorOperationsStorage';

export default function VendorSettingsPage() {
  const { user, updateProfile, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(() => ({
    storeName: user?.storeName || '',
    businessType: user?.businessType || '',
    phone: user?.phone || '',
    supportEmail: '',
    supportPhone: '',
    storeDescription: '',
    payoutMethod: '',
    payoutFrequency: '',
    logoLabel: '',
    bannerLabel: '',
    shippingPolicy: '',
    returnPolicy: '',
    notificationOrders: true,
    notificationLowStock: true,
    notificationRefunds: true,
  }));

  useEffect(() => {
    const settings = getVendorSettings();
    setForm((current) => ({
      ...current,
      storeName: user?.storeName || current.storeName,
      businessType: user?.businessType || current.businessType,
      phone: user?.phone || current.phone,
      ...settings,
    }));
  }, [user]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    updateProfile({
      storeName: form.storeName,
      businessType: form.businessType,
      phone: form.phone,
    });

    saveVendorSettings({
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      storeDescription: form.storeDescription,
      payoutMethod: form.payoutMethod,
      payoutFrequency: form.payoutFrequency,
      logoLabel: form.logoLabel,
      bannerLabel: form.bannerLabel,
      shippingPolicy: form.shippingPolicy,
      returnPolicy: form.returnPolicy,
      notificationOrders: form.notificationOrders,
      notificationLowStock: form.notificationLowStock,
      notificationRefunds: form.notificationRefunds,
    });

    refreshUser();
    showToast({ title: 'Vendor settings saved', description: 'Store profile, payout preferences, and notification rules were updated.', variant: 'success' });
  };

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Phase 4D"
        title="Vendor Settings Depth"
        description="Edit merchant identity, support contacts, settlement preferences, policy content, and notification rules from one structured settings form."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Store Profile</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Store Name
                <input value={form.storeName} onChange={(e) => handleChange('storeName', e.target.value)} className="checkout-input" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Business Type
                <input value={form.businessType} onChange={(e) => handleChange('businessType', e.target.value)} className="checkout-input" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Support Email
                <input type="email" value={form.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} className="checkout-input" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Support Phone
                <input value={form.supportPhone} onChange={(e) => handleChange('supportPhone', e.target.value)} className="checkout-input" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
              Store Description
              <textarea value={form.storeDescription} onChange={(e) => handleChange('storeDescription', e.target.value)} className="checkout-input min-h-[140px]" />
            </label>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Settlement & Assets</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Payout Method
                <select value={form.payoutMethod} onChange={(e) => handleChange('payoutMethod', e.target.value)} className="filter-select">
                  {['Bank Transfer', 'Wallet Transfer', 'Manual Settlement'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Payout Frequency
                <select value={form.payoutFrequency} onChange={(e) => handleChange('payoutFrequency', e.target.value)} className="filter-select">
                  {['Weekly', 'Bi-Weekly', 'Monthly'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Logo Placeholder
                <input value={form.logoLabel} onChange={(e) => handleChange('logoLabel', e.target.value)} className="checkout-input" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Banner Placeholder
                <input value={form.bannerLabel} onChange={(e) => handleChange('bannerLabel', e.target.value)} className="checkout-input" />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Policies & Alerts</h2>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Shipping Policy
                <textarea value={form.shippingPolicy} onChange={(e) => handleChange('shippingPolicy', e.target.value)} className="checkout-input min-h-[120px]" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Return Policy
                <textarea value={form.returnPolicy} onChange={(e) => handleChange('returnPolicy', e.target.value)} className="checkout-input min-h-[120px]" />
              </label>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['notificationOrders', 'Order alerts'],
                ['notificationLowStock', 'Low-stock alerts'],
                ['notificationRefunds', 'Refund alerts'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => handleChange(key, e.target.checked)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid gap-6 self-start">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h3 className="text-lg font-black text-slate-950">Merchant Snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Owner:</span> {user?.name || '—'}</p>
              <p><span className="font-semibold text-slate-900">Login Email:</span> {user?.email || '—'}</p>
              <p><span className="font-semibold text-slate-900">Approval:</span> {user?.vendorStatus || '—'}</p>
              <p><span className="font-semibold text-slate-900">Primary Contact:</span> {form.phone || form.supportPhone || '—'}</p>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Save Vendor Settings
            </button>
          </section>

          <section className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
            <p className="text-sm font-semibold text-emerald-900">Phase 4D Result</p>
            <p className="mt-2 text-sm leading-7 text-emerald-900/75">
              This page now behaves like a real merchant control form instead of a static summary block.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
