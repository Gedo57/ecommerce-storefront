import { NavLink } from 'react-router-dom';

const links = [
  { to: '/vendor', label: 'Dashboard', end: true },
  { to: '/vendor/orders', label: 'Orders' },
  { to: '/vendor/products', label: 'Products' },
  { to: '/vendor/products/new', label: 'Add Product' },
  { to: '/vendor/inventory', label: 'Inventory' },
  { to: '/vendor/promotions', label: 'Promotions' },
  { to: '/vendor/reviews', label: 'Reviews' },
  { to: '/vendor/earnings', label: 'Earnings' },
  { to: '/vendor/payouts', label: 'Payouts' },
  { to: '/vendor/settings', label: 'Settings' },
];

export default function VendorSidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-emerald-200 bg-[#052e2b] text-white lg:min-h-screen lg:w-[260px] lg:border-b-0 lg:border-r lg:border-r-white/10">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">SET Commerce</p>
        <h1 className="mt-2 text-2xl font-black tracking-[0.12em]">VENDOR</h1>
      </div>

      <nav className="grid gap-1.5 px-4 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-white text-emerald-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)]' : 'text-white/78 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
