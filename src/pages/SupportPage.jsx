import { useMemo, useState } from 'react';
import { getContentSettings, createSupportTicket, getSupportTickets } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';

const defaultForm = { name: '', email: '', subject: '', message: '' };

export default function SupportPage() {
  const content = useMemo(() => getContentSettings(), []);
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(null);
  const tickets = useMemo(() => getSupportTickets(), [submitted]);

  useDocumentMeta({ title: 'Support Center | SET', description: 'مركز المساعدة، التذاكر، وطرق التواصل داخل نسخة المتجر التجريبية.' });

  const faqs = [
    { q: 'كيف أتابع طلبي؟', a: 'ادخل صفحة تتبع الطلب أو قسم الطلبات داخل الحساب باستخدام رقم المرجع.' },
    { q: 'هل يوجد شحن سريع؟', a: 'نعم، يوجد Standard و Express حسب الدولة.' },
    { q: 'هل الكوبونات تعمل؟', a: 'نعم، تم تفعيل نظام كوبونات محلي داخل الـ checkout.' },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const ticket = createSupportTicket(form);
    setSubmitted(ticket);
    setForm(defaultForm);
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-8">
        <div className="rounded-sm bg-black p-8 text-right text-white">
          <p className="text-sm text-white/60">Support Center</p>
          <h1 className="mt-2 text-4xl font-black">الدعم ومركز المساعدة</h1>
          <p className="mt-4 text-sm leading-7 text-white/75">{content.announcement}</p>
          <div className="mt-5 flex flex-wrap justify-end gap-4 text-sm text-white/75">
            <span>{content.supportEmail}</span>
            <span>{content.supportPhone}</span>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black">WhatsApp سريع</a>
            <button type="button" className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black">Live Chat قريبًا</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-right text-2xl font-black text-black">أرسل تذكرة</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-right">
              {[
                ['name', 'الاسم'],
                ['email', 'البريد الإلكتروني'],
                ['subject', 'الموضوع'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold text-black">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm((c) => ({ ...c, [key]: e.target.value }))} className="checkout-input text-right" required />
                </div>
              ))}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">الرسالة</label>
                <textarea value={form.message} onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))} className="checkout-input min-h-[150px] resize-y text-right" required />
              </div>
              <button type="submit" className="rounded-sm bg-black px-5 py-3 text-sm font-bold text-white">إرسال التذكرة</button>
            </form>
            {submitted ? <div className="mt-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-700">تم إنشاء التذكرة بنجاح: {submitted.id}</div> : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-right text-2xl font-black text-black">الأسئلة الشائعة</h2>
              <div className="mt-5 space-y-4">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-sm border border-black/10 p-4 text-right">
                    <h3 className="font-bold text-black">{item.q}</h3>
                    <p className="mt-2 text-sm leading-7 text-black/65">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-right text-2xl font-black text-black">آخر التذاكر</h2>
              <div className="mt-5 space-y-3">
                {tickets.length ? tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="rounded-sm border border-black/10 p-4 text-right">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-black/55">{ticket.status}</span>
                      <h3 className="font-bold text-black">{ticket.subject}</h3>
                    </div>
                    <p className="mt-2 text-sm text-black/65">{ticket.email}</p>
                  </div>
                )) : <p className="text-right text-sm text-black/55">لا توجد تذاكر حتى الآن.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
