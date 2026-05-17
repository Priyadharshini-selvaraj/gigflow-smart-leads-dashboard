import { Lead } from '@/types/lead.types';

export const downloadCSV = (leads: Lead[], filename = 'leads-export.csv'): void => {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Notes', 'Created At'];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.phone ?? '',
    l.company ?? '',
    l.status,
    l.source,
    (l.notes ?? '').replace(/,/g, ';'),
    new Date(l.createdAt).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
