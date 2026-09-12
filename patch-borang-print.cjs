const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetWrapper = `<div className="animate-in fade-in py-10 px-4 max-w-4xl mx-auto print:py-0 print:px-0">`;
const replacementWrapper = `<div className="animate-in fade-in py-10 px-4 max-w-4xl mx-auto print:py-0 print:px-0 printable-area">`;

if (code.includes(targetWrapper)) {
    code = code.replace(targetWrapper, replacementWrapper);
}

const targetButtons = `<div className="flex justify-center gap-4">
              <button 
                onClick={() => window.print()}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-bold flex items-center gap-2"
              >
                Cetak Borang / Simpan PDF
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-bold"
              >
                Kembali
              </button>
            </div>`;

const replacementButtons = `<div className="flex flex-col items-center gap-3">
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => {
                    window.print();
                    // Fallback for sandboxed iframes where print might be blocked silently
                    setTimeout(() => {
                      if (document.visibilityState === 'visible') {
                        // Just a small UX improvement, not a perfect check
                      }
                    }, 1000);
                  }}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-bold flex items-center gap-2"
                >
                  Cetak Borang / Simpan PDF
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-bold"
                >
                  Kembali
                </button>
              </div>
              <p className="text-xs text-amber-600 font-medium max-w-sm mt-2">
                *Nota: Jika butang tidak bertindak balas (disebabkan sekatan pelayar web pratonton), sila klik kanan dan pilih "Print" atau buka aplikasi di Tetingkap Baru (New Tab) / tekan Ctrl+P.
              </p>
            </div>`;

if (code.includes('onClick={() => window.print()}')) {
    code = code.replace(targetButtons, replacementButtons);
}

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx print");
