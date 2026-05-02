import { NavLink } from 'react-router-dom';

const linkGroups = [
  {
    title: 'Phase 1',
    links: [
      { to: '/admin', label: 'Dashboard', end: true },
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/vendors', label: 'Vendors' },
    ],
  },
  {
    title: 'Phase 2',
    links: [
      { to: '/admin/customers', label: 'Customers' },
      { to: '/admin/inventory', label: 'Inventory' },
      { to: '/admin/promotions', label: 'Promotions' },
      { to: '/admin/reviews', label: 'Reviews' },
      { to: '/admin/refunds', label: 'Refunds' },
    ],
  },
  {
    title: 'Phase 3',
    links: [
      { to: '/admin/reports', label: 'Reports' },
      { to: '/admin/roles', label: 'Roles & Permissions' },
      { to: '/admin/cms', label: 'CMS' },
      { to: '/admin/settings', label: 'Settings' },
      { to: '/admin/notifications', label: 'Notifications' },
      { to: '/admin/payouts', label: 'Payouts' },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar flex w-full flex-col border-b border-slate-200 bg-[#0b1220] text-white lg:min-h-screen lg:w-[260px] lg:border-b-0 lg:border-r lg:border-r-white/10">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">SET Commerce</p>
        <h1 className="mt-2 text-2xl font-black tracking-[0.16em]">ADMIN</h1>
      </div>

      <div className="px-4 py-4">
        <div className="grid gap-5">
          {linkGroups.map((group) => (
            <nav key={group.title} className="grid gap-1.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-white text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)]' : 'text-white/72 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          ))}
        </div>
      </div>
    </aside>
  );
}
