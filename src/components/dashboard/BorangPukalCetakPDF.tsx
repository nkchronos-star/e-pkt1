import React, { useEffect } from 'react';
import { Candidate } from '../../types';
import PrintTemplate from './PrintTemplate';

export default function BorangPukalCetakPDF({ candidates, onClose }: { candidates: Candidate[], onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen w-full">
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

      <div className="w-full bg-slate-100 print:bg-white py-8 print:py-0">
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
