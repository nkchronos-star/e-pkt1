import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function SuratTawaran({ candidate }: { candidate: Candidate }) {
  const { settings, candidates } = useAppContext();
  
  // Use the admin-defined date or current date
  const tarikhSemasa = settings.tarikhSuratTawaran || new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Get all successful candidates sorted by name to determine the offer sequence number
  const offeredCandidates = (candidates || [])
    .filter(c => c.statusTawaran === 'BERJAYA')
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  
  // Find index of current candidate and pad with zero (e.g. 01, 02)
  const candidateIndex = offeredCandidates.findIndex(c => c.ic === candidate.ic);
  const sequenceNumber = candidateIndex !== -1 ? candidateIndex + 1 : 1;
  const paddedSequence = sequenceNumber.toString().padStart(2, '0');
  
  const baseRujukan = settings.rujukanSuratTawaran || 'JPNP.SPI.800-1/1/4 Jld.2';
  // Strip any existing " (xx)" from the setting if user accidentally added it, then append the new sequence
  const rujukanSurat = `${baseRujukan.replace(/\s*\(\d+\)$/, '')} (${paddedSequence})`;

  return (
    <div 
      className="bg-white p-8 sm:p-12 print:p-0 w-full max-w-[210mm] mx-auto shadow-2xl printable-area text-black relative text-left"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Header Surat */}
      <div className="flex items-start gap-4 mb-4 border-b-[1.5px] border-[#0e4394] pb-3 w-full">
        <div className="w-[85px] flex-shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_arms_of_Malaysia.svg" referrerPolicy="no-referrer" alt="Jata Negara" className="w-full h-auto object-contain" />
        </div>
        <div className="flex-1 pt-1">
          <h1 className="font-bold text-[15px] mb-0 tracking-wide text-[#0e4394]">KEMENTERIAN PENDIDIKAN MALAYSIA</h1>
          <h2 className="mb-0 text-[13px] text-[#0e4394]">Jabatan Pendidikan Negeri Pahang</h2>
          <p className="leading-snug text-[13px] text-[#0e4394]">
            Bandar Indera Mahkota<br/>
            25604 Kuantan<br/>
            Pahang Darul Makmur
          </p>
        </div>
        <div className="w-[180px] text-[12px] leading-snug text-[#0e4394] mt-5">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-12">Tel</td>
                <td>: 09-5715700</td>
              </tr>
              <tr>
                <td>Faks</td>
                <td>: 09-5734857</td>
              </tr>
              <tr>
                <td>Laman Web</td>
                <td>: <em>jpnpahang.moe.gov.my</em></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mb-4 text-[14px]">
        <table>
          <tbody>
            <tr>
              <td className="pr-2">Ruj Kami</td>
              <td>: {rujukanSurat}</td>
            </tr>
            <tr>
              <td className="pr-2">Tarikh</td>
              <td>: {tarikhSemasa}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-5 font-bold uppercase text-[14px] leading-tight">
        <p>KEPADA :</p>
        <p className="mt-2">{candidate.name || '<<NAMA>>'}</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri}.</p>
        
        <p className="mt-2">NO.KP : {candidate.ic || '<<NO. KAD PENGENALAN>>'}</p>
      </div>

      <div className="mb-4 text-[14px]">
        <p>Tuan,</p>
      </div>

      <div className="mb-4 text-[14px]">
        <h2 className="font-bold uppercase">TAWARAN KE TINGKATAN SATU SEKOLAH AGAMA BANTUAN KERAJAAN (SABK) TAHUN {settings.sesiKemasukan?.substring(0, 4) || '2026'}</h2>
      </div>

      <div className="mb-4 text-justify text-[14px] leading-relaxed">
        <p className="mb-4">Tahniah dan sukacita dimaklumkan anda telah ditawarkan ke Tingkatan Satu Sekolah Agama Bantuan Kerajaan seperti berikut :</p>
        
        <div className="ml-10 mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 w-8 align-top">i.</td>
                <td className="py-1 w-48 font-bold">Sekolah ditempatkan</td>
                <td className="py-1 font-bold">: SMA KOTA GELANGGI 3</td>
              </tr>
              <tr>
                <td className="py-1 align-top">ii.</td>
                <td className="py-1 font-bold">Tarikh Lapor Diri</td>
                <td className="py-1 font-bold">: {settings.tarikhLaporDiri?.toUpperCase() || '11 JANUARI 2026 (AHAD)'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">iii.</td>
                <td className="py-1 font-bold">Masa Lapor diri</td>
                <td className="py-1 font-bold">: {settings.masaLaporDiri?.toUpperCase() || '8.30 PAGI'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">iv.</td>
                <td className="py-1 font-bold">Penempatan Asrama</td>
                <td className="py-1 font-bold">: Ditawarkan</td>
              </tr>
              <tr>
                <td className="py-1 align-top">v.</td>
                <td className="py-1 font-bold">Dokumen diperlukan</td>
                <td className="py-1 font-bold">: Rujuk Lampiran</td>
              </tr>
              <tr>
                <td className="py-1 align-top">vi.</td>
                <td className="py-1 font-bold">Aliran</td>
                <td className="py-1 font-bold">: Kurikulum Bersepadu Tahfiz (KBT)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-4 text-justify">
          2.<span className="ml-4 inline-block">Tawaran ini adalah <strong>MUKTAMAD</strong> dan <strong>TERBATAL</strong> sekiranya tidak melapor diri pada tarikh dan masa yang telah ditetapkan di atas melainkan pihak tuan dapat menghubungi pihak sekolah untuk memaklumkan kegagalan hadir pada tarikh tersebut. Pertukaran ke SABK yang lain <strong>TIDAK DIBENARKAN</strong>.</span>
        </p>

        <p className="mb-5 text-justify">
          3.<span className="ml-4 inline-block">Jabatan Pendidikan Negeri Pahang berhak menarik balik tawaran bila-bila masa sekiranya terdapat percanggahan maklumat dalam borang permohonan dengan dokumen asal.</span>
        </p>

        <p className="mb-5">Sekian, terima kasih.</p>
      </div>

      <div className="mt-5 text-[14px]">
        <p className="font-bold mb-4">"MALAYSIA MADANI"</p>
        <p className="font-bold mb-4">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-4">Saya yang menjalankan amanah,</p>
        
        <div className="mb-2">
          {settings.tandatanganPengarahTawaran ? (
            <img src={settings.tandatanganPengarahTawaran} alt="Tandatangan" className="h-16 w-auto object-contain ml-2" />
          ) : (
            <div className="h-16 w-24"></div>
          )}
        </div>

        <div>
          <p className="font-bold uppercase">{settings.namaPengarahTawaran || 'YAHAYA BIN TAHIR'}</p>
          <p>{settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan'}</p>
          <p>{settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam'}</p>
          <p>{settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang'}</p>
        </div>

        <div className="mt-5">
          <p>s.k.</p>
          <p>Pengetua</p>
          <p>SABK</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 10mm 15mm; }
          
          body { 
            -webkit-print-color-adjust: exact; 
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Hide everything outside the printable area using standard display none 
             to prevent empty space from taking up the layout */
          .no-print {
            display: none !important;
          }

          /* Ensure the printable area has no constraints */
          .printable-area { 
             position: static !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             width: 100% !important;
             max-width: 100% !important;
          }
          
          /* Reset any layout wrappers that might cause spacing */
          #root, main, .bg-\\[\\#f4f7ee\\] {
             background: white !important;
             padding: 0 !important;
             margin: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
