import { Link, Navigate, useParams } from 'react-router-dom';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorInfoGrid from '../components/VendorInfoGrid';
import { getVendorWorkspaceProductById } from '../../utils/vendorWorkspaceStorage';

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

export default function VendorProductDetailsPage() {
  const { productId } = useParams();
  const product = getVendorWorkspaceProductById(productId);

  if (!product) {
    return <Navigate to="/vendor/products" replace />;
  }

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Product Details"
        title={product.name}
        description={product.description}
        actions={
          <>
            <Link to="/vendor/products" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Back to Products
            </Link>
            <Link to={`/vendor/products/${product.id}/edit`} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Edit Product
            </Link>
          </>
        }
      />

      <VendorInfoGrid
        items={[
          { label: 'SKU', value: product.sku },
          { label: 'Category', value: product.category },
          { label: 'Brand', value: product.brand || '—' },
          { label: 'Status', value: product.status },
          { label: 'Base Price', value: formatMoney(product.basePrice) },
          { label: 'Sale Price', value: product.salePrice > 0 ? formatMoney(product.salePrice) : 'No sale price' },
          { label: 'Stock', value: String(product.stock) },
          { label: 'Last Updated', value: new Date(product.updatedAt).toLocaleString() },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h3 className="text-xl font-black text-slate-950">Merchandising</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(product.tags || []).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{tag}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sizes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(product.sizes || []).map((size) => <span key={size} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{size}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Colors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(product.colors || []).map((color) => <span key={color} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{color}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h3 className="text-xl font-black text-slate-950">Image / Media Placeholders</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(product.images || []).map((image) => (
                <div key={image} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                  {image}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid gap-6 self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Commerce Snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Created:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold text-slate-900">Margin Control:</span> Sale price is {product.salePrice > 0 ? 'configured' : 'not configured'}.</p>
              <p><span className="font-semibold text-slate-900">Catalog State:</span> {product.status}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
