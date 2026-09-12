import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function SuratTawaran({ candidate }: { candidate: Candidate }) {
  const { settings } = useAppContext();
  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white p-6 sm:p-10 print:p-2 max-w-4xl mx-auto shadow-2xl printable-area text-black font-sans text-sm">
      {/* Header Surat */}
      <div className="flex items-start mb-3 border-b-2 border-black pb-2">
        <div className="flex items-center gap-6 w-full">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Pahang.svg/400px-Coat_of_arms_of_Pahang.svg.png" alt="Jata Negara" className="w-24 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-start">
            <div>
              <h1 className="font-bold text-lg text-blue-900 mb-1">KEMENTERIAN PENDIDIKAN MALAYSIA</h1>
              <h2 className="text-blue-900 mb-1">Jabatan Pendidikan Negeri Pahang</h2>
              <p className="text-blue-900 leading-snug">
                Bandar Indera Mahkota<br/>
                25604 Kuantan<br/>
                Pahang Darul Makmur
              </p>
            </div>
            <div className="text-blue-900 text-sm leading-snug mt-4">
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

      <div className="flex justify-end mb-4">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="pr-2">Ruj Kami</td>
              <td>: JPNP.SPI.800-1/1/4 Jld.2 (17)</td>
            </tr>
            <tr>
              <td className="pr-2">Tarikh</td>
              <td>: {tarikhSemasa}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-3 font-bold uppercase">
        <p>KEPADA :</p>
        <p>{candidate.name}</p>
        <p>{candidate.alamat1},</p>
        {candidate.alamat2 && <p>{candidate.alamat2},</p>}
        <p>{candidate.poskod} {candidate.daerah},</p>
        <p>{candidate.negeri}</p>
        <p className="mt-4">NO.KP : {candidate.ic}</p>
      </div>

      <div className="mb-4">
        <p>Tuan,</p>
      </div>

      <div className="mb-4">
        <h2 className="font-bold uppercase text-base">TAWARAN KE TINGKATAN SATU SEKOLAH AGAMA BANTUAN KERAJAAN (SABK) TAHUN 2027</h2>
      </div>

      <div className="mb-4 text-justify">
        <p className="mb-4">Tahniah dan sukacita dimaklumkan anda telah ditawarkan ke Tingkatan Satu Sekolah Agama Bantuan Kerajaan seperti berikut :</p>
        
        <div className="ml-8 mb-4">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 w-8 align-top">i.</td>
                <td className="py-1 w-48 font-semibold">Sekolah ditempatkan</td>
                <td className="py-1 font-bold">: SMA KOTA GELANGGI 3</td>
              </tr>
              <tr>
                <td className="py-1 align-top">ii.</td>
                <td className="py-1 font-semibold">Tarikh Lapor Diri</td>
                <td className="py-1 font-bold">: {settings.tarikhLaporDiri || '03 JANUARI 2027 (AHAD)'}</td>
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

        <p className="mb-4 text-justify indent-8">
          2.<span className="ml-4 inline-block">Tawaran ini adalah <strong>MUKTAMAD</strong> dan <strong>TERBATAL</strong> sekiranya tidak melapor diri pada tarikh dan masa yang telah ditetapkan di atas melainkan pihak tuan dapat menghubungi pihak sekolah untuk memaklumkan kegagalan hadir pada tarikh tersebut. Pertukaran ke SABK yang lain <strong>TIDAK DIBENARKAN</strong>.</span>
        </p>

        <p className="mb-8 text-justify indent-8">
          3.<span className="ml-4 inline-block">Jabatan Pendidikan Negeri Pahang berhak menarik balik tawaran bila-bila masa sekiranya terdapat percanggahan maklumat dalam borang permohonan dengan dokumen asal.</span>
        </p>

        <p>Sekian, terima kasih.</p>
      </div>

      <div className="mt-4">
        <p className="font-bold mb-4">"MALAYSIA MADANI"</p>
        <p className="font-bold mb-4">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mb-3">Saya yang menjalankan amanah,</p>
        
        <div>
          <p className="font-bold uppercase">{settings.namaPengetua || 'NAMA PENTADBIR'}</p>
          <p>Ketua Penolong Pengarah Kanan</p>
          <p>Sektor Pendidikan Islam</p>
          <p>b.p Pengarah Pendidikan Pahang</p>
        </div>

        <div className="mt-4 text-xs">
          <p>s.k.</p>
          <p>Pengetua</p>
          <p>SABK</p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .printable-area { transform: scale(0.95); transform-origin: top center; }
        }
      `}} />
    </div>
  );
}
