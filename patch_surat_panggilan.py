import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# 1. Update font sizes: remove text-xs, text-[11px], replace with text-sm or text-base
content = content.replace('text-[11px]', 'text-sm')
content = content.replace('text-xs', 'text-sm')
content = content.replace('max-w-4xl', 'w-full max-w-5xl') # Make container wider for full page

# Let's rebuild the letter content section specifically to ensure accuracy to Image 5
new_content = """import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {
  const { settings } = useAppContext();
  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const tahunSesi = settings.sesiKemasukan?.substring(0, 4) || '2027';
  
  return (
    <div className="bg-white p-8 print:p-0 print:py-4 max-w-5xl mx-auto shadow-2xl printable-area text-black font-sans text-sm">
      {/* Header Surat */}
      <div className="flex items-start mb-6 print:mb-4 border-b-2 border-black pb-4">
        <div className="flex items-center gap-6 w-full">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Jata Negara" className="w-24 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-start">
            <div>
              <h1 className="font-bold text-lg mb-1">SMA KOTA GELANGGI 3</h1>
              <p className="leading-tight uppercase text-sm">
                KOTA GELANGGI 3<br/>
                27000 JERANTUT<br/>
                PAHANG DARUL MAKMUR
              </p>
            </div>
            <div className="text-sm leading-tight mt-6 print:mt-4">
              <p>Tel: 09-2051555</p>              
              <p>E-MEL: cft2001@moe.edu.my</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6 print:mb-4">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="pr-4">Rujukan Kami</td>
              <td>: SMAKG03.700-2/1/1( )</td>
            </tr>
            <tr>
              <td className="pr-4">Tarikh</td>
              <td>: {settings.tarikhSuratPanggilan || tarikhSemasa}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6 print:mb-4 uppercase text-sm">
        <p>{candidate.name}</p>
        <p>{candidate.ic},</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri}.</p>
      </div>

      <div className="mb-4 print:mb-2 text-sm">
        <p>Saudara / Saudari,</p>
      </div>

      <div className="mb-6 print:mb-4">
        <h2 className="font-bold uppercase underline text-sm">
          PANGGILAN TEMUDUGA PENGAMBILAN PELAJAR TINGKATAN 1 SESI {settings.sesiKemasukan || '2027'}
        </h2>
      </div>

      <div className="mb-4 print:mb-2 text-justify text-sm leading-relaxed">
        <p className="mb-6 print:mb-4">Perkara di atas adalah dirujuk.</p>
        
        <div className="mb-6 print:mb-4 text-justify flex">
          <span className="w-10 shrink-0">2.</span>
          <div>
            <span>Sukacitanya dimaklumkan bahawa saudara/saudari telah <strong>TERPILIH</strong> untuk ditemuduga bagi Pengambilan Pelajar Tingkatan 1 di SMA Kota Gelanggi 3 tahun {tahunSesi}. Sesi temuduga akan dilaksanakan pada ketetapan berikut:</span>
            
            <div className="ml-8 mt-4 mb-4">
              <table className="w-full text-sm">
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

            <div className="ml-8 mb-6">
                <table className="w-full text-sm border-collapse border border-black">
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

        <div className="mb-6 print:mb-4 text-justify flex">
          <span className="w-10 shrink-0">3.</span>
          <span>Sekiranya saudara/saudari tidak menghadiri sesi temuduga pada tarikh dan masa yang telah ditetapkan, secara automatik permohonan anda adalah <strong>TERBATAL</strong>.</span>
        </div>

        <div className="mb-6 print:mb-4 text-justify flex">
          <span className="w-10 shrink-0">4.</span>
          <span>Segala kerjasama yang diberikan amat kami hargai dan didahului dengan ucapan terima kasih.</span>
        </div>

        <p className="mb-6 print:mb-4">Sekian, terima kasih.</p>
      </div>

      <div className="mt-6 print:mt-4 text-sm">
        <p className="font-bold italic mb-4 print:mb-2">"MALAYSIA MADANI"</p>
        <p className="font-bold italic mb-6 print:mb-4">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-8 print:mb-6">Saya yang menjalankan amanah,</p>
        
        <div>
          {settings.tandatanganPengetua ? (
            <img src={settings.tandatanganPengetua} alt="Tandatangan Pengetua" className="h-16 object-contain mb-2" />
          ) : (
            <p className="mb-8 mt-12">.......................................................</p>
          )}
          <p className="font-bold uppercase">({settings.namaPengetua || 'JUITA BINTI HAMZAH'})</p>
          <p>Pengetua</p>
          {settings.namaPengetua ? null : <p>SMA Kota Gelanggi 3</p>}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
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
          
          .max-h-\\[90vh\\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          #printable-surat, #printable-surat * { visibility: visible !important; }
          #printable-surat {
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
"""

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(new_content)

