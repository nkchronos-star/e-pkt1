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
          @page { size: A4 portrait; margin: 2.54cm 1cm 1cm 1cm; }
          
          /* Hide everything in the body by default */
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          body * { 
            visibility: hidden; 
          }
          
          /* Show only our printable areas */
          #printable-area, #printable-area *,
          #printable-pukal-area, #printable-pukal-area * { 
            visibility: visible; 
          }
          
          /* Position the printable area at the top left of the page */
          #printable-area, #printable-pukal-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
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
  );
}
