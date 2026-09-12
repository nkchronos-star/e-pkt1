const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const target = `    const missing = getMissingFields();
    if (missing.length > 0) {
      alert("Sila lengkapkan ruangan berikut:\\n\\n" + missing.map(m => "- " + m).join("\\n"));
      return;
    }

    setIsSubmitting(true);`;

const replacement = `    const missing = getMissingFields();
    if (missing.length > 0) {
      alert("Sila lengkapkan ruangan berikut:\\n\\n" + missing.map(m => "- " + m).join("\\n"));
      return;
    }

    // Semak IC yang telah didaftarkan (untuk mengelakkan hantar 2 kali)
    const existingCandidate = (JSON.parse(localStorage.getItem('candidates') || '[]')).find((c: any) => c.ic === formData.ic);
    if (existingCandidate) {
      alert("Maaf, Nombor Kad Pengenalan ini telah pun didaftarkan.");
      return;
    }

    setIsSubmitting(true);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
