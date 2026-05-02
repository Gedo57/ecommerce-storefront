import { useEffect, useState } from 'react';
import { getAnalyticsSummary, getContentSettings, saveContentSettings } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';

export default function ContentStudioPage() {
  const [form, setForm] = useState(getContentSettings());
  const [savedAt, setSavedAt] = useState('');
  const [analytics, setAnalytics] = useState(getAnalyticsSummary());

  useDocumentMeta({ title: 'Content Studio | SET', description: 'لوحة محتوى محلية وإحصائيات بسيطة للمشروع.' });

  useEffect(() => {
    setAnalytics(getAnalyticsSummary());
  }, [savedAt]);

  const handleSave = (event) => {
    event.preventDefault();
    saveContentSettings(form);
    setSavedAt(new Date().toLocaleString());
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1300px] grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSave} className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-right">
          <h1 className="text-3xl font-black text-black">Content Studio</h1>
          <p className="mt-3 text-sm text-black/65">طبقة محتوى داخلية خفيفة لتعديل بيانات الدعم والرسائل التسويقية بدون لمس الكود.</p>
          <div className="mt-6 space-y-4">
            {[
              ['heroTitle', 'عنوان الهيرو'],
              ['heroSubtitle', 'وصف الهيرو'],
              ['announcement', 'الإعلان العلوي'],
              ['supportEmail', 'بريد الدعم'],
              ['supportPhone', 'هاتف الدعم'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-semibold text-black">{label}</label>
                <input value={form[key]} onChange={(e) => setForm((c) => ({ ...c, [key]: e.target.value }))} className="checkout-input text-right" />
              </div>
            ))}
          </div>
          <button type="submit" className="mt-5 rounded-sm bg-black px-5 py-3 text-sm font-bold text-white">حفظ التعديلات</button>
          {savedAt ? <p className="mt-3 text-sm text-emerald-700">تم الحفظ في {savedAt}</p> : null}
        </form>
        <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-right">
          <h2 className="text-2xl font-black text-black">Analytics</h2>
          <div className="mt-5 space-y-3 text-sm text-black/70">
            <div className="flex items-center justify-between"><span>{analytics.pageViews}</span><span>Page views</span></div>
            <div className="flex items-center justify-between"><span>{analytics.addToCart}</span><span>Add to cart</span></div>
            <div className="flex items-center justify-between"><span>{analytics.orders}</span><span>Orders placed</span></div>
            <div className="flex items-center justify-between"><span>{analytics.supportTickets}</span><span>Support tickets</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
