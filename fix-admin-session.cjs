const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// 1. Fix setSettings to updateSettings
code = code.replace(/setSettings\(prev => \(\{ \.\.\.prev, tandatanganPengetua: base64String \}\)\);/g, 'updateSettings({ tandatanganPengetua: base64String });');

// 2. Fix the layout of Maklumat Pengetua
const badLayoutStart = `<div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">`;
code = code.replace(badLayoutStart, `</div>
             </div>
             
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileSignature className="w-6 h-6 text-slate-500" /> Maklumat Pengetua (Untuk Surat)</h3>
                <div className="mt-4">`);

const badLayoutEnd = `                  </div>
<button onClick={syncSettingsToServer}`;
code = code.replace(badLayoutEnd, `                  </div>
             </div>
             
             <div className="flex justify-end pt-4 mt-6">
<button onClick={syncSettingsToServer}`);

// 3. Add BorangCetakPDF logic
code = code.replace(
    "import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon } from 'lucide-react';", 
    "import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon, FileText } from 'lucide-react';\nimport { BorangCetakPDF } from './BorangCetakPDF';"
);

// We need to add state for printCandidate
if(!code.includes("printCandidate")) {
    code = code.replace("function PentadbirView() {", "function PentadbirView() {\n  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);");
}

// Add the button and component in PentadbirView
// In the table mapping inside PentadbirView
const actionsBlock = `<button onClick={() => setTawaran(c.ic, true)} className="bg-emerald-100 text-emerald-700 p-2 rounded hover:bg-emerald-200" title="Terima"><CheckSquare className="w-4 h-4" /></button>
                                       <button onClick={() => setTawaran(c.ic, false)} className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200" title="Tolak"><XCircle className="w-4 h-4" /></button>`;

if(code.includes(actionsBlock) && !code.includes("FileText")) {
    code = code.replace(actionsBlock, actionsBlock + `\n                                       <button onClick={() => setPrintCandidate(c)} className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200" title="Cetak Borang"><FileText className="w-4 h-4" /></button>`);
}

if(!code.includes("<BorangCetakPDF")) {
    code = code.replace("{activeTab === 'MARKAH' && (", "{printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}\n\n       {activeTab === 'MARKAH' && (");
}

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
