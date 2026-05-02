import VendorTableCard from '../components/VendorTableCard';
import { vendorReviews } from '../data/vendorMockData';

export default function VendorReviewsPage() {
  return (
    <VendorTableCard
      title="Vendor Reviews"
      description="Moderation and sentiment snapshot for product feedback inside the merchant panel."
      columns={[
        { key: 'id', label: 'Review' },
        { key: 'product', label: 'Product' },
        { key: 'customer', label: 'Customer' },
        { key: 'rating', label: 'Rating' },
        { key: 'sentiment', label: 'Sentiment' },
        { key: 'status', label: 'Status' },
      ]}
      rows={vendorReviews}
    />
  );
}
