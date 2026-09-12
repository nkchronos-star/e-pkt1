const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetCheck = `  if (!firebaseUser) {
    return (
      <div className="animate-in fade-in duration-500 max-w-xl mx-auto mt-12">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Akses Borang Permohonan</h2>
            <p className="text-slate-600 mb-8">Sila log masuk menggunakan akaun Google anda untuk mula mengisi borang permohonan kemasukan ke tingkatan 1.</p>
            <button onClick={signInWithGoogle} className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
               <LogIn className="w-5 h-5" />
               Log Masuk Google
            </button>
         </div>
      </div>
    );
  }`;

code = code.replace(targetCheck, "");

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
