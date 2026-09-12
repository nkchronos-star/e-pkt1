#!/bin/bash
sed -i '/<span className="font-bold text-sm tracking-wide">CETAK \/ SIMPAN SURAT TAWARAN<\/span>/,+8c\
                           <span className="font-bold text-sm tracking-wide">CETAK / SIMPAN SURAT TAWARAN</span>\
                         </button>\
                      </div>\
                      <div className="mt-12">\
                         <div className="text-center mb-4 no-print text-sm font-bold text-slate-400 uppercase tracking-widest">Pratonton Surat</div>\
                         <SuratTawaran candidate={result} />\
                      </div>\
                    ) : (\
                      <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 shadow-inner">\
                         <h3 className="font-extrabold text-xl text-red-900 mb-2">Anda Telah Menolak Tawaran Ini</h3>\
' src/components/dashboard/SemakTawaran.tsx
