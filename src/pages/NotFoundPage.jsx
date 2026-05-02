import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-brand-900/10 bg-white p-8 text-center shadow-soft sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">404</p>
        <h1 className="mt-4 text-4xl font-black text-brand-900 sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-900/68">
          The page you requested could not be found. Return to the storefront and continue browsing the collection.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="primary-btn">Back to home</Link>
          <Link to="/wishlist" className="ghost-btn">Go to wishlist</Link>
        </div>
      </div>
    </section>
  );
}
