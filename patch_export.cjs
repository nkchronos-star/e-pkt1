const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');
const lines = content.split('\n');

const exportFunc = `
export function downloadCSV(data: any[], filename: string) {
  const csvContent = "data:text/csv;charset=utf-8,\\uFEFF" 
    + data.map(row => row.map((cell: any) => \`"\\${String(cell || '').replace(/"/g, '""')}"\`).join(",")).join("\\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
`;

const insertIndex = lines.findIndex(l => l.startsWith('function PentadbirView()'));
lines.splice(insertIndex, 0, exportFunc);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', lines.join('\n'));
