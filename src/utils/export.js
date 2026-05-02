function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function exportRowsToCsv(rows, columns, filename = 'export.csv') {
  const exportableColumns = columns.filter((column) => column.key !== 'actions' && column.key !== 'action');
  const header = exportableColumns.map((column) => escapeCsv(column.label)).join(',');
  const lines = rows.map((row) =>
    exportableColumns.map((column) => {
      const rawValue = typeof column.exportValue === 'function'
        ? column.exportValue(row[column.key], row)
        : row[column.key];
      return escapeCsv(rawValue);
    }).join(',')
  );

  const csvContent = [header, ...lines].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
