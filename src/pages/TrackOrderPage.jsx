import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocumentMeta } from '../utils/seo';

function Timeline({ order }) {
  const steps = order?.trackingTimeline || [];
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={`${step.label}-${step.date}`} className="rounded-sm border border-black/10 p-4 text-right">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-black/55">{new Date(step.date).toLocaleString()}</span>
            <h3 className="font-bold text-black">{step.label}</h3>
          </div>
          <p className="mt-2 text-sm text-black/65">{step.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function TrackOrderPage() {
  const { user } = useAuth();
  const [reference, setReference] = useState('');
  const orders = user?.orders || [];
  const order = useMemo(() => orders.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase()), [orders, reference]);

  useDocumentMeta({ title: 'Track Order | SET', description: 'صفحة تتبع الطلب وحالة الشحن داخل المشروع.' });

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-right">
          <h1 className="text-3xl font-black text-black">تتبع الطلب</h1>
          <p className="mt-3 text-sm text-black/65">أدخل رقم المرجع مثل ORD-12345678 لعرض حالة الطلب الحالية والتايم لاين.</p>
          <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="ORD-12345678" className="checkout-input mt-4 text-right" />
        </div>
        {order ? (
          <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-right">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#f1f1f1] px-3 py-1 text-sm">{order.status}</span>
              <h2 className="text-2xl font-black text-black">{order.reference}</h2>
            </div>
            <Timeline order={order} />
          </div>
        ) : reference ? <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-right text-sm text-amber-700">لم يتم العثور على طلب بهذا المرجع داخل الحساب الحالي.</div> : null}
      </div>
    </section>
  );
}
