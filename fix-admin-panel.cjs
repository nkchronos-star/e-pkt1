const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

if (!code.includes('BorangCetakPDF')) {
  // Add import
  code = code.replace("import { Trash2 } from 'lucide-react';", "import { Trash2, FileText } from 'lucide-react';\nimport { BorangCetakPDF } from './BorangCetakPDF';");
  
  // Add state to SuperAdminView
  code = code.replace(
    "const [activeTab, setActiveTab] = useState<'KAWALAN' | 'KRITERIA' | 'PENGGUNA' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');",
    "const [activeTab, setActiveTab] = useState<'KAWALAN' | 'KRITERIA' | 'PENGGUNA' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');\n  const [printCandidate, setPrintCandidate] = useState<any>(null);"
  );

  // Add the button
  const buttonHtml = `
                                        <button onClick={()=>setPrintCandidate(c)} className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded font-bold border border-blue-200">Borang</button>
                                        <button onClick={()=>setKelayakan(c.ic, true)} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-200 px-2 py-1 rounded font-bold border border-emerald-200">Set Layak</button>`;
                                        
  code = code.replace(
    '<button onClick={()=>setKelayakan(c.ic, true)} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-200 px-2 py-1 rounded font-bold border border-emerald-200">Set Layak</button>',
    buttonHtml
  );

  // Add the modal component at the end of SuperAdminView
  code = code.replace(
    '       {activeTab === \'MARKAH\' && (',
    `       {printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}\n\n       {activeTab === 'MARKAH' && (`
  );
  
  fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
}
