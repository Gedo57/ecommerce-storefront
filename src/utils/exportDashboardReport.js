import { kpiCards, recentActivity, recentOrders, revenueData, salesData } from '../data/dashboardData';

function escapeCsvValue(value) {
  const safeValue = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(safeValue) ? `"${safeValue.replace(/"/g, '""')}"` : safeValue;
}

function buildCsvSection(title, headers, rows) {
  return [
    [title],
    headers,
    ...rows,
    [],
  ]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}

function downloadCsv(filename, csvContent) {
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDashboardReport() {
  const generatedAt = new Date();
  const dateStamp = generatedAt.toISOString().slice(0, 10);

  const sections = [
    buildCsvSection(
      'NexaDash Dashboard Report',
      ['Generated At', generatedAt.toLocaleString()],
      [],
    ),
    buildCsvSection(
      'KPI Summary',
      ['Metric', 'Value', 'Change', 'Trend', 'Description'],
      kpiCards.map((card) => [card.label, card.displayValue, card.change, card.trend, card.description]),
    ),
    buildCsvSection(
      'Revenue Performance',
      ['Month', 'Revenue', 'Expenses'],
      revenueData.map((item) => [item.month, item.revenue, item.expenses]),
    ),
    buildCsvSection(
      'Weekly Orders',
      ['Day', 'Orders'],
      salesData.map((item) => [item.day, item.orders]),
    ),
    buildCsvSection(
      'Recent Orders',
      ['Order ID', 'Customer', 'Product', 'Status', 'Amount', 'Date'],
      recentOrders.map((order) => [order.id, order.customer, order.product, order.status, order.amount, order.date]),
    ),
    buildCsvSection(
      'Recent Activity',
      ['Title', 'Description', 'Time', 'Type'],
      recentActivity.map((activity) => [activity.title, activity.description, activity.time, activity.type]),
    ),
  ];

  downloadCsv(`nexadash-dashboard-report-${dateStamp}.csv`, sections.join('\n'));
}
