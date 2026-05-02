import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminInfoGrid from '../components/AdminInfoGrid';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminSectionCard from '../components/AdminSectionCard';
import AdminTimeline from '../components/AdminTimeline';
import { products, reviews } from '../data/adminMockData';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export default function AdminProductDetailsPage() {
  const { productId } = useParams();
  const product = useMemo(() => products.find((item) => item.id === productId), [productId]);

  if (!product) {
    return (
      <AdminSectionCard title="Product not found" subtitle="The requested catalog record does not exist in the current admin sample.">
        <Link to="/admin/products" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Back to products</Link>
      </AdminSectionCard>
    );
  }

  const productReviews = reviews.filter((item) => item.product === product.title);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Product Details"
        title={product.title}
        description="Catalog quality, stock visibility, and moderation context for a single marketplace product."
        backTo="/admin/products"
        backLabel="Back to Products"
        actions={<button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Moderate Product</button>}
      />

      <AdminInfoGrid
        items={[
          { label: 'Product ID', value: product.id },
          { label: 'Vendor', value: product.vendor },
          { label: 'Category', value: product.category },
          { label: 'Price', value: money(product.price) },
          { label: 'Stock', value: String(product.stock) },
          { label: 'Status', value: product.status },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminSectionCard title="Moderation timeline" subtitle="Reference workflow for catalog operations and merchandising review.">
          <AdminTimeline
            items={[
              { title: 'Catalog record detected', time: product.id, description: `The item is currently listed under ${product.category} by ${product.vendor}.` },
              { title: 'Stock health', time: `${product.stock} units`, description: product.stock > 10 ? 'Inventory currently looks stable for the selected product.' : 'Inventory is tight and may require immediate replenishment planning.' },
              { title: 'Merchandising state', time: product.status, description: `Current merchandising / listing state is ${product.status}.` },
            ]}
          />
        </AdminSectionCard>

        <AdminSectionCard title="Customer feedback snapshot" subtitle="Reviews attached to the selected product within the demo dataset.">
          {productReviews.length ? (
            <div className="grid gap-3">
              {productReviews.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item.customer}</p>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{item.rating}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{item.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              No review sample is currently attached to this product.
            </div>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
