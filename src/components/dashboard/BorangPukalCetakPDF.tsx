import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Candidate } from '../../types';
import PrintTemplate from './PrintTemplate';

export default function BorangPukalCetakPDF({ candidates, onClose }: { candidates: Candidate[], onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible print:block">
      {/* Action Bar (Not printed) */}
      <div className="sticky top-0 bg-slate-800 text-white p-4 flex justify-between items-center print:hidden shadow-md z-10">
        <h2 className="font-bold">Pratonton Cetakan Pukal ({candidates.length} Calon)</h2>
        <div className="flex gap-3">
           <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-bold text-sm">
             Cetak Semua
           </button>
           <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded font-bold text-sm">
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
          #root { display: none !important; }
          body, html { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            height: auto !important; 
            min-height: auto !important;
            overflow: visible !important; 
            position: static !important;
          }
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
