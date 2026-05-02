import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 px-5 py-5 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
