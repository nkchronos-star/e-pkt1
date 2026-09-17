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
      className="bg-white p-8 sm:p-12 print:p-0 w-[210mm] min-h-[297mm] mx-auto shadow-2xl printable-area text-black relative"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Header Surat */}
      <div className="flex items-start mb-6 border-b-[1.5px] border-[#0e4394] pb-2">
        <div className="flex items-center gap-6 w-full">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Pahang.svg/400px-Coat_of_arms_of_Pahang.svg.png" alt="Jata Negara" className="w-[100px] h-auto object-contain " />
          <div className="flex-1 flex justify-between items-start pt-2">
            <div className="text-[#0e4394]">
              <h1 className="font-bold text-[16px] mb-0 tracking-wide">KEMENTERIAN PENDIDIKAN MALAYSIA</h1>
              <h2 className="mb-0 text-[14px]">Jabatan Pendidikan Negeri Pahang</h2>
              <p className="leading-snug text-[14px]">
                Bandar Indera Mahkota<br/>
                25604 Kuantan<br/>
                Pahang Darul Makmur
              </p>
            </div>
            <div className="text-[#0e4394] text-[13px] leading-snug mt-6">
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4">Tel</td>
                    <td>: 09-5715700</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Faks</td>
                    <td>: 09-5734857</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Laman Web</td>
                    <td>: <em>jpnpahang.moe.gov.my</em></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-10 text-[14px]">
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

      <div className="mb-8 font-bold uppercase text-[14px] leading-tight">
        <p>KEPADA :</p>
        <p className="mt-4">{candidate.name}</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri} .</p>
        
        <p className="mt-6">NO.KP : {candidate.ic}</p>
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

        <p className="mb-8 text-justify">
          3.<span className="ml-4 inline-block">Jabatan Pendidikan Negeri Pahang berhak menarik balik tawaran bila-bila masa sekiranya terdapat percanggahan maklumat dalam borang permohonan dengan dokumen asal.</span>
        </p>

        <p className="mb-8">Sekian, terima kasih.</p>
      </div>

      <div className="mt-8 text-[14px]">
        <p className="font-bold mb-4">"MALAYSIA MADANI"</p>
        <p className="font-bold mb-6">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-4">Saya yang menjalankan amanah,</p>
        
        <div className="mb-2">
          {/* Mock Signature matching the image somewhat */}
          <svg className="w-24 h-16 ml-2" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 40,80 C 20,40 60,10 70,30 C 80,50 60,90 50,80 C 40,70 60,40 80,40 C 100,40 120,60 110,80 C 100,100 80,80 90,60 C 100,40 130,30 140,50 C 150,70 130,90 120,80 C 110,70 130,40 150,40 C 170,40 180,60 170,80 M 30,60 L 180,60 M 60,20 L 70,90 M 110,20 L 120,90" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div>
          <p className="font-bold uppercase">{settings.namaPengarahTawaran || 'YAHAYA BIN TAHIR'}</p>
          <p>{settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan'}</p>
          <p>{settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam'}</p>
          <p>{settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang'}</p>
        </div>

        <div className="mt-8">
          <p>s.k.</p>
          <p>Pengetua</p>
          <p>SABK</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .printable-area { 
             margin: 0 !important; 
             padding: 0 !important;
             box-shadow: none !important;
             transform: none !important;
             width: 100% !important;
             min-height: 100vh !important;
             page-break-after: avoid;
             page-break-inside: avoid;
          }
          @page { size: A4; margin: 15mm; }
        }
      `}} />
    </div>
  );
}
