import { useMemo, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorTableCard from '../components/VendorTableCard';
import { useToast } from '../../context/ToastContext';
import { createVendorPromotion, getVendorPromotions } from '../../utils/vendorOperationsStorage';

const emptyForm = {
  campaign: '',
  type: 'Coupon',
  discount: '',
  code: '',
  startDate: '',
  endDate: '',
  limit: '',
  status: 'Draft',
};

export default function VendorPromotionsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [version, setVersion] = useState(0);

  const promotions = useMemo(() => getVendorPromotions(), [version]);
  const activeCount = promotions.filter((item) => item.status === 'Active').length;
  const scheduledCount = promotions.filter((item) => item.status === 'Scheduled').length;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.campaign || !form.discount || !form.startDate) {
      showToast({ title: 'Missing promotion fields', description: 'Campaign, discount, and start date are required.' });
      return;
    }

    const created = createVendorPromotion(form);
    setVersion((current) => current + 1);
    setForm(emptyForm);
    showToast({ title: 'Promotion created', description: `${created.campaign} was added to the vendor campaign queue.`, variant: 'success' });
  };

  const rows = promotions.map((item) => ({
    id: item.id,
    campaign: item.campaign,
    type: item.type,
    discount: item.discount,
    usage: item.usage,
    status: item.status,
    window: item.startDate && item.endDate ? `${item.startDate} → ${item.endDate}` : item.startDate || 'Draft',
    code: item.code || '—',
  }));

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Phase 4D"
        title="Promotions Workflow"
        description="Create merchant campaigns with coupon data, discount type, usage limit, and activation window."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total Campaigns', value: promotions.length, note: 'Visible merchant promotions in the workspace.' },
          { label: 'Active', value: activeCount, note: 'Currently live offers.' },
          { label: 'Scheduled', value: scheduledCount, note: 'Upcoming campaigns in queue.' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-xl font-black text-slate-950">Create Campaign</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">Set campaign type, discount logic, active dates, and redemption cap.</p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Campaign Name
              <input value={form.campaign} onChange={(e) => setForm((current) => ({ ...current, campaign: e.target.value }))} className="checkout-input" placeholder="Weekend Edit Drop" />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Type
                <select value={form.type} onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))} className="filter-select">
                  {['Coupon', 'Fixed', 'Flash Sale', 'Bundle Offer'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Status
                <select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))} className="filter-select">
                  {['Draft', 'Scheduled', 'Active'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Discount
                <input value={form.discount} onChange={(e) => setForm((current) => ({ ...current, discount: e.target.value }))} className="checkout-input" placeholder="15% or $10" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Coupon Code
                <input value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))} className="checkout-input" placeholder="WEEKEND15" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Start Date
                <input type="date" value={form.startDate} onChange={(e) => setForm((current) => ({ ...current, startDate: e.target.value }))} className="checkout-input" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                End Date
                <input type="date" value={form.endDate} onChange={(e) => setForm((current) => ({ ...current, endDate: e.target.value }))} className="checkout-input" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Usage Limit
              <input type="number" min="0" value={form.limit} onChange={(e) => setForm((current) => ({ ...current, limit: e.target.value }))} className="checkout-input" placeholder="200" />
            </label>

            <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Create Promotion
            </button>
          </form>
        </section>

        <VendorTableCard
          title="Merchant Promotions"
          description="Coupons and campaign windows currently available to the vendor account."
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'campaign', label: 'Campaign' },
            { key: 'type', label: 'Type' },
            { key: 'discount', label: 'Discount' },
            { key: 'code', label: 'Code' },
            { key: 'window', label: 'Window' },
            { key: 'usage', label: 'Usage' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
        />
      </div>
    </div>
  );
}
