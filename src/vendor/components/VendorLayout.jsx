import { Outlet } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';
import VendorTopbar from './VendorTopbar';

export default function VendorLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <VendorSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <VendorTopbar />
          <main className="flex-1 px-4 py-5 sm:px-6 xl:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
