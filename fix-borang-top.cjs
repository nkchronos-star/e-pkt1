const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// The problematic string starts from:
//   const handleSaveDraft = async () => {\n      if (false) { // Skip the original check since we handled it\n    return (
// And ends at:
//     );\n  }\n\n  if (submitted) {

// We will replace this entire section correctly.

const regex = /const handleSaveDraft = async \(\) => \{\s*if \(false\) \{ \/\/ Skip the original check since we handled it\s*return \([\s\S]*?\);\s*\}/;

const fixedTop = `const handleSaveDraft = async () => {
    localStorage.setItem('borang_draft', JSON.stringify(formData));
    setIsSavingDraft(true);
    setTimeout(() => setIsSavingDraft(false), 1000);
  };

  if (!isBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Sistem permohonan belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh permohonan akan dibuka: <span className="font-semibold">{settings.tarikhBukaBorang}</span>
          </div>
        </div>
      </div>
    );
  }`;

code = code.replace(regex, fixedTop);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
