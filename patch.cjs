const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const t = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate IC
    const cleanFormIC = formData.ic?.replace(/[^0-9]/g, '');`;

const r = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanFormIC = formData.ic?.replace(/[^0-9]/g, '') || '';
    const currentYear = new Date().getFullYear();
    const expectedPrefix = (currentYear - 12).toString().slice(-2);
    
    if (!cleanFormIC.startsWith(expectedPrefix)) {
      alert(\`Maaf, permohonan ini hanya terbuka untuk calon Tingkatan 1 tahun semasa. No. Kad Pengenalan mestilah bermula dengan "\${expectedPrefix}" (Lahir pada \${currentYear - 12}).\`);
      return;
    }

    // Check for duplicate IC`;

code = code.replace(t, r);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Success");
