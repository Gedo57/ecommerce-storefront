import VendorTableCard from '../components/VendorTableCard';
import { vendorPayouts } from '../data/vendorMockData';

export default function VendorPayoutsPage() {
  return (
    <VendorTableCard
      title="Vendor Payouts"
      description="Scheduled and completed merchant settlements with payout method visibility."
      columns={[
        { key: 'id', label: 'Payout' },
        { key: 'method', label: 'Method' },
        { key: 'amount', label: 'Amount' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
      ]}
      rows={vendorPayouts}
    />
  );
}
