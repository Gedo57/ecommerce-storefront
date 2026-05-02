import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { getAnalyticsSummary, getEmails } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';

const tabOptions = [
  { key: 'overview', label: 'نظرة عامة' },
  { key: 'orders', label: 'الطلبات' },
  { key: 'addresses', label: 'العناوين' },
  { key: 'profile', label: 'الملف الشخصي' },
  { key: 'payments', label: 'وسائل الدفع' },
  { key: 'security', label: 'الأمان' },
  { key: 'notifications', label: 'الإشعارات' },
];

const defaultAddress = { fullName: '', phone: '', addressLine: '', city: '', postalCode: '', country: '' };

function SectionCard({ title, children }) {
  return <section className="rounded-sm bg-white p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"><h2 className="mb-5 text-right text-2xl font-black text-black">{title}</h2>{children}</section>;
}

export default function AccountPage() {
  const { user, isAuthenticated, logout, deleteAddress, saveAddress, updateProfile, verifyEmailCode, resendVerificationCode } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');
  const [addressForm, setAddressForm] = useState(defaultAddress);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [verifyCode, setVerifyCode] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');
  const [paymentForm, setPaymentForm] = useState({ holder: '', brand: 'Visa', last4: '', expiry: '' });
  const emails = getEmails().filter((item) => item.to === user?.email);
  const analytics = getAnalyticsSummary();

  useDocumentMeta({ title: 'Account | SET', description: 'الحساب، الطلبات، التتبع، الإشعارات، وحالة الأمان.' });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const orderStats = useMemo(() => {
    const orders = user?.orders || [];
    return {
      count: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + Number(order.totalBase ?? 0), 0),
      latestOrder: orders[0] || null,
    };
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 rounded-sm bg-black p-6 text-right text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/65">مرحبًا بعودتك</p>
            <h1 className="mt-1 text-3xl font-black">{user.name}</h1>
            <p className="mt-2 text-sm text-white/75">{user.email}</p>
            <p className="mt-2 text-xs text-white/60">{user.emailVerified ? 'Email verified' : 'Email not verified yet'}</p>
          </div>
          <button type="button" onClick={logout} className="rounded-sm border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white hover:text-black">تسجيل الخروج</button>
        </div>

        <div className="mb-6 flex flex-wrap justify-end gap-2">
          {tabOptions.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white text-black/70 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'}`}>{tab.label}</button>)}
        </div>

        {activeTab === 'overview' ? (
          <div className="grid gap-5 lg:grid-cols-4">
            <SectionCard title="ملخص الحساب"><div className="space-y-3 text-right text-sm text-black/70"><div className="flex items-center justify-between"><span>{user.email}</span><span>البريد</span></div><div className="flex items-center justify-between"><span>{(user.addresses || []).length}</span><span>العناوين</span></div><div className="flex items-center justify-between"><span>{orderStats.count}</span><span>إجمالي الطلبات</span></div></div></SectionCard>
            <SectionCard title="إجمالي الإنفاق"><p className="text-right text-3xl font-black text-black">{formatPrice(orderStats.totalSpent)}</p><p className="mt-2 text-right text-sm text-black/55">محسوبة من الطلبات المحفوظة داخل حسابك.</p></SectionCard>
            <SectionCard title="Analytics"><div className="space-y-3 text-right text-sm text-black/70"><div className="flex items-center justify-between"><span>{analytics.pageViews}</span><span>Page views</span></div><div className="flex items-center justify-between"><span>{analytics.addToCart}</span><span>Add to cart</span></div><div className="flex items-center justify-between"><span>{analytics.orders}</span><span>Orders</span></div></div></SectionCard>
            <SectionCard title="آخر طلب">{orderStats.latestOrder ? <div className="space-y-2 text-right text-sm text-black/70"><div className="flex items-center justify-between"><span>{orderStats.latestOrder.reference}</span><span>المرجع</span></div><div className="flex items-center justify-between"><span>{formatPrice(orderStats.latestOrder.totalBase)}</span><span>الإجمالي</span></div><div className="flex items-center justify-between"><span>{orderStats.latestOrder.status || 'Processing'}</span><span>الحالة</span></div></div> : <p className="text-right text-sm text-black/55">لا توجد طلبات محفوظة بعد.</p>}</SectionCard>
          </div>
        ) : null}

        {activeTab === 'orders' ? (
          <SectionCard title="الطلبات السابقة">{user.orders?.length ? <div className="space-y-4">{user.orders.map((order) => <article key={order.reference} className="rounded-sm border border-black/10 p-4 text-right"><div className="flex flex-wrap items-center justify-between gap-3"><div className="text-left text-sm text-black/55">{new Date(order.createdAt).toLocaleString()}</div><div><h3 className="text-base font-black text-black">{order.reference}</h3><p className="mt-1 text-sm text-black/60">{order.paymentMethod}</p></div></div><div className="mt-3 grid gap-3 text-sm text-black/70 sm:grid-cols-4"><div className="rounded-sm bg-[#f7f7f7] p-3"><span className="font-semibold">الإجمالي:</span> {formatPrice(order.totalBase)}</div><div className="rounded-sm bg-[#f7f7f7] p-3"><span className="font-semibold">العناصر:</span> {order.itemCount}</div><div className="rounded-sm bg-[#f7f7f7] p-3"><span className="font-semibold">الحالة:</span> {order.status || 'Processing'}</div><div className="rounded-sm bg-[#f7f7f7] p-3"><span className="font-semibold">الكوبون:</span> {order.coupon?.code || '—'}</div></div><div className="mt-4 space-y-2">{(order.items || []).map((item) => <div key={item.cartLineId || item.id} className="flex items-center justify-between rounded-sm bg-[#fafafa] px-3 py-2 text-sm text-black/70"><span>{formatPrice(item.price * item.quantity)}</span><span>{item.title} — {item.selectedColor?.name || 'Standard'} / {item.selectedSize || 'Standard'} × {item.quantity}</span></div>)}</div><div className="mt-4 space-y-2">{(order.trackingTimeline || []).map((step) => <div key={`${order.reference}-${step.label}`} className="rounded-sm border border-black/10 px-3 py-2 text-sm text-black/65"><span className="font-semibold text-black">{step.label}</span> — {step.description}</div>)}</div></article>)}</div> : <p className="text-right text-sm text-black/55">لم يتم حفظ أي طلبات داخل حسابك حتى الآن.</p>}</SectionCard>
        ) : null}

        {activeTab === 'addresses' ? (
          <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <SectionCard title="إضافة عنوان جديد"><form onSubmit={(event) => { event.preventDefault(); saveAddress(addressForm); setAddressForm(defaultAddress); setActiveTab('addresses'); }} className="space-y-4 text-right">{Object.entries({ fullName: 'الاسم الكامل', phone: 'رقم الهاتف', addressLine: 'العنوان', city: 'المدينة', postalCode: 'الرمز البريدي', country: 'الدولة' }).map(([field, label]) => <div key={field}><label className="mb-2 block text-sm font-semibold text-black">{label}</label><input type="text" required value={addressForm[field]} onChange={(e) => setAddressForm((current) => ({ ...current, [field]: e.target.value }))} className="checkout-input text-right" /></div>)}<button type="submit" className="w-full rounded-sm bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-black/85">حفظ العنوان</button></form></SectionCard>
            <SectionCard title="العناوين المحفوظة">{user.addresses?.length ? <div className="space-y-4">{user.addresses.map((address) => <article key={address.id} className="rounded-sm border border-black/10 p-4 text-right"><div className="flex items-center justify-between gap-3"><button type="button" onClick={() => deleteAddress(address.id)} className="text-sm font-semibold text-red-700 hover:text-red-800">حذف</button><h3 className="text-base font-black text-black">{address.fullName}</h3></div><p className="mt-2 text-sm text-black/70">{address.addressLine}</p><p className="mt-1 text-sm text-black/60">{address.city} • {address.country} • {address.postalCode}</p><p className="mt-1 text-sm text-black/60">{address.phone}</p></article>)}</div> : <p className="text-right text-sm text-black/55">لا توجد عناوين محفوظة بعد.</p>}</SectionCard>
          </div>
        ) : null}

        {activeTab === 'profile' ? <SectionCard title="البيانات الشخصية"><form onSubmit={(event) => { event.preventDefault(); updateProfile(profileForm); }} className="grid gap-4 text-right sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-black">الاسم</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))} className="checkout-input text-right" /></div><div><label className="mb-2 block text-sm font-semibold text-black">البريد الإلكتروني</label><input type="email" value={profileForm.email} onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))} className="checkout-input text-right" /></div><div className="sm:col-span-2"><button type="submit" className="rounded-sm bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-black/85">تحديث البيانات</button></div></form></SectionCard> : null}


        {activeTab === 'payments' ? <SectionCard title="وسائل الدفع المحفوظة"><div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]"><form onSubmit={(event) => { event.preventDefault(); updateProfile({ savedPaymentMethods: [{ id: `pm-${Date.now()}`, ...paymentForm }, ...(user.savedPaymentMethods || [])] }); setPaymentForm({ holder: '', brand: 'Visa', last4: '', expiry: '' }); }} className="space-y-4 text-right"><div><label className="mb-2 block text-sm font-semibold text-black">اسم صاحب البطاقة</label><input value={paymentForm.holder} onChange={(e) => setPaymentForm((current) => ({ ...current, holder: e.target.value }))} className="checkout-input text-right" required /></div><div><label className="mb-2 block text-sm font-semibold text-black">النوع</label><select value={paymentForm.brand} onChange={(e) => setPaymentForm((current) => ({ ...current, brand: e.target.value }))} className="checkout-input text-right"><option>Visa</option><option>Mastercard</option><option>Apple Pay</option></select></div><div><label className="mb-2 block text-sm font-semibold text-black">آخر 4 أرقام</label><input value={paymentForm.last4} onChange={(e) => setPaymentForm((current) => ({ ...current, last4: e.target.value.replace(/\D/g, '').slice(0,4) }))} className="checkout-input text-right" required /></div><div><label className="mb-2 block text-sm font-semibold text-black">تاريخ الانتهاء</label><input value={paymentForm.expiry} onChange={(e) => setPaymentForm((current) => ({ ...current, expiry: e.target.value }))} placeholder="12/28" className="checkout-input text-right" required /></div><button type="submit" className="w-full rounded-sm bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-black/85">حفظ وسيلة الدفع</button><p className="text-xs leading-6 text-black/50">هذه نسخة Front-End تجريبية لحفظ بطاقات مصغرة داخل الحساب فقط.</p></form><div>{user.savedPaymentMethods?.length ? <div className="space-y-4">{user.savedPaymentMethods.map((method) => <article key={method.id} className="rounded-sm border border-black/10 bg-[#faf7f3] p-4 text-right"><div className="flex items-center justify-between gap-3"><span className="text-sm text-black/55">{method.expiry}</span><h3 className="text-base font-black text-black">{method.brand} •••• {method.last4}</h3></div><p className="mt-2 text-sm text-black/65">{method.holder}</p></article>)}</div> : <p className="text-right text-sm text-black/55">لا توجد وسائل دفع محفوظة بعد.</p>}</div></div></SectionCard> : null}

        {activeTab === 'security' ? <SectionCard title="الأمان والتحقق"><div className="space-y-4 text-right"><div className="rounded-sm border border-black/10 p-4"><p className="text-sm text-black/60">حالة البريد</p><p className="mt-2 font-bold text-black">{user.emailVerified ? 'Verified' : 'Not verified'}</p></div>{!user.emailVerified ? <><input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className="checkout-input text-right" placeholder="رمز التفعيل" /><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { try { verifyEmailCode(verifyCode); setSecurityMessage('تم تفعيل البريد بنجاح.'); } catch (error) { setSecurityMessage(error.message); } }} className="rounded-sm bg-black px-5 py-3 text-sm font-bold text-white">تفعيل</button><button type="button" onClick={() => { resendVerificationCode(); setSecurityMessage('تم إرسال رمز جديد إلى صندوق الإشعارات.'); }} className="rounded-sm border border-black/15 px-5 py-3 text-sm font-bold text-black">إعادة إرسال</button></div></> : null}{securityMessage ? <p className="text-sm text-emerald-700">{securityMessage}</p> : null}</div></SectionCard> : null}

        {activeTab === 'notifications' ? <SectionCard title="الإشعارات والبريد الداخلي">{emails.length ? <div className="space-y-3">{emails.map((email) => <article key={email.id} className="rounded-sm border border-black/10 p-4 text-right"><h3 className="font-bold text-black">{email.subject}</h3><p className="mt-1 text-xs text-black/55">{new Date(email.createdAt).toLocaleString()}</p><p className="mt-3 text-sm text-black/70">{email.body}</p></article>)}</div> : <p className="text-right text-sm text-black/55">لا توجد رسائل حالياً.</p>}</SectionCard> : null}
      </div>
    </section>
  );
}
