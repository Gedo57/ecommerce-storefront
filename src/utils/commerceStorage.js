const COUPONS_KEY = 'storefront-coupons';
const EMAILS_KEY = 'storefront-emails';
const ANALYTICS_KEY = 'storefront-analytics';
const TICKETS_KEY = 'storefront-support-tickets';
const INVENTORY_KEY = 'storefront-inventory';
const RECENTLY_VIEWED_KEY = 'storefront-recently-viewed';
const CONTENT_KEY = 'storefront-content';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCoupons() {
  const seeded = [
    { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 50, description: 'خصم 10% لأول طلب' },
    { code: 'FREESHIP', type: 'shipping', value: 100, minSubtotal: 80, description: 'شحن مجاني' },
    { code: 'SET15', type: 'percent', value: 15, minSubtotal: 120, description: 'خصم موسمي 15%' },
  ];
  const existing = readJson(COUPONS_KEY, null);
  if (existing) return existing;
  writeJson(COUPONS_KEY, seeded);
  return seeded;
}

export function findCoupon(code) {
  return getCoupons().find((item) => item.code.toLowerCase() === String(code).trim().toLowerCase()) || null;
}

export function calculateCouponDiscount(coupon, subtotal, shippingCost) {
  if (!coupon || subtotal < Number(coupon.minSubtotal || 0)) return 0;
  if (coupon.type === 'shipping') return shippingCost;
  if (coupon.type === 'percent') return subtotal * (Number(coupon.value || 0) / 100);
  if (coupon.type === 'fixed') return Math.min(subtotal, Number(coupon.value || 0));
  return 0;
}

export function getEmails() {
  return readJson(EMAILS_KEY, []);
}

export function createEmail(email) {
  const emails = getEmails();
  const next = [{ id: `mail-${Date.now()}`, isRead: false, createdAt: new Date().toISOString(), ...email }, ...emails];
  writeJson(EMAILS_KEY, next);
  return next[0];
}

export function markEmailAsRead(emailId) {
  const emails = getEmails().map((item) => (item.id === emailId ? { ...item, isRead: true } : item));
  writeJson(EMAILS_KEY, emails);
  return emails;
}

export function getAnalyticsEvents() {
  return readJson(ANALYTICS_KEY, []);
}

export function trackEvent(type, payload = {}) {
  const events = getAnalyticsEvents();
  events.unshift({ id: `evt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, type, payload, createdAt: new Date().toISOString() });
  writeJson(ANALYTICS_KEY, events.slice(0, 300));
}

export function getAnalyticsSummary() {
  const events = getAnalyticsEvents();
  return {
    pageViews: events.filter((item) => item.type === 'page_view').length,
    addToCart: events.filter((item) => item.type === 'add_to_cart').length,
    orders: events.filter((item) => item.type === 'order_placed').length,
    supportTickets: events.filter((item) => item.type === 'support_ticket_created').length,
  };
}

export function getSupportTickets() {
  return readJson(TICKETS_KEY, []);
}

export function createSupportTicket(ticket) {
  const tickets = getSupportTickets();
  const next = [{ id: `ticket-${Date.now()}`, status: 'Open', createdAt: new Date().toISOString(), ...ticket }, ...tickets];
  writeJson(TICKETS_KEY, next);
  trackEvent('support_ticket_created', { subject: ticket.subject });
  return next[0];
}

export function getInventoryMap() {
  return readJson(INVENTORY_KEY, {});
}

export function getVariantStock(sku, fallbackStock = 0) {
  const map = getInventoryMap();
  return typeof map[sku] === 'number' ? map[sku] : fallbackStock;
}

export function initializeInventory(variants = []) {
  const current = getInventoryMap();
  const next = { ...current };
  variants.forEach((variant) => {
    if (typeof next[variant.sku] !== 'number') next[variant.sku] = Number(variant.stock || 0);
  });
  writeJson(INVENTORY_KEY, next);
  return next;
}

export function consumeInventory(items = []) {
  const current = getInventoryMap();
  const next = { ...current };
  items.forEach((item) => {
    const sku = item.sku;
    if (!sku) return;
    const existing = Number(next[sku] ?? item.stock ?? 0);
    next[sku] = Math.max(0, existing - Number(item.quantity || 1));
  });
  writeJson(INVENTORY_KEY, next);
  return next;
}

export function saveRecentlyViewed(product) {
  const items = readJson(RECENTLY_VIEWED_KEY, []);
  const next = [{ id: product.id, title: product.title, image: product.image, category: product.category, viewedAt: new Date().toISOString() }, ...items.filter((item) => String(item.id) !== String(product.id))].slice(0, 12);
  writeJson(RECENTLY_VIEWED_KEY, next);
}

export function getRecentlyViewed() {
  return readJson(RECENTLY_VIEWED_KEY, []);
}

const defaultContent = {
  supportEmail: 'support@set-store.demo',
  supportPhone: '+20 100 000 0000',
  announcement: 'شحن مجاني على الطلبات المؤهلة وشاشة تتبع محلية للطلبات.',
  heroTitle: 'SET — Storefront Demo',
  heroSubtitle: 'واجهة متجر مطورة مع تتبع طلبات، كوبونات، ودعم محلي.',
};

export function getContentSettings() {
  const saved = readJson(CONTENT_KEY, null);
  if (saved) return { ...defaultContent, ...saved };
  writeJson(CONTENT_KEY, defaultContent);
  return defaultContent;
}

export function saveContentSettings(payload) {
  const next = { ...getContentSettings(), ...payload };
  writeJson(CONTENT_KEY, next);
  return next;
}
