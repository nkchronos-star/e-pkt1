import React, { useEffect } from 'react';
import { Candidate } from '../../types';
import PrintTemplate from './PrintTemplate';

export default function BorangCetakPDF({ candidate, onClose }: { candidate: Candidate, onClose: () => void }) {
  
  useEffect(() => {
    // Small delay to ensure images load
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      
      {/* Action Bar (Not printed) */}
      <div className="sticky top-0 bg-slate-800 text-white p-4 flex justify-between items-center print:hidden shadow-md z-10">
        <h2 className="font-bold">Pratonton Cetakan</h2>
        <div className="flex gap-3">
           <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-bold text-sm">
             Cetak
           </button>
           <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded font-bold text-sm">
             Tutup
           </button>
        </div>
      </div>

      <div id="printable-area" className="max-w-4xl mx-auto py-8 print:py-0">
         <PrintTemplate candidate={candidate} />
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
          
          #printable-area, #printable-area * { visibility: visible !important; }
          
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }
          
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
