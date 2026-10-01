import { Candidate } from '../../types';
import { useAppContext } from '../../store';
import { DEFAULT_TANDATANGAN_PENGETUA } from '../../lib/imageUtils';

export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {
  const { settings, candidates } = useAppContext();
  const sigPengetua = settings.tandatanganPengetua || DEFAULT_TANDATANGAN_PENGETUA;
  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const tahunSesi = settings.sesiKemasukan?.substring(0, 4) || '2027';

  // Find candidate index based on LAYAK sorted by name
  const layakCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK').sort((a, b) => a.name.localeCompare(b.name));
  const candidateIndex = layakCandidates.findIndex(c => c.ic === candidate.ic);
  const rujukanNumber = candidateIndex !== -1 ? (candidateIndex + 1).toString().padStart(2, '0') : '01';
  
  return (
    <div id="printable-surat" className="bg-white p-8 print:p-0 max-w-5xl mx-auto shadow-2xl printable-area text-black font-sans text-[13px] print:text-[11.5px] print:leading-[1.3] print:max-w-none">
      {/* Header Surat */}
      <div className="flex justify-between items-end mb-2 print:mb-1.5 border-b-2 border-gray-400 pb-2 print:pb-1 w-full">
        <div className="flex items-center gap-3">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo" className="w-[72px] print:w-[58px] h-auto object-contain" />
          <div className="text-slate-500">
            <h1 className="font-bold text-lg print:text-base mb-0.5 tracking-wide text-slate-600">SMA KOTA GELANGGI 3</h1>
            <p className="leading-tight uppercase text-xs print:text-[10px]">
              27000 JERANTUT<br/>
              PAHANG DARUL MAKMUR
            </p>
          </div>
        </div>
        <div className="text-[11px] print:text-[10px] leading-tight text-slate-500 text-right pb-0.5">
          <p>Tel: 09-2051555</p>              
          <p>E-MEL: <a href="mailto:cft2001@moe.edu.my" className="text-blue-500 underline">cft2001@moe.edu.my</a></p>
        </div>
      </div>

      <div className="flex justify-end mb-4 print:mb-1 text-black">
        <div className="text-[13px] print:text-[11.5px]">
          <p className="mb-0.5"><span className="inline-block w-24 print:w-20">Rujukan Kami</span>: SMAKG03.700-2/1/1({rujukanNumber})</p>
          <p><span className="inline-block w-24 print:w-20">Tarikh</span>: {settings.tarikhSuratPanggilan || tarikhSemasa}</p>
        </div>
      </div>

      <div className="mb-4 print:mb-1 uppercase text-[13px] print:text-[11.5px] print:leading-tight">
        <p className="font-bold">{candidate.name}</p>
        <p>{candidate.ic},</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && candidate.alamat2 !== candidate.alamat1 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah}, {candidate.negeri}.</p>
      </div>

      <div className="mb-3 print:mb-1 text-[13px] print:text-[11.5px]">
        <p>Saudara / Saudari,</p>
      </div>

      <div className="mb-4 print:mb-1">
        <h2 className="font-bold uppercase underline text-[13px] print:text-[11.5px]">
          PANGGILAN TEMUDUGA PENGAMBILAN PELAJAR TINGKATAN 1 SESI {settings.sesiKemasukan || '2027'}
        </h2>
      </div>

      <div className="mb-3 print:mb-1 text-justify text-[13px] print:text-[11.5px] leading-relaxed print:leading-snug">
        <p className="mb-3 print:mb-1">Perkara di atas adalah dirujuk.</p>
        
        <div className="mb-3 print:mb-1 text-justify flex">
          <span className="w-8 print:w-6 shrink-0 font-bold">2.</span>
          <div>
            <span>Sukacitanya dimaklumkan bahawa saudara/saudari telah <strong>TERPILIH</strong> untuk ditemuduga bagi Pengambilan Pelajar Tingkatan 1 di SMA Kota Gelanggi 3 tahun {tahunSesi}. Sesi temuduga akan dilaksanakan pada ketetapan berikut:</span>
            
            <div className="ml-6 print:ml-4 mt-2 print:mt-1 mb-3 print:mb-1">
              <table className="w-full text-[13px] print:text-[11.5px]">
                <tbody>
                  <tr>
                    <td className="py-0.5 w-32 print:w-28">Tarikh</td>
                    <td className="py-0.5 font-bold">: {settings.tarikhTemuduga || '10 OKTOBER 2026'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Hari</td>
                    <td className="py-0.5 font-bold">: {settings.hariTemuduga || 'Sabtu'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Masa</td>
                    <td className="py-0.5 font-bold">: {settings.masaTemuduga || '8.00 pagi'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Tempat</td>
                    <td className="py-0.5 font-bold">: {settings.tempatTemuduga || 'Laman Selera SMA Kota Gelanggi 3'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Pakaian</td>
                    <td className="py-0.5 font-bold">: {settings.pakaianTemuduga || 'Uniform Sekolah'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Tentatif program</td>
                    <td className="py-0.5">:</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ml-6 print:ml-4 mb-3 print:mb-1">
                <table className="w-full text-[13px] print:text-[11px] border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="border border-black py-0.5 px-2 text-center bg-gray-100 font-bold w-1/3">MASA</th>
                            <th className="border border-black py-0.5 px-2 text-center bg-gray-100 font-bold">AKTIVITI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black py-0.5 px-2">8.00 pagi - 9.00 pagi</td>
                            <td className="border border-black py-0.5 px-2">Pendaftaran</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-0.5 px-2">9.00 pagi - 9.30 pagi</td>
                            <td className="border border-black py-0.5 px-2">Taklimat oleh Ustaz Marzuki bin Hassan</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-0.5 px-2">9.30 pagi - 12.30 tengah hari</td>
                            <td className="border border-black py-0.5 px-2">Kuarantin sebelum ujian, Ujian Hafazan dan Ujian Akademik</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-0.5 px-2">12.30 tengah hari - 1.00 petang</td>
                            <td className="border border-black py-0.5 px-2">Tamat dan bersurai</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        <div className="mb-2 print:mb-0.5 text-justify flex">
          <span className="w-8 print:w-6 shrink-0 font-bold">3.</span>
          <span>Sekiranya saudara/saudari tidak menghadiri sesi temuduga pada tarikh dan masa yang telah ditetapkan, secara automatik permohonan anda adalah <strong>TERBATAL</strong>.</span>
        </div>

        <div className="mb-2 print:mb-0.5 text-justify flex">
          <span className="w-8 print:w-6 shrink-0 font-bold">4.</span>
          <span>Segala kerjasama yang diberikan amat kami hargai dan didahului dengan ucapan terima kasih.</span>
        </div>

        <p className="mb-2 print:mb-0.5">Sekian, terima kasih.</p>
      </div>

      <div className="mt-3 print:mt-1 text-[13px] print:text-[11.5px] leading-tight">
        <p className="font-bold italic mb-1 print:mb-0.5">"MALAYSIA MADANI"</p>
        <p className="font-bold italic mb-2 print:mb-0.5">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-2 print:mb-0.5">Saya yang menjalankan amanah,</p>
        
        <div className="leading-tight">
          {sigPengetua ? (
            <img src={sigPengetua} alt="Tandatangan Pengetua" className="h-16 print:h-12 max-w-[160px] object-contain mb-1 select-none block" />
          ) : (
            <p className="mb-4 print:mb-1 mt-6 print:mt-2">.......................................................</p>
          )}
          <p className="font-bold uppercase mt-1 print:mt-0.5">({settings.namaPengetua || 'HAJAH JUITA BINTI HAMZAH'})</p>
          <p>Pengetua</p>
          <p>SMA Kota Gelanggi 3</p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 6mm 10mm 4mm 10mm; 
          }

          /* Buang terus elemen antaramuka skrin daripada aliran dokumen */
          header, nav, footer, .no-print, [class*="no-print"], [class*="print:hidden"] {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            font-size: 11.5px !important;
            line-height: 1.3 !important;
          }
          
          body * { 
            visibility: hidden !important; 
          }
          
          /* Hanya paparkan kandungan surat panggilan */
          #printable-surat, #printable-surat * { 
            visibility: visible !important; 
          }
          
          #printable-surat {
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important;
            padding: 0 !important; 
            margin: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            transform: scale(0.94);
            transform-origin: top center;
          }
        }
      `}} />
    </div>
  );
}
