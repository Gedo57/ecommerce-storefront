const VENDOR_INVENTORY_KEY = 'vendor-workspace-inventory';
const VENDOR_INVENTORY_LOGS_KEY = 'vendor-workspace-inventory-logs';
const VENDOR_PROMOTIONS_KEY = 'vendor-workspace-promotions';
const VENDOR_SETTINGS_KEY = 'vendor-workspace-settings';

const defaultInventory = [
  { id: 'vinv-1', warehouse: 'Cairo Main', sku: 'SET-DRS-101', product: 'Satin Evening Dress', available: 22, reserved: 4, incoming: 10 },
  { id: 'vinv-2', warehouse: 'Cairo Main', sku: 'SET-TOP-204', product: 'Tailored Blazer', available: 7, reserved: 2, incoming: 18 },
  { id: 'vinv-3', warehouse: 'Alex Hub', sku: 'SET-BAG-008', product: 'Mini Leather Bag', available: 31, reserved: 5, incoming: 0 },
  { id: 'vinv-4', warehouse: 'Alex Hub', sku: 'SET-SHO-911', product: 'Square Heel Sandals', available: 0, reserved: 0, incoming: 24 },
];

const defaultInventoryLogs = [
  { id: 'ilog-1', sku: 'SET-TOP-204', action: 'Manual Increase', quantity: 12, reason: 'Restock arrived from supplier', createdAt: '2026-04-24 10:45' },
  { id: 'ilog-2', sku: 'SET-SHO-911', action: 'Incoming Update', quantity: 24, reason: 'New shipment scheduled', createdAt: '2026-04-24 09:10' },
];

const defaultPromotions = [
  { id: 'vprm-1', campaign: 'Weekend Satin Drop', type: 'Coupon', discount: '15%', usage: 84, status: 'Active', code: 'SATIN15', startDate: '2026-04-24', endDate: '2026-04-28', limit: 200 },
  { id: 'vprm-2', campaign: 'Blazer Push', type: 'Fixed', discount: '$10', usage: 18, status: 'Scheduled', code: 'BLAZER10', startDate: '2026-04-29', endDate: '2026-05-03', limit: 100 },
];

const defaultSettings = {
  storeDescription: 'Elevated fashion essentials with a focus on occasionwear, polished tailoring, and premium finishing details.',
  supportEmail: 'vendor@vendor.com',
  supportPhone: '+20 100 000 0000',
  payoutMethod: 'Bank Transfer',
  payoutFrequency: 'Weekly',
  logoLabel: 'Primary logo uploaded',
  bannerLabel: 'Store hero banner ready',
  shippingPolicy: 'Processing within 1-2 business days. Domestic delivery estimated in 2-4 business days.',
  returnPolicy: 'Returns accepted within 14 days for unworn items with original tags.',
  notificationOrders: true,
  notificationLowStock: true,
  notificationRefunds: true,
};

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

export function getVendorInventory() {
  const existing = readJson(VENDOR_INVENTORY_KEY, null);
  if (!Array.isArray(existing) || existing.length === 0) {
    writeJson(VENDOR_INVENTORY_KEY, defaultInventory);
    return defaultInventory;
  }
  return existing;
}

export function getVendorInventoryLogs() {
  const existing = readJson(VENDOR_INVENTORY_LOGS_KEY, null);
  if (!Array.isArray(existing) || existing.length === 0) {
    writeJson(VENDOR_INVENTORY_LOGS_KEY, defaultInventoryLogs);
    return defaultInventoryLogs;
  }
  return existing;
}

export function adjustVendorInventory({ sku, adjustmentType, quantity, reason }) {
  const safeQuantity = Math.max(0, Number(quantity || 0));
  if (!sku || !adjustmentType || safeQuantity <= 0) return null;

  const inventory = getVendorInventory();
  let updatedItem = null;
  const nextInventory = inventory.map((item) => {
    if (item.sku !== sku) return item;
    const next = { ...item };

    if (adjustmentType === 'increase') next.available += safeQuantity;
    if (adjustmentType === 'decrease') next.available = Math.max(0, next.available - safeQuantity);
    if (adjustmentType === 'incoming') next.incoming += safeQuantity;

    updatedItem = next;
    return next;
  });

  if (!updatedItem) return null;

  writeJson(VENDOR_INVENTORY_KEY, nextInventory);

  const actionLabel = adjustmentType === 'increase' ? 'Manual Increase' : adjustmentType === 'decrease' ? 'Manual Decrease' : 'Incoming Update';
  const nextLogs = [
    {
      id: `ilog-${Date.now()}`,
      sku,
      action: actionLabel,
      quantity: safeQuantity,
      reason: String(reason || '').trim() || 'No reason provided',
      createdAt: new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
    },
    ...getVendorInventoryLogs(),
  ];
  writeJson(VENDOR_INVENTORY_LOGS_KEY, nextLogs);
  return updatedItem;
}

export function getVendorPromotions() {
  const existing = readJson(VENDOR_PROMOTIONS_KEY, null);
  if (!Array.isArray(existing) || existing.length === 0) {
    writeJson(VENDOR_PROMOTIONS_KEY, defaultPromotions);
    return defaultPromotions;
  }
  return existing;
}

export function createVendorPromotion(payload) {
  const promotions = getVendorPromotions();
  const created = {
    id: `vprm-${Date.now()}`,
    campaign: String(payload.campaign || '').trim(),
    type: String(payload.type || 'Coupon').trim(),
    discount: String(payload.discount || '').trim(),
    usage: 0,
    status: String(payload.status || 'Draft').trim(),
    code: String(payload.code || '').trim(),
    startDate: String(payload.startDate || '').trim(),
    endDate: String(payload.endDate || '').trim(),
    limit: Number(payload.limit || 0),
  };
  const next = [created, ...promotions];
  writeJson(VENDOR_PROMOTIONS_KEY, next);
  return created;
}

export function getVendorSettings() {
  const existing = readJson(VENDOR_SETTINGS_KEY, null);
  if (!existing || typeof existing !== 'object') {
    writeJson(VENDOR_SETTINGS_KEY, defaultSettings);
    return defaultSettings;
  }
  return { ...defaultSettings, ...existing };
}

export function saveVendorSettings(payload) {
  const next = { ...getVendorSettings(), ...payload };
  writeJson(VENDOR_SETTINGS_KEY, next);
  return next;
}
