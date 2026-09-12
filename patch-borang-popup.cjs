const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Import X from lucide-react if needed, or just use what we have. Let's add X if not present.
if (!code.includes('X,')) {
    code = code.replace('CheckCircle } from', 'CheckCircle, X } from');
}

// 2. Add state for popup
const targetState = `  const [isSubmitting, setIsSubmitting] = useState(false);`;
const replacementState = `  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });`;

if (code.includes(targetState) && !code.includes('setPopup')) {
    code = code.replace(targetState, replacementState);
}

// 3. Replace alert in handleFileChange
const targetFileAlert = `if (file.size > maxSize) {
        alert("Saiz fail melebihi 2MB. Sila muat naik fail atau gambar yang lebih kecil untuk mengelakkan masalah sistem.");
        return;
      }`;
const replacementFileAlert = `if (file.size > maxSize) {
        setPopup({
          show: true,
          title: 'Saiz Fail Terlalu Besar',
          message: 'Saiz fail atau gambar melebihi had maksimum 2MB. Sila kecilkan saiz gambar anda sebelum memuat naik (contohnya dengan menangkap layar / screenshot gambar tersebut).'
        });
        // Reset the file input so it doesn't hold the large file
        e.target.value = '';
        return;
      }`;
if (code.includes('alert("Saiz fail melebihi 2MB')) {
    code = code.replace(targetFileAlert, replacementFileAlert);
}

// 4. Inject Popup JSX at the end of Borang render, right before the last closing </div> of the main return
// Let's find the end of the return statement.
// Since it's a bit hard to find the exact end, we can prepend it to the very first div in the return if isBuka is true.
const targetRender = `<div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-8 duration-500">`;
const replacementRender = `
      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setPopup({ ...popup, show: false })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{popup.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{popup.message}</p>
            <button onClick={() => setPopup({ ...popup, show: false })} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors">
              Faham
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-8 duration-500">`;

if (code.includes(targetRender) && !code.includes('Popup Modal')) {
    code = code.replace(targetRender, replacementRender);
}

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx with popup");
