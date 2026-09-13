import React, { useEffect } from 'react';
import { Candidate } from '../../types';
import PrintTemplate from './PrintTemplate';

export default function BorangPukalCetakPDF({ candidates, onClose }: { candidates: Candidate[], onClose: () => void }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000); // give a bit more time for bulk images
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      
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

      <div id="printable-pukal-area" className="w-full bg-slate-100 print:bg-white py-8 print:py-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 print:block print:gap-0">
          {candidates.map((candidate, index) => (
            <div key={candidate.id} className="bg-white shadow-lg print:shadow-none break-after-page print:mb-0">
               <PrintTemplate candidate={candidate} />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          body * { visibility: hidden !important; }
          
          .fixed.inset-0 { 
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             padding: 0 !important;
             margin: 0 !important;
             background: transparent !important;
             overflow: visible !important;
             display: block !important;
          }
          
          #printable-pukal-area, #printable-pukal-area * { visibility: visible !important; }
          
          #printable-pukal-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            /* Transform for A4 fitting */
            transform: scale(0.90) !important;
            transform-origin: top left !important;
          }
          
          .break-after-page { 
              page-break-after: always !important; 
              break-after: page !important;
              display: block !important;
          }
          .break-after-page:last-child { 
              page-break-after: auto !important; 
              break-after: auto !important;
          }
          
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
