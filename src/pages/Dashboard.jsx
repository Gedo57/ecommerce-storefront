import { BadgeDollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import ChartCard from '../components/dashboard/ChartCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import RecentActivity from '../components/dashboard/RecentActivity';
import RevenueChart from '../components/dashboard/RevenueChart';
import SalesChart from '../components/dashboard/SalesChart';
import StatCard from '../components/dashboard/StatCard';
import { kpiCards, recentActivity, recentOrders } from '../data/dashboardData';
import { exportDashboardReport } from '../utils/exportDashboardReport';

const statIcons = {
  revenue: BadgeDollarSign,
  orders: ShoppingCart,
  customers: Users,
  conversion: TrendingUp,
};

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Overview</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Monitor revenue, orders, customers, and recent operational activity from one responsive admin overview.
          </p>
        </div>

        <button
          type="button"
          onClick={exportDashboardReport}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Export Report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <StatCard key={card.id} {...card} icon={statIcons[card.id]} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ChartCard
          title="Revenue Performance"
          description="Monthly revenue compared with operating expenses."
          action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">Last 6 months</span>}
        >
          <RevenueChart />
        </ChartCard>

        <ChartCard
          title="Weekly Orders"
          description="Order volume across the current week."
          action={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">Live mock data</span>}
        >
          <SalesChart />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <OrdersTable orders={recentOrders} />
        <RecentActivity items={recentActivity} />
      </div>
    </section>
  );
}
