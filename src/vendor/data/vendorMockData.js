export const vendorStats = [
  { label: 'Today Revenue', value: '$4,280', note: '+12.4% vs yesterday' },
  { label: 'Open Orders', value: '38', note: '12 ready to ship' },
  { label: 'Active Products', value: '124', note: '8 drafts pending update' },
  { label: 'Low Stock Alerts', value: '11', note: '3 critical SKUs' },
];

export const vendorOrders = [
  { id: '#V-12051', customer: 'Mariam Adel', total: '$182.00', status: 'Processing', fulfillment: 'Packed', date: '2026-04-21' },
  { id: '#V-12052', customer: 'Sara Nabil', total: '$96.00', status: 'Ready to Ship', fulfillment: 'Label created', date: '2026-04-22' },
  { id: '#V-12053', customer: 'Laila Tarek', total: '$244.00', status: 'Delivered', fulfillment: 'Completed', date: '2026-04-22' },
  { id: '#V-12054', customer: 'Nadine Sami', total: '$138.00', status: 'Pending', fulfillment: 'Awaiting payment', date: '2026-04-23' },
];

export const vendorProducts = [
  { sku: 'SET-DRS-101', name: 'Satin Evening Dress', stock: 22, price: '$84', status: 'Active' },
  { sku: 'SET-TOP-204', name: 'Tailored Blazer', stock: 7, price: '$66', status: 'Low Stock' },
  { sku: 'SET-BAG-008', name: 'Mini Leather Bag', stock: 31, price: '$48', status: 'Active' },
  { sku: 'SET-SHO-911', name: 'Square Heel Sandals', stock: 0, price: '$57', status: 'Out of Stock' },
];

export const vendorInventory = [
  { warehouse: 'Cairo Main', sku: 'SET-DRS-101', product: 'Satin Evening Dress', available: 22, reserved: 4, incoming: 10 },
  { warehouse: 'Cairo Main', sku: 'SET-TOP-204', product: 'Tailored Blazer', available: 7, reserved: 2, incoming: 18 },
  { warehouse: 'Alex Hub', sku: 'SET-BAG-008', product: 'Mini Leather Bag', available: 31, reserved: 5, incoming: 0 },
  { warehouse: 'Alex Hub', sku: 'SET-SHO-911', product: 'Square Heel Sandals', available: 0, reserved: 0, incoming: 24 },
];

export const vendorPromotions = [
  { id: 'PRM-101', campaign: 'Weekend Dresses Boost', type: 'Discount Code', discount: '15%', usage: '184 uses', status: 'Active' },
  { id: 'PRM-102', campaign: 'Buy 2 Accessories', type: 'Bundle Offer', discount: '10%', usage: '62 uses', status: 'Scheduled' },
  { id: 'PRM-103', campaign: 'VIP Early Access', type: 'Private Collection', discount: '20%', usage: '31 uses', status: 'Draft' },
];

export const vendorReviews = [
  { id: 'REV-801', product: 'Satin Evening Dress', customer: 'Lina Hassan', rating: '5/5', sentiment: 'Positive', status: 'Published' },
  { id: 'REV-802', product: 'Mini Leather Bag', customer: 'Aya Mahmoud', rating: '4/5', sentiment: 'Positive', status: 'Published' },
  { id: 'REV-803', product: 'Tailored Blazer', customer: 'Nadine Sami', rating: '2/5', sentiment: 'Needs Action', status: 'Flagged' },
];

export const vendorEarnings = [
  { period: 'This Week', gross: '$8,440', fees: '$1,012', refunds: '$164', net: '$7,264' },
  { period: 'This Month', gross: '$34,280', fees: '$4,113', refunds: '$610', net: '$29,557' },
  { period: 'Last Month', gross: '$31,940', fees: '$3,832', refunds: '$488', net: '$27,620' },
];

export const vendorPayouts = [
  { id: 'PAY-2001', method: 'Bank Transfer', amount: '$5,400', date: '2026-04-19', status: 'Paid' },
  { id: 'PAY-2002', method: 'Bank Transfer', amount: '$4,860', date: '2026-04-12', status: 'Paid' },
  { id: 'PAY-2003', method: 'Bank Transfer', amount: '$6,120', date: '2026-04-26', status: 'Scheduled' },
];

export const vendorSettingsSections = [
  { title: 'Store Profile', value: 'Ahmed Fashion House', note: 'Public merchant identity and storefront details.' },
  { title: 'Fulfillment Contact', value: '+20 100 000 0000', note: 'Primary contact used for shipping and operations.' },
  { title: 'Settlement Method', value: 'Bank transfer · weekly', note: 'Current payout cadence for merchant settlements.' },
  { title: 'Notification Rules', value: 'Orders, low stock, refunds', note: 'Core alerts enabled for the vendor team.' },
];
