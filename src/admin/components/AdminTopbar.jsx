import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Operations Overview</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Marketplace Admin Panel</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[280px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Search orders, products, vendors, customers, payouts, notifications, reports, and CMS blocks
        </div>
        <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Export snapshot
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
        <Link to="/" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Back to Store
        </Link>
      </div>
    </header>
  );
}
