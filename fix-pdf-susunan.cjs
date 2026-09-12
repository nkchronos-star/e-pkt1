const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/BorangCetakPDF.tsx', 'utf8');

// 1. Rename existing sections
// A. Maklumat Calon -> A. Butiran Pemohon
code = code.replace('A. Maklumat Calon', 'A. Butiran Pemohon');

// B. Maklumat Akademik (PBD & UPKK) -> C. Maklumat Akademik
code = code.replace('B. Maklumat Akademik (PBD & UPKK)', 'C. Maklumat Akademik');

// C. Maklumat Ibu Bapa / Penjaga -> B. Maklumat Ibu Bapa / Penjaga
code = code.replace('C. Maklumat Ibu Bapa / Penjaga', 'B. Maklumat Ibu Bapa / Penjaga');

// 2. Add UPKK result to C. Maklumat Akademik
// Find the grid containing PBD and add UPKK next to it, or in a new row inside that section
const pbdSection = `<div>
                           <span className="block text-slate-500 font-bold mb-2">PBD (Pertengahan Darjah 6)</span>
                           <ul className="space-y-1">
                              <li>BM: <span className="font-bold">{candidate.pbdD6?.bm || '-'}</span></li>
                              <li>BI: <span className="font-bold">{candidate.pbdD6?.bi || '-'}</span></li>
                              <li>Math: <span className="font-bold">{candidate.pbdD6?.matematik || '-'}</span></li>
                              <li>Sains: <span className="font-bold">{candidate.pbdD6?.sains || '-'}</span></li>
                           </ul>
                        </div>`;

const pbdWithUpkk = pbdSection + `
                        <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
                           <span className="block text-slate-500 font-bold mb-2">Keputusan UPKK</span>
                           <span className="text-xl font-black text-slate-900">{candidate.upkk || '-'}</span>
                        </div>`;
code = code.replace(pbdSection, pbdWithUpkk);

// 3. Move B and C sections around to match requested order.
// Extract the B (Akademik) block
const akademikStart = code.indexOf('{/* AKADEMIK */}');
const akademikEnd = code.indexOf('</section>', akademikStart) + 10;
const akademikBlock = code.substring(akademikStart, akademikEnd);

// Remove Akademik block from its current position
code = code.slice(0, akademikStart) + code.slice(akademikEnd);

// Find where C (Keluarga) block is
const keluargaStart = code.indexOf('{/* KELUARGA */}');
const keluargaEnd = code.indexOf('</section>', keluargaStart) + 10;

// Insert Akademik block after Keluarga block
code = code.slice(0, keluargaEnd) + '\n\n' + akademikBlock + code.slice(keluargaEnd);

// 4. Add D. Pengesahan block at the very end (before the footer)
const pengesahanBlock = `
           {/* PENGESAHAN */}
           <section className="mt-8">
                <h3 className="bg-slate-100 p-2 font-bold text-slate-800 uppercase text-sm border-l-4 border-slate-800 mb-4">D. Pengesahan</h3>
                <div className="p-4 border-2 border-slate-200 rounded-lg text-sm text-slate-700 text-justify">
                    Saya mengesahkan bahawa segala maklumat yang diberikan di dalam borang ini adalah benar dan tepat. Saya memahami bahawa permohonan ini boleh dibatalkan sekiranya terdapat maklumat palsu.
                    <div className="mt-16 grid grid-cols-2 gap-8 text-center">
                        <div>
                            <div className="border-b-2 border-slate-400 w-48 mx-auto mb-2"></div>
                            <span className="block font-bold">Tandatangan Pemohon</span>
                            <span className="text-xs text-slate-500">Tarikh: .......................................</span>
                        </div>
                        <div>
                            <div className="border-b-2 border-slate-400 w-48 mx-auto mb-2"></div>
                            <span className="block font-bold">Tandatangan Ibu Bapa / Penjaga</span>
                            <span className="text-xs text-slate-500">Tarikh: .......................................</span>
                        </div>
                    </div>
                </div>
           </section>
`;

const footerStart = code.indexOf('<div className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500 text-center">');
code = code.slice(0, footerStart) + pengesahanBlock + '\n           ' + code.slice(footerStart);


fs.writeFileSync('src/components/dashboard/BorangCetakPDF.tsx', code);
