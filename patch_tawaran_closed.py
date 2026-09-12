import re

with open('src/components/dashboard/SemakTawaran.tsx', 'r') as f:
    content = f.read()

# Make sure Calendar is imported
if "Calendar" not in content[:300]:
    content = content.replace("import { Search, AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';", "import { Search, AlertCircle, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';")
    content = content.replace("import { Search, AlertCircle, Clock, CheckCircle } from 'lucide-react';", "import { Search, AlertCircle, Clock, CheckCircle, Calendar } from 'lucide-react';")
    content = content.replace("import { CheckCircle, Search, AlertCircle } from 'lucide-react';", "import { CheckCircle, Search, AlertCircle, Calendar } from 'lucide-react';")

old_block = """  if (!settings.tawaranBuka) {
    return (
      <div className="animate-in fade-in duration-500 py-20 px-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-6 shadow-inner">
          <Clock className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Semakan Belum Dibuka</h2>
        <p className="text-slate-500 text-lg">
          Semakan tawaran kemasukan akan dibuka pada <strong className="text-slate-800">{settings.tarikhBukaTawaran}</strong>.<br/>Sila kembali semula pada tarikh tersebut.
        </p>
      </div>
    );
  }"""

new_block = """  const formatTarikh = (tarikhStr: string) => {
     if(!tarikhStr) return '-';
     const d = new Date(tarikhStr);
     if(isNaN(d.getTime())) return tarikhStr;
     const day = String(d.getDate()).padStart(2, '0');
     const month = d.toLocaleDateString('ms-MY', { month: 'long' });
     const year = d.getFullYear();
     return `${day} - ${month} - ${year}`;
  };

  if (!settings.tawaranBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Semakan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Semakan tawaran kemasukan belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh semakan akan dibuka: <span className="font-semibold">{formatTarikh(settings.tarikhBukaTawaran)}</span>
          </div>
        </div>
      </div>
    );
  }"""

content = content.replace(old_block, new_block)

with open('src/components/dashboard/SemakTawaran.tsx', 'w') as f:
    f.write(content)
