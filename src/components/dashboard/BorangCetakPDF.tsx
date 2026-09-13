import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';



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

  return createPortal(
    <div className="print-modal-wrapper fixed inset-0 z-50 bg-white overflow-y-auto print:static print:h-auto print:overflow-visible">
      
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
          @page { size: A4 portrait; margin: 2.54cm 1cm 1cm 1cm; }
          
          /* Hide the main app root */
          #root {
             display: none !important;
          }
          
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          
          /* The modal wrapper is directly in body now, make it static so it paginates! */
          .print-modal-wrapper {
             position: static !important;
             overflow: visible !important;
             height: auto !important;
          }
          
          .print\:hidden { display: none !important; }
          
          .break-after-page { 
             page-break-after: always; 
             break-after: page;
          }
          .break-after-page:last-child { 
             page-break-after: auto; 
             break-after: auto;
          }
        }
      `}} />
    </div>
  , document.body
);
}