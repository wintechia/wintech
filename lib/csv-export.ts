/**
 * Utility functions for CSV export
 */

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If the value contains commas, quotes, or newlines, wrap in quotes and escape inner quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return '';

  // BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';

  const header = columns.map((col) => escapeCsvField(col.label)).join(',');
  const rows = data.map((row) =>
    columns.map((col) => escapeCsvField(row[col.key])).join(',')
  );

  return BOM + [header, ...rows].join('\r\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDate(dateStr: string | null | undefined, locale = 'es-CO'): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(locale);
  } catch {
    return '—';
  }
}

export function formatDateTime(dateStr: string | null | undefined, locale = 'es-CO'): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale) + ' ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}
