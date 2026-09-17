import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function SuratTawaran({ candidate }: { candidate: Candidate }) {
  const { settings } = useAppContext();
  
  // Use the admin-defined date or current date
  const tarikhSemasa = settings.tarikhSuratTawaran || new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const rujukanSurat = settings.rujukanSuratTawaran || 'JPNP.SPI.800-1/1/4 Jld.2 (18)';

  return (
    <div className="bg-white p-6 sm:p-10 print:p-0 w-[210mm] min-h-[297mm] mx-auto shadow-2xl printable-area text-black font-sans text-sm relative">
      {/* Header Surat */}
      <div className="flex items-start mb-6 border-b-2 border-black pb-4">
        <div className="flex items-center gap-6 w-full">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Pahang.svg/400px-Coat_of_arms_of_Pahang.svg.png" alt="Jata Negara" className="w-24 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-start">
            <div>
              <h1 className="font-bold text-[15px] text-blue-900 mb-1 tracking-wide">KEMENTERIAN PENDIDIKAN MALAYSIA</h1>
              <h2 className="text-blue-900 mb-1 text-[13px]">Jabatan Pendidikan Negeri Pahang</h2>
              <p className="text-blue-900 leading-snug text-[13px]">
                Bandar Indera Mahkota<br/>
                25604 Kuantan<br/>
                Pahang Darul Makmur
              </p>
            </div>
            <div className="text-blue-900 text-[13px] leading-snug mt-6">
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

      <div className="flex justify-end mb-8 text-[13px]">
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

      <div className="mb-6 font-bold uppercase text-[13px] leading-snug">
        <p>KEPADA :</p>
        <p className="mt-2">{candidate.name}</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri} .</p>
        <p className="mt-4">NO.KP : {candidate.ic}</p>
      </div>

      <div className="mb-4 text-[13px]">
        <p>Tuan,</p>
      </div>

      <div className="mb-4 text-[13px]">
        <h2 className="font-bold uppercase">TAWARAN KE TINGKATAN SATU SEKOLAH AGAMA BANTUAN KERAJAAN (SABK) TAHUN {settings.sesiKemasukan?.substring(0, 4) || '2026'}</h2>
      </div>

      <div className="mb-4 text-justify text-[13px]">
        <p className="mb-4">Tahniah dan sukacita dimaklumkan anda telah ditawarkan ke Tingkatan Satu Sekolah Agama Bantuan Kerajaan seperti berikut :</p>
        
        <div className="ml-8 mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 w-8 align-top">i.</td>
                <td className="py-1 w-48 font-semibold">Sekolah ditempatkan</td>
                <td className="py-1 font-bold">: SMA KOTA GELANGGI 3</td>
              </tr>
              <tr>
                <td className="py-1 align-top">ii.</td>
                <td className="py-1 font-semibold">Tarikh Lapor Diri</td>
                <td className="py-1 font-bold">: {settings.tarikhLaporDiri?.toUpperCase() || '11 JANUARI 2026 (AHAD)'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">iii.</td>
                <td className="py-1 font-semibold">Masa Lapor diri</td>
                <td className="py-1 font-bold">: 8.30 PAGI</td>
              </tr>
              <tr>
                <td className="py-1 align-top">iv.</td>
                <td className="py-1 font-semibold">Penempatan Asrama</td>
                <td className="py-1 font-bold">: Ditawarkan</td>
              </tr>
              <tr>
                <td className="py-1 align-top">v.</td>
                <td className="py-1 font-semibold">Dokumen diperlukan</td>
                <td className="py-1 font-bold">: Rujuk Lampiran</td>
              </tr>
              <tr>
                <td className="py-1 align-top">vi.</td>
                <td className="py-1 font-semibold">Aliran</td>
                <td className="py-1 font-bold">: Kurikulum Bersepadu Tahfiz (KBT)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-4 text-justify">
          2.<span className="ml-5 inline-block">Tawaran ini adalah <strong>MUKTAMAD</strong> dan <strong>TERBATAL</strong> sekiranya tidak melapor diri pada tarikh dan masa yang telah ditetapkan di atas melainkan pihak tuan dapat menghubungi pihak sekolah untuk memaklumkan kegagalan hadir pada tarikh tersebut. Pertukaran ke SABK yang lain <strong>TIDAK DIBENARKAN</strong>.</span>
        </p>

        <p className="mb-8 text-justify">
          3.<span className="ml-5 inline-block">Jabatan Pendidikan Negeri Pahang berhak menarik balik tawaran bila-bila masa sekiranya terdapat percanggahan maklumat dalam borang permohonan dengan dokumen asal.</span>
        </p>

        <p className="mb-8">Sekian, terima kasih.</p>
      </div>

      <div className="mt-8 text-[13px]">
        <p className="font-bold mb-4">"MALAYSIA MADANI"</p>
        <p className="font-bold mb-6">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-8">Saya yang menjalankan amanah,</p>
        
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
          @page { size: A4; margin: 20mm; }
        }
      `}} />
    </div>
  );
}
