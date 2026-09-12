const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetFile = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();`;

const replacementFile = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g. max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert("Saiz fail melebihi 2MB. Sila muat naik fail atau gambar yang lebih kecil untuk mengelakkan masalah sistem.");
        return;
      }
      const reader = new FileReader();`;

code = code.replace(targetFile, replacementFile);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched file size warning");
