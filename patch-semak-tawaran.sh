#!/bin/bash
sed -i 's/import { Candidate } from '"'"'..\/..\/types'"'"';/import { Candidate } from '"'"'..\/..\/types'"'"';\nimport SuratTawaran from '"'"'.\/SuratTawaran'"'"';/' src/components/dashboard/SemakTawaran.tsx

sed -i 's/<span className="font-bold text-sm tracking-wide">CETAK \/ SIMPAN SURAT TAWARAN<\/span>/<span className="font-bold text-sm tracking-wide">CETAK \/ SIMPAN SURAT TAWARAN<\/span>\n                         <\/button>\n                      <\/div>\n                      <div className="mt-12">\n                         <div className="text-center mb-4 no-print text-sm font-bold text-slate-400 uppercase tracking-widest">Pratonton Surat<\/div>\n                         <SuratTawaran candidate={result} \/>\n                      <\/div>\n                    ) : (/g' src/components/dashboard/SemakTawaran.tsx

sed -i 's/<button className="mx-auto flex flex-col items-center justify-center gap-3/<button onClick={() => window.print()} className="mx-auto flex flex-col items-center justify-center gap-3 no-print/g' src/components/dashboard/SemakTawaran.tsx

