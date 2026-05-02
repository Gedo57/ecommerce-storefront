import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VendorTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Vendor Workspace</p>
          <h2 className="mt-1 text-2xl font-black tracking-[0.02em] text-slate-950">
            {user?.storeName || 'Vendor Panel'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Manage catalog, orders, and stock from one focused panel.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back to Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
