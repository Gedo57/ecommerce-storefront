export const adminOverview = {
  revenue: 1245800,
  orders: 3842,
  activeVendors: 128,
  products: 9640,
  avgOrderValue: 324,
  refundRate: 2.8,
  customers: 24860,
  openRefunds: 46,
};

export const salesTrend = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 41 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 52 },
  { label: 'Fri', value: 61 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 57 },
];

export const orders = [
  { id: '#SET-20394', customer: 'Lina Hassan', vendor: 'Moda District', items: 4, total: 420, payment: 'Paid', status: 'Processing', date: '2026-04-22' },
  { id: '#SET-20393', customer: 'Noor Ali', vendor: 'Urban Curve', items: 2, total: 188, payment: 'Paid', status: 'Ready to Ship', date: '2026-04-22' },
  { id: '#SET-20392', customer: 'Sara Adel', vendor: 'The Edit House', items: 1, total: 96, payment: 'Pending', status: 'Pending', date: '2026-04-21' },
  { id: '#SET-20391', customer: 'Youssef Omar', vendor: 'Anevsta', items: 3, total: 265, payment: 'Paid', status: 'Delivered', date: '2026-04-21' },
  { id: '#SET-20390', customer: 'Aya Mahmoud', vendor: 'Casa Bloom', items: 5, total: 510, payment: 'Refunded', status: 'Returned', date: '2026-04-20' },
];

export const products = [
  { id: 'PRD-1001', title: 'Structured Linen Blazer', vendor: 'Moda District', category: 'Women / Outerwear', stock: 28, price: 165, status: 'Active' },
  { id: 'PRD-1002', title: 'Layered Satin Dress', vendor: 'The Edit House', category: 'Women / Dresses', stock: 8, price: 142, status: 'Low Stock' },
  { id: 'PRD-1003', title: 'Oversized Knit Polo', vendor: 'Urban Curve', category: 'Men / Tops', stock: 0, price: 84, status: 'Out of Stock' },
  { id: 'PRD-1004', title: 'Leather Mini Crossbody', vendor: 'Anevsta', category: 'Bags & Accessories', stock: 34, price: 120, status: 'Active' },
  { id: 'PRD-1005', title: 'Neutral Home Candle Set', vendor: 'Casa Bloom', category: 'Home & Kitchen', stock: 16, price: 58, status: 'Draft' },
];

export const vendors = [
  { id: 'VND-2201', name: 'Moda District', owner: 'Mariam Samir', products: 148, orders: 912, revenue: 142500, commissionRate: '12%', status: 'Active' },
  { id: 'VND-2202', name: 'Urban Curve', owner: 'Omar Nabil', products: 92, orders: 544, revenue: 86410, commissionRate: '11%', status: 'Active' },
  { id: 'VND-2203', name: 'The Edit House', owner: 'Nadine Fahmy', products: 74, orders: 388, revenue: 69220, commissionRate: '13%', status: 'Review' },
  { id: 'VND-2204', name: 'Anevsta', owner: 'Karim Ashraf', products: 56, orders: 261, revenue: 48170, commissionRate: '10%', status: 'Active' },
  { id: 'VND-2205', name: 'Casa Bloom', owner: 'Yara Tarek', products: 38, orders: 119, revenue: 18940, commissionRate: '9%', status: 'Suspended' },
];

export const customers = [
  { id: 'CUS-4001', name: 'Lina Hassan', email: 'lina.hassan@example.com', tier: 'Gold', orders: 24, spent: 2480, lastOrder: '2026-04-22', status: 'Active' },
  { id: 'CUS-4002', name: 'Noor Ali', email: 'noor.ali@example.com', tier: 'Silver', orders: 11, spent: 1120, lastOrder: '2026-04-22', status: 'Active' },
  { id: 'CUS-4003', name: 'Sara Adel', email: 'sara.adel@example.com', tier: 'New', orders: 2, spent: 144, lastOrder: '2026-04-21', status: 'Review' },
  { id: 'CUS-4004', name: 'Youssef Omar', email: 'youssef.omar@example.com', tier: 'VIP', orders: 36, spent: 3920, lastOrder: '2026-04-21', status: 'Active' },
  { id: 'CUS-4005', name: 'Aya Mahmoud', email: 'aya.mahmoud@example.com', tier: 'Silver', orders: 9, spent: 980, lastOrder: '2026-04-20', status: 'Suspended' },
];

export const inventoryHealth = [
  { sku: 'SKU-LBZ-001', product: 'Structured Linen Blazer', vendor: 'Moda District', warehouse: 'Cairo Main', onHand: 28, reserved: 4, reorderPoint: 12, status: 'Healthy' },
  { sku: 'SKU-DRS-114', product: 'Layered Satin Dress', vendor: 'The Edit House', warehouse: 'Giza Hub', onHand: 8, reserved: 3, reorderPoint: 10, status: 'Low Stock' },
  { sku: 'SKU-PL-320', product: 'Oversized Knit Polo', vendor: 'Urban Curve', warehouse: 'Alex DC', onHand: 0, reserved: 0, reorderPoint: 8, status: 'Out of Stock' },
  { sku: 'SKU-BAG-041', product: 'Leather Mini Crossbody', vendor: 'Anevsta', warehouse: 'Cairo Main', onHand: 34, reserved: 6, reorderPoint: 10, status: 'Healthy' },
  { sku: 'SKU-HME-771', product: 'Neutral Home Candle Set', vendor: 'Casa Bloom', warehouse: '6th October', onHand: 16, reserved: 2, reorderPoint: 6, status: 'Healthy' },
];

export const promotions = [
  { id: 'PRM-601', name: 'Weekend Flash 15%', type: 'Flash Sale', scope: 'Marketplace', usage: 942, budget: 4200, window: 'Apr 24 → Apr 26', status: 'Active' },
  { id: 'PRM-602', name: 'Vendor Boost - Moda', type: 'Featured Slot', scope: 'Vendor', usage: 120, budget: 900, window: 'Apr 21 → Apr 30', status: 'Active' },
  { id: 'PRM-603', name: 'WELCOME10', type: 'Coupon', scope: 'New Customers', usage: 314, budget: 1500, window: 'Always On', status: 'Active' },
  { id: 'PRM-604', name: 'Home Refresh Bundle', type: 'Bundle Offer', scope: 'Category', usage: 56, budget: 600, window: 'May 01 → May 10', status: 'Scheduled' },
  { id: 'PRM-605', name: 'Clearance Last Call', type: 'Markdown', scope: 'Selected SKUs', usage: 0, budget: 0, window: 'Draft', status: 'Draft' },
];

export const reviews = [
  { id: 'RVW-8801', product: 'Layered Satin Dress', customer: 'Lina Hassan', vendor: 'The Edit House', rating: '5/5', summary: 'Great fabric, accurate sizing, fast delivery.', flagged: 'No', status: 'Published' },
  { id: 'RVW-8802', product: 'Structured Linen Blazer', customer: 'Noor Ali', vendor: 'Moda District', rating: '4/5', summary: 'Beautiful cut but sleeves run slightly long.', flagged: 'No', status: 'Published' },
  { id: 'RVW-8803', product: 'Oversized Knit Polo', customer: 'Aya Mahmoud', vendor: 'Urban Curve', rating: '2/5', summary: 'The stock delay caused a poor experience.', flagged: 'Yes', status: 'Needs Review' },
  { id: 'RVW-8804', product: 'Leather Mini Crossbody', customer: 'Youssef Omar', vendor: 'Anevsta', rating: '5/5', summary: 'Excellent finish and premium look.', flagged: 'No', status: 'Published' },
  { id: 'RVW-8805', product: 'Neutral Home Candle Set', customer: 'Sara Adel', vendor: 'Casa Bloom', rating: '3/5', summary: 'Packaging was nice, scent was lighter than expected.', flagged: 'No', status: 'Hidden' },
];

export const refunds = [
  { id: 'RFD-7101', orderId: '#SET-20390', customer: 'Aya Mahmoud', vendor: 'Casa Bloom', reason: 'Damaged item', amount: 78, method: 'Original Payment', status: 'Pending', updatedAt: '2026-04-23' },
  { id: 'RFD-7102', orderId: '#SET-20384', customer: 'Mona Saleh', vendor: 'Urban Curve', reason: 'Wrong size', amount: 42, method: 'Store Credit', status: 'Approved', updatedAt: '2026-04-22' },
  { id: 'RFD-7103', orderId: '#SET-20380', customer: 'Omar Fathy', vendor: 'Moda District', reason: 'Late delivery', amount: 24, method: 'Original Payment', status: 'Processing', updatedAt: '2026-04-22' },
  { id: 'RFD-7104', orderId: '#SET-20377', customer: 'Nadine Farid', vendor: 'The Edit House', reason: 'Color mismatch', amount: 61, method: 'Original Payment', status: 'Resolved', updatedAt: '2026-04-21' },
  { id: 'RFD-7105', orderId: '#SET-20371', customer: 'Khaled Adel', vendor: 'Anevsta', reason: 'Missing item', amount: 29, method: 'Store Credit', status: 'Escalated', updatedAt: '2026-04-20' },
];

export const adminAlerts = [
  { title: '14 products need approval', detail: 'Merchant submissions are waiting in the moderation queue.', tone: 'warning' },
  { title: '6 payout requests pending', detail: 'Finance review is required before release.', tone: 'neutral' },
  { title: 'Low-stock spike detected', detail: '23 SKUs dropped below the configured stock threshold.', tone: 'danger' },
];

export const reportSnapshots = [
  { metric: 'GMV', value: '$1.25M', delta: '+12.4%', period: 'Last 30 days', status: 'Up' },
  { metric: 'Net Revenue', value: '$932K', delta: '+9.1%', period: 'Last 30 days', status: 'Up' },
  { metric: 'Refund Rate', value: '2.8%', delta: '-0.4%', period: 'Last 30 days', status: 'Improving' },
  { metric: 'Payment Success', value: '96.2%', delta: '+1.2%', period: 'Last 30 days', status: 'Healthy' },
];

export const topProductsReport = [
  { sku: 'SKU-LBZ-001', product: 'Structured Linen Blazer', vendor: 'Moda District', unitsSold: 318, revenue: '$52,470', returnRate: '1.9%' },
  { sku: 'SKU-DRS-114', product: 'Layered Satin Dress', vendor: 'The Edit House', unitsSold: 287, revenue: '$40,754', returnRate: '2.6%' },
  { sku: 'SKU-BAG-041', product: 'Leather Mini Crossbody', vendor: 'Anevsta', unitsSold: 246, revenue: '$29,520', returnRate: '1.4%' },
  { sku: 'SKU-HME-771', product: 'Neutral Home Candle Set', vendor: 'Casa Bloom', unitsSold: 221, revenue: '$12,818', returnRate: '0.8%' },
];

export const rolePermissions = [
  { role: 'Super Admin', users: 2, products: 'Full Access', orders: 'Approve / Edit / Refund', finance: 'Full Access', cms: 'Full Access', status: 'Active' },
  { role: 'Operations Manager', users: 5, products: 'View / Edit', orders: 'Manage Fulfillment', finance: 'View Only', cms: 'View Only', status: 'Active' },
  { role: 'Customer Support', users: 11, products: 'View Only', orders: 'View / Escalate / Refund Request', finance: 'Restricted', cms: 'Restricted', status: 'Active' },
  { role: 'Finance', users: 4, products: 'View Only', orders: 'View Only', finance: 'Payout / Reconcile', cms: 'Restricted', status: 'Active' },
  { role: 'Content Manager', users: 3, products: 'View / Edit Merchandising', orders: 'Restricted', finance: 'Restricted', cms: 'Edit / Publish', status: 'Active' },
];

export const cmsBlocks = [
  { id: 'CMS-101', section: 'Homepage Hero', owner: 'Merchandising', lastUpdated: '2026-04-23', schedule: 'Always On', status: 'Published' },
  { id: 'CMS-102', section: 'Announcement Bar', owner: 'Growth Team', lastUpdated: '2026-04-22', schedule: 'Apr 22 → Apr 28', status: 'Published' },
  { id: 'CMS-103', section: 'Footer Policies', owner: 'Content Manager', lastUpdated: '2026-04-21', schedule: 'Always On', status: 'Published' },
  { id: 'CMS-104', section: 'Spring Landing Page', owner: 'Marketing', lastUpdated: '2026-04-20', schedule: 'May 01 → May 15', status: 'Scheduled' },
  { id: 'CMS-105', section: 'FAQ Hub', owner: 'Support Ops', lastUpdated: '2026-04-18', schedule: 'Draft', status: 'Draft' },
];

export const systemSettings = [
  { key: 'Default Currency', value: 'USD', owner: 'Commerce Ops', scope: 'Storefront', status: 'Active' },
  { key: 'Vendor Auto Approval', value: 'Disabled', owner: 'Admin Control', scope: 'Vendor Onboarding', status: 'Review' },
  { key: 'Tax Inclusive Pricing', value: 'Enabled', owner: 'Finance', scope: 'Checkout', status: 'Active' },
  { key: 'Guest Checkout', value: 'Enabled', owner: 'Growth Team', scope: 'Conversion', status: 'Active' },
  { key: 'Password Policy', value: 'Strong', owner: 'Security', scope: 'Authentication', status: 'Active' },
];

export const notificationsFeed = [
  { id: 'NTF-01', event: 'New vendor application', target: 'Ahmed Fashion House', channel: 'In-App + Email', priority: 'High', status: 'Unread', time: '5 min ago' },
  { id: 'NTF-02', event: 'Refund escalated', target: '#SET-20390', channel: 'In-App', priority: 'High', status: 'Unread', time: '14 min ago' },
  { id: 'NTF-03', event: 'Payout batch ready', target: 'April Week 4', channel: 'Email', priority: 'Medium', status: 'Queued', time: '38 min ago' },
  { id: 'NTF-04', event: 'Low stock threshold hit', target: '23 SKUs', channel: 'Slack Mirror', priority: 'Medium', status: 'Read', time: '1 hr ago' },
  { id: 'NTF-05', event: 'Homepage campaign published', target: 'Weekend Flash 15%', channel: 'In-App', priority: 'Low', status: 'Read', time: '3 hr ago' },
];

export const payouts = [
  { id: 'PAY-5001', vendor: 'Moda District', cycle: 'Apr 01 → Apr 15', gross: '$28,400', commission: '$3,408', net: '$24,992', status: 'Pending Review' },
  { id: 'PAY-5002', vendor: 'Urban Curve', cycle: 'Apr 01 → Apr 15', gross: '$19,820', commission: '$2,180', net: '$17,640', status: 'Ready' },
  { id: 'PAY-5003', vendor: 'The Edit House', cycle: 'Apr 01 → Apr 15', gross: '$15,610', commission: '$2,029', net: '$13,581', status: 'On Hold' },
  { id: 'PAY-5004', vendor: 'Anevsta', cycle: 'Apr 01 → Apr 15', gross: '$12,400', commission: '$1,240', net: '$11,160', status: 'Paid' },
  { id: 'PAY-5005', vendor: 'Casa Bloom', cycle: 'Apr 01 → Apr 15', gross: '$5,880', commission: '$529', net: '$5,351', status: 'Needs Review' },
];
