import VendorTableCard from '../components/VendorTableCard';
import { vendorEarnings } from '../data/vendorMockData';

export default function VendorEarningsPage() {
  return (
    <VendorTableCard
      title="Vendor Earnings"
      description="Revenue, fees, refunds, and net settlement visibility for merchant finance tracking."
      columns={[
        { key: 'period', label: 'Period' },
        { key: 'gross', label: 'Gross Sales' },
        { key: 'fees', label: 'Platform Fees' },
        { key: 'refunds', label: 'Refunds' },
        { key: 'net', label: 'Net Earnings' },
      ]}
      rows={vendorEarnings}
    />
  );
}
