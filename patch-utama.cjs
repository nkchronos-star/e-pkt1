const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

const targetStr = `import { CheckCircle } from 'lucide-react';

interface UtamaProps {`;

const replaceStr = `import { CheckCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../store';

interface UtamaProps {`;

code = code.replace(targetStr, replaceStr);

const targetStr2 = `export default function Utama({ onNavigate }: UtamaProps) {
  return (`;

const replaceStr2 = `export default function Utama({ onNavigate }: UtamaProps) {
  const { settings } = useAppContext();
  return (`;

code = code.replace(targetStr2, replaceStr2);

const targetStr3 = `      <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Mata Pelajaran Ditawarkan</h2>`;
const replaceStr3 = `      {settings.utamaPanduanLink && (
         <div className="flex justify-end mt-4 mb-8">
            <a href={settings.utamaPanduanLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200 transition-colors">
               <ExternalLink className="w-4 h-4" />
               Edit Maklumat Utama & Panduan (Admin)
            </a>
         </div>
      )}
      <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Mata Pelajaran Ditawarkan</h2>`;

code = code.replace(targetStr3, replaceStr3);

fs.writeFileSync('src/components/dashboard/Utama.tsx', code);
console.log("Patched Utama.tsx");
