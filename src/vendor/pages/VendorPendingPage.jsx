import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VendorPendingPage() {
  const { user, logout } = useAuth();

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[860px] rounded-[32px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Vendor Approval</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Your seller account is under review</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          We received the merchant request for <span className="font-semibold text-slate-900">{user?.storeName || 'your store'}</span>.
          The current vendor status is <span className="font-semibold uppercase text-amber-700">{user?.vendorStatus || 'pending'}</span>.
          Once approved, this account will be able to access the vendor dashboard directly.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Store Name</p>
            <p className="mt-2 text-sm text-slate-600">{user?.storeName || '—'}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Business Type</p>
            <p className="mt-2 text-sm text-slate-600">{user?.businessType || '—'}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Contact</p>
            <p className="mt-2 text-sm text-slate-600">{user?.phone || user?.email || '—'}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Back to Store
          </Link>
          <button type="button" onClick={logout} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-amber-300 bg-white/80 p-5">
          <p className="text-sm font-semibold text-slate-900">Demo note</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            In the current front-end foundation, vendor approval is represented by the local field
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">vendorStatus</code>.
            When it becomes <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">approved</code>,
            the login redirect will move this user to <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">/vendor</code>.
          </p>
        </div>
      </div>
    </section>
  );
}
