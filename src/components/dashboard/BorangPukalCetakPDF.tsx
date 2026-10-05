import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Candidate } from '../../types';
import PrintTemplate from './PrintTemplate';
import { Printer } from 'lucide-react';

export default function BorangPukalCetakPDF({ candidates, onClose, titlePrefix }: { candidates: Candidate[], onClose: () => void, titlePrefix?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible print:block printable-area">
      {/* Action Bar (Not printed) */}
      <div className="sticky top-0 bg-slate-900 text-white p-4 flex flex-wrap justify-between items-center print:hidden shadow-lg z-10 gap-3 border-b border-slate-700">
        <div>
          <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
            Pratonton PDF Borang Permohonan ({candidates.length} Calon {titlePrefix ? `- ${titlePrefix}` : ''})
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            💡 Untuk memuat turun fail PDF: Pilih <strong className="text-emerald-400">"Destination / Destinasi: Save as PDF"</strong> dalam tetingkap cetakan browser.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow flex items-center gap-2 transition">
             <Printer className="w-4 h-4" /> Simpan / Cetak PDF ({candidates.length})
           </button>
           <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl font-bold text-sm transition">
             Tutup
           </button>
        </div>
      </div>

      <div className="w-full py-8 print:py-0 print:block">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 print:block print:gap-0">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white shadow-lg print:shadow-none break-after-page print:mb-0">
               <PrintTemplate candidate={candidate} />
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          .break-after-page {
              page-break-after: always !important;
              break-after: page !important;
          }
          .break-after-page:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
          }
        }
      `}} />
    </div>,
    document.body
  );
}
