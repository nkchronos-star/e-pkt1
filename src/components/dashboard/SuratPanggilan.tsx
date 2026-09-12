import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {
  const { settings, candidates } = useAppContext();
  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const tahunSesi = settings.sesiKemasukan?.substring(0, 4) || '2027';

  // Find candidate index based on LAYAK sorted by name
  const layakCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK').sort((a, b) => a.name.localeCompare(b.name));
  const candidateIndex = layakCandidates.findIndex(c => c.ic === candidate.ic);
  const rujukanNumber = candidateIndex !== -1 ? (candidateIndex + 1).toString().padStart(2, '0') : '00';
  
  return (
    <div id="printable-surat" className="bg-white p-8 print:p-0 print:py-2 max-w-5xl mx-auto shadow-2xl printable-area text-black font-sans text-[13px]">
      {/* Header Surat */}
      <div className="flex justify-between items-end mb-2 print:mb-1 border-b-2 border-gray-400 pb-3 w-full">
        <div className="flex items-center gap-4">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo" className="w-[72px] h-auto object-contain" />
          <div className="text-slate-500">
            <h1 className="font-bold text-lg mb-0.5 tracking-wide text-slate-600">SMA KOTA GELANGGI 3</h1>
            <p className="leading-tight uppercase text-xs">
              27000 JERANTUT<br/>
              PAHANG DARUL MAKMUR
            </p>
          </div>
        </div>
        <div className="text-[11px] leading-tight text-slate-500 text-right pb-1">
          <p>Tel: 09-2051555</p>              
          <p>E-MEL: <a href="mailto:cft2001@moe.edu.my" className="text-blue-500 underline">cft2001@moe.edu.my</a></p>
        </div>
      </div>

      <div className="flex justify-end mb-6 print:mb-2 text-black">
        <div className="text-[13px]">
          <p className="mb-0.5"><span className="inline-block w-24">Rujukan Kami</span>: SMAKG03.700-2/1/1({rujukanNumber})</p>
          <p><span className="inline-block w-24">Tarikh</span>: {settings.tarikhSuratPanggilan || tarikhSemasa}</p>
        </div>
      </div>

      <div className="mb-6 print:mb-1 uppercase text-[13px]">
        <p>{candidate.name}</p>
        <p>{candidate.ic},</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri}.</p>
      </div>

      <div className="mb-4 print:mb-1 text-[13px]">
        <p>Saudara / Saudari,</p>
      </div>

      <div className="mb-6 print:mb-1">
        <h2 className="font-bold uppercase underline text-[13px]">
          PANGGILAN TEMUDUGA PENGAMBILAN PELAJAR TINGKATAN 1 SESI {settings.sesiKemasukan || '2027'}
        </h2>
      </div>

      <div className="mb-4 print:mb-1 text-justify text-[13px] leading-relaxed">
        <p className="mb-6 print:mb-1">Perkara di atas adalah dirujuk.</p>
        
        <div className="mb-6 print:mb-1 text-justify flex">
          <span className="w-10 shrink-0">2.</span>
          <div>
            <span>Sukacitanya dimaklumkan bahawa saudara/saudari telah <strong>TERPILIH</strong> untuk ditemuduga bagi Pengambilan Pelajar Tingkatan 1 di SMA Kota Gelanggi 3 tahun {tahunSesi}. Sesi temuduga akan dilaksanakan pada ketetapan berikut:</span>
            
            <div className="ml-8 mt-4 print:mt-2 mb-4 print:mb-2">
              <table className="w-full text-[13px]">
                <tbody>
                  <tr>
                    <td className="py-1 w-32">Tarikh</td>
                    <td className="py-1 font-bold">: {settings.tarikhTemuduga || '10 OKTOBER 2026'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Hari</td>
                    <td className="py-1 font-bold">: {settings.hariTemuduga || 'Sabtu'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Masa</td>
                    <td className="py-1 font-bold">: {settings.masaTemuduga || '8.00 pagi'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tempat</td>
                    <td className="py-1 font-bold">: {settings.tempatTemuduga || 'Laman Selera SMA Kota Gelanggi 3'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Pakaian</td>
                    <td className="py-1 font-bold">: {settings.pakaianTemuduga || 'Uniform Sekolah'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tentatif program</td>
                    <td className="py-1">:</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ml-8 mb-6 print:mb-2">
                <table className="w-full text-[13px] border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="border border-black py-1 px-2 text-center bg-gray-100 font-bold w-1/3">MASA</th>
                            <th className="border border-black py-1 px-2 text-center bg-gray-100 font-bold">AKTIVITI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black py-1 px-2">8.00 pagi - 9.00 pagi</td>
                            <td className="border border-black py-1 px-2">Pendaftaran</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1 px-2">9.00 pagi - 9.30 pagi</td>
                            <td className="border border-black py-1 px-2">Taklimat oleh Ustaz Marzuki bin Hassan</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1 px-2">9.30 pagi - 12.30 tengah hari</td>
                            <td className="border border-black py-1 px-2">Kuarantin sebelum ujian, Ujian Hafazan dan Ujian Akademik</td>
                        </tr>
                        <tr>
                            <td className="border border-black py-1 px-2">12.30 tengah hari - 1.00 petang</td>
                            <td className="border border-black py-1 px-2">Tamat dan bersurai</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        <div className="mb-6 print:mb-1 text-justify flex">
          <span className="w-10 shrink-0">3.</span>
          <span>Sekiranya saudara/saudari tidak menghadiri sesi temuduga pada tarikh dan masa yang telah ditetapkan, secara automatik permohonan anda adalah <strong>TERBATAL</strong>.</span>
        </div>

        <div className="mb-6 print:mb-1 text-justify flex">
          <span className="w-10 shrink-0">4.</span>
          <span>Segala kerjasama yang diberikan amat kami hargai dan didahului dengan ucapan terima kasih.</span>
        </div>

        <p className="mb-6 print:mb-1">Sekian, terima kasih.</p>
      </div>

      <div className="mt-6 print:mt-1 text-[13px]">
        <p className="font-bold italic mb-4 print:mb-1">"MALAYSIA MADANI"</p>
        <p className="font-bold italic mb-6 print:mb-1">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-6 print:mb-2">Saya yang menjalankan amanah,</p>
        
        <div>
          {settings.tandatanganPengetua ? (
            <img src={settings.tandatanganPengetua} alt="Tandatangan Pengetua" className="h-16 object-contain mb-2" />
          ) : (
            <p className="mb-6 print:mb-2 mt-8 print:mt-6">.......................................................</p>
          )}
          <p className="font-bold uppercase">({settings.namaPengetua || 'JUITA BINTI HAMZAH'})</p>
          <p>Pengetua</p>
          {settings.namaPengetua ? null : <p>SMA Kota Gelanggi 3</p>}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.8cm; }
          body * { visibility: hidden !important; }
          
          /* Keep modal wrappers open and unrestrained for print */
          .fixed.inset-0 { 
             position: absolute !important; 
             left: 0 !important;
             top: 0 !important;
             overflow: visible !important;
             background: transparent !important;
             height: auto !important;
             min-height: 100% !important;
             display: block !important;
             padding: 0 !important;
          }
          
          .max-h-\[90vh\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          #printable-surat, #printable-surat * { visibility: visible !important; }
          #printable-surat {
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.94);
            transform-origin: top center;
          }
        }
      `}} />
    </div>
  );
}
