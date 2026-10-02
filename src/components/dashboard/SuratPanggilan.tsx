import { useEffect } from 'react';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';
import { DEFAULT_TANDATANGAN_PENGETUA } from '../../lib/imageUtils';

export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {
  const { settings, candidates } = useAppContext();
  const sigPengetua = settings.tandatanganPengetua || DEFAULT_TANDATANGAN_PENGETUA;
  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const tahunSesi = settings.sesiKemasukan?.substring(0, 4) || '2027';

  // Pastikan tajuk dokumen kosong semasa mencetak supaya pelayar tidak mencetak teks header di atas kertas
  useEffect(() => {
    let originalTitle = document.title;
    const handleBeforePrint = () => {
      originalTitle = document.title;
      document.title = ' ';
    };
    const handleAfterPrint = () => {
      document.title = originalTitle || 'Sistem Permohonan SMAG3';
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Find candidate index based on LAYAK sorted by name
  const layakCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK').sort((a, b) => a.name.localeCompare(b.name));
  const candidateIndex = layakCandidates.findIndex(c => c.ic === candidate.ic);
  const rujukanNumber = candidateIndex !== -1 ? (candidateIndex + 1).toString().padStart(2, '0') : '01';
  
  return (
    <div id="printable-surat" className="bg-white p-8 print:p-0 max-w-5xl mx-auto shadow-2xl printable-area text-black font-sans text-[13px] print:text-[12px] print:leading-[1.45] print:max-w-none">
      {/* Kepala Surat (Letterhead) */}
      <div className="flex justify-between items-end mb-4 print:mb-3 border-b-2 border-slate-800 pb-3 print:pb-2 w-full">
        <div className="flex items-center gap-4">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo" className="w-[72px] print:w-[68px] h-auto object-contain" />
          <div className="text-slate-800">
            <h1 className="font-extrabold text-xl print:text-lg mb-0.5 tracking-wide text-slate-900">SMA KOTA GELANGGI 3</h1>
            <p className="leading-tight uppercase text-xs print:text-[11px] font-semibold text-slate-700">
              27000 JERANTUT<br/>
              PAHANG DARUL MAKMUR
            </p>
          </div>
        </div>
        <div className="text-xs print:text-[11px] leading-tight text-slate-600 text-right pb-1">
          <p className="font-medium">Tel: 09-2051555</p>              
          <p className="font-medium">E-Mel: <span className="text-slate-800 font-semibold">cft2001@moe.edu.my</span></p>
        </div>
      </div>

      {/* Rujukan & Tarikh */}
      <div className="flex justify-end mb-5 print:mb-4 text-black">
        <div className="text-[13px] print:text-[12px] leading-relaxed">
          <p><span className="inline-block w-28 print:w-24">Rujukan Kami</span>: SMAKG03.700-2/1/1({rujukanNumber})</p>
          <p><span className="inline-block w-28 print:w-24">Tarikh</span>: {settings.tarikhSuratPanggilan || tarikhSemasa}</p>
        </div>
      </div>

      {/* Alamat Penerima */}
      <div className="mb-5 print:mb-4 uppercase text-[13px] print:text-[12px] leading-snug">
        <p className="font-bold text-slate-950">{candidate.name}</p>
        <p>{candidate.ic},</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && candidate.alamat2 !== candidate.alamat1 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah}, {candidate.negeri}.</p>
      </div>

      {/* Panggilan Hormat */}
      <div className="mb-4 print:mb-3 text-[13px] print:text-[12px]">
        <p>Saudara / Saudari,</p>
      </div>

      {/* Tajuk Surat */}
      <div className="mb-4 print:mb-3">
        <h2 className="font-extrabold uppercase underline text-[13px] print:text-[12px] tracking-wide text-slate-950">
          PANGGILAN TEMUDUGA PENGAMBILAN PELAJAR TINGKATAN 1 SESI {settings.sesiKemasukan || '2027'}
        </h2>
      </div>

      {/* Kandungan Surat */}
      <div className="text-justify text-[13px] print:text-[12px] leading-relaxed print:leading-[1.45]">
        <p className="mb-4 print:mb-3">Perkara di atas adalah dirujuk.</p>
        
        <div className="mb-4 print:mb-3 text-justify flex">
          <span className="w-8 print:w-7 shrink-0 font-bold">2.</span>
          <div className="flex-1 min-w-0">
            <span>Sukacitanya dimaklumkan bahawa saudara/saudari telah <strong>TERPILIH</strong> untuk ditemuduga bagi Pengambilan Pelajar Tingkatan 1 di SMA Kota Gelanggi 3 tahun {tahunSesi}. Sesi temuduga akan dilaksanakan pada ketetapan berikut:</span>
            
            {/* Butiran Temuduga */}
            <div className="mt-3 print:mt-2 mb-4 print:mb-3">
              <table className="w-full text-[13px] print:text-[12px]">
                <tbody>
                  <tr>
                    <td className="py-1 print:py-0.5 w-36 print:w-32 font-medium">Tarikh</td>
                    <td className="py-1 print:py-0.5 font-bold">: {settings.tarikhTemuduga || '10 OKTOBER 2026'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 print:py-0.5 font-medium">Hari</td>
                    <td className="py-1 print:py-0.5 font-bold">: {settings.hariTemuduga || 'Sabtu'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 print:py-0.5 font-medium">Masa</td>
                    <td className="py-1 print:py-0.5 font-bold">: {settings.masaTemuduga || '8.30 pagi'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 print:py-0.5 font-medium">Tempat</td>
                    <td className="py-1 print:py-0.5 font-bold">: {settings.tempatTemuduga || 'Laman Selera SMA Kota Gelanggi 3'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 print:py-0.5 font-medium">Pakaian</td>
                    <td className="py-1 print:py-0.5 font-bold">: {settings.pakaianTemuduga || 'Uniform Sekolah'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 print:py-0.5 font-medium">Tentatif program</td>
                    <td className="py-1 print:py-0.5">:</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Jadual Tentatif */}
            <div className="mb-4 print:mb-3 w-full overflow-hidden">
                <table className="w-full text-[13px] print:text-[11.5px] border-collapse border border-black table-fixed">
                    <thead>
                        <tr className="bg-[#b8d4f0] print:bg-[#b8d4f0] text-black">
                            <th className="border border-black py-1.5 px-3 text-center font-bold w-1/3">MASA</th>
                            <th className="border border-black py-1.5 px-3 text-center font-bold">AKTIVITI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">8.30 pagi - 9.00 pagi</td>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">Pendaftaran</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">9.00 pagi - 9.30 pagi</td>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">Taklimat Temuduga</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">9.30 pagi - 12.30 tengah hari</td>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">Kuarantin sebelum ujian , Ujian Hafazan dan Ujian Akademik</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">12.30 tengah hari</td>
                            <td className="border border-black py-1.5 px-3 font-bold text-black">Tamat dan bersurai</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        <div className="mb-3 print:mb-2.5 text-justify flex">
          <span className="w-8 print:w-7 shrink-0 font-bold">3.</span>
          <span>Sekiranya saudara/saudari tidak menghadiri sesi temuduga pada tarikh dan masa yang telah ditetapkan, secara automatik permohonan anda adalah <strong>TERBATAL</strong>.</span>
        </div>

        <div className="mb-3 print:mb-2.5 text-justify flex">
          <span className="w-8 print:w-7 shrink-0 font-bold">4.</span>
          <span>Segala kerjasama yang diberikan amat kami hargai dan didahului dengan ucapan terima kasih.</span>
        </div>

        <p className="mb-4 print:mb-3">Sekian, terima kasih.</p>
      </div>

      {/* Cogan Kata & Tandatangan */}
      <div className="mt-4 print:mt-3 text-[13px] print:text-[12px] leading-snug">
        <p className="font-extrabold italic mb-1">"MALAYSIA MADANI"</p>
        <p className="font-extrabold italic mb-3 print:mb-2">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-2 font-medium">Saya yang menjalankan amanah,</p>
        
        <div className="w-64 max-w-[280px]">
          {sigPengetua ? (
            <div className="flex justify-center my-1">
              <img 
                src={sigPengetua} 
                alt="Tandatangan Pengetua" 
                className="h-24 print:h-20 w-auto max-w-[240px] object-contain select-none block" 
              />
            </div>
          ) : (
            <div className="h-20"></div>
          )}
          <p className="text-slate-800 tracking-widest text-[11px] select-none mb-1 text-center font-bold">........................................................</p>
          <p className="font-extrabold uppercase text-slate-950">({settings.namaPengetua || 'JUITA BINTI HAMZAH'})</p>
          <p className="text-slate-800 font-medium">Pengetua</p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 12mm 18mm 12mm 18mm; 
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
            font-size: 12px !important;
            line-height: 1.45 !important;
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
          }
        }
      `}} />
    </div>
  );
}
