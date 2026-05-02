import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VendorPageHeader from '../components/VendorPageHeader';
import { useToast } from '../../context/ToastContext';
import {
  clearVendorProductDraft,
  createVendorWorkspaceProduct,
  getVendorProductDraft,
  getVendorWorkspaceProductById,
  saveVendorProductDraft,
  updateVendorWorkspaceProduct,
} from '../../utils/vendorWorkspaceStorage';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  brand: '',
  sku: '',
  basePrice: '',
  salePrice: '',
  stock: '',
  status: 'Draft',
  tags: '',
  sizes: '',
  colors: '',
  images: '',
};

function toFormState(product) {
  if (!product) return emptyForm;
  return {
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    brand: product.brand || '',
    sku: product.sku || '',
    basePrice: String(product.basePrice ?? ''),
    salePrice: String(product.salePrice ?? ''),
    stock: String(product.stock ?? ''),
    status: product.status || 'Draft',
    tags: (product.tags || []).join(', '),
    sizes: (product.sizes || []).join(', '),
    colors: (product.colors || []).join(', '),
    images: (product.images || []).join(', '),
  };
}

function parseCommaSeparated(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function VendorProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(productId);
  const existingProduct = useMemo(() => (isEdit ? getVendorWorkspaceProductById(productId) : null), [isEdit, productId]);
  const [form, setForm] = useState(() => {
    if (isEdit && existingProduct) return toFormState(existingProduct);
    return toFormState(getVendorProductDraft());
  });

  useEffect(() => {
    if (isEdit && !existingProduct) {
      navigate('/vendor/products', { replace: true });
    }
  }, [existingProduct, isEdit, navigate]);

  useEffect(() => {
    if (!isEdit) saveVendorProductDraft(form);
  }, [form, isEdit]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    category: form.category,
    brand: form.brand,
    sku: form.sku,
    basePrice: Number(form.basePrice || 0),
    salePrice: Number(form.salePrice || 0),
    stock: Number(form.stock || 0),
    status: form.status,
    tags: parseCommaSeparated(form.tags),
    sizes: parseCommaSeparated(form.sizes),
    colors: parseCommaSeparated(form.colors),
    images: parseCommaSeparated(form.images),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.sku || !form.category || !form.basePrice) {
      showToast({ title: 'Missing required fields', description: 'Name, SKU, category, and base price are required.' });
      return;
    }

    const payload = buildPayload();
    if (isEdit) {
      const updated = updateVendorWorkspaceProduct(productId, payload);
      showToast({ title: 'Product updated', description: `${updated?.name || 'Product'} is now saved.`, variant: 'success' });
      navigate(`/vendor/products/${productId}`);
      return;
    }

    const created = createVendorWorkspaceProduct(payload);
    clearVendorProductDraft();
    showToast({ title: 'Product created', description: `${created.name} was added to the vendor catalog.`, variant: 'success' });
    navigate(`/vendor/products/${created.id}`);
  };

  return (
    <div className="grid gap-6">
      <VendorPageHeader
        eyebrow="Catalog Workflow"
        title={isEdit ? 'Edit Product' : 'Add Product'}
        description={isEdit ? 'Update pricing, stock, content, and merchandising metadata for this SKU.' : 'Create a vendor product with operational fields ready for future inventory and merchandising workflows.'}
        actions={
          <>
            <Link to="/vendor/products" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Back to Products
            </Link>
            {!isEdit ? (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  clearVendorProductDraft();
                  showToast({ title: 'Draft cleared', description: 'The local new-product draft has been reset.' });
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Draft
              </button>
            ) : null}
          </>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Core Product Data</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Product Name *
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="checkout-input" placeholder="Tailored Evening Dress" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                SKU *
                <input value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} className="checkout-input" placeholder="SET-NEW-001" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Category *
                <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="checkout-input" placeholder="Dresses" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Brand
                <input value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} className="checkout-input" placeholder="SET Atelier" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
              Description
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="checkout-input min-h-[140px]" placeholder="Describe silhouette, fabric, fit, and styling context..." />
            </label>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Commercial & Inventory</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Base Price *
                <input type="number" min="0" value={form.basePrice} onChange={(e) => handleChange('basePrice', e.target.value)} className="checkout-input" placeholder="84" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Sale Price
                <input type="number" min="0" value={form.salePrice} onChange={(e) => handleChange('salePrice', e.target.value)} className="checkout-input" placeholder="74" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Stock
                <input type="number" min="0" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} className="checkout-input" placeholder="22" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Publish State
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="filter-select">
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Archived</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-950">Merchandising Metadata</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tags
                <input value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="checkout-input" placeholder="occasion, satin, bestseller" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Sizes
                <input value={form.sizes} onChange={(e) => handleChange('sizes', e.target.value)} className="checkout-input" placeholder="S, M, L" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Colors
                <input value={form.colors} onChange={(e) => handleChange('colors', e.target.value)} className="checkout-input" placeholder="Black, Emerald" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Image Labels
                <input value={form.images} onChange={(e) => handleChange('images', e.target.value)} className="checkout-input" placeholder="Hero shot, Detail close-up" />
              </label>
            </div>
          </section>
        </div>

        <aside className="grid gap-6 self-start">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h3 className="text-lg font-black text-slate-950">Submission Preview</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Name:</span> {form.name || '—'}</p>
              <p><span className="font-semibold text-slate-900">SKU:</span> {form.sku || '—'}</p>
              <p><span className="font-semibold text-slate-900">Price:</span> ${form.basePrice || 0}</p>
              <p><span className="font-semibold text-slate-900">Stock:</span> {form.stock || 0}</p>
              <p><span className="font-semibold text-slate-900">State:</span> {form.status}</p>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              {isEdit ? 'Save Product Changes' : 'Create Product'}
            </button>
          </section>

          <section className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
            <p className="text-sm font-semibold text-emerald-900">Phase 4A Note</p>
            <p className="mt-2 text-sm leading-7 text-emerald-900/75">
              New products are stored locally so the vendor can create, revisit, edit, and inspect product records without backend integration.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
