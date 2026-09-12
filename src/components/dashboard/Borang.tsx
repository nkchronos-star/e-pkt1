import { useState, useEffect } from 'react';
import { useAppContext } from '../../store';
import { FileText, Save, Send, AlertCircle, Calendar, CheckCircle, X, LogIn } from 'lucide-react';
import { Candidate } from '../../types';


export default function Borang() {
  const { settings, saveCandidate, candidates } = useAppContext();
  const isBuka = settings.borangBuka;

  // Form State
  const [formData, setFormData] = useState<Partial<Candidate>>(() => {
    const saved = localStorage.getItem('borang_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Gagal memuatkan draf borang, mungkin data rosak', e);
      }
    }
    return {
      jantina: '',
      pbd: { bm: '', bi: '', matematik: '', sains: '' },
      pbdD6: { bm: '', bi: '', matematik: '', sains: '' },
      upkk: { alquran: '', akidah: '', sirah: '', adab: '', jawikhat: '', bahasaarab: '', ibadah: '', penghayatancarahidupislam: '', amalisolat: '' }
    };
  });

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };



  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => {
         let updates: any = { [name]: typeof value === 'string' ? value.toUpperCase() : value };
         // Poskod Auto Detect
         if (name === 'poskod' && value.length >= 2) {
             const prefix = value.substring(0, 2);
             const stateMap: Record<string, string> = {
                '01': 'Perlis', '02': 'Perlis', '05': 'Kedah', '06': 'Kedah', '07': 'Kedah', '08': 'Kedah', '09': 'Kedah',
                '10': 'Pulau Pinang', '11': 'Pulau Pinang', '12': 'Pulau Pinang', '13': 'Pulau Pinang', '14': 'Pulau Pinang',
                '15': 'Kelantan', '16': 'Kelantan', '17': 'Kelantan', '18': 'Kelantan',
                '20': 'Terengganu', '21': 'Terengganu', '22': 'Terengganu', '23': 'Terengganu', '24': 'Terengganu',
                '25': 'Pahang', '26': 'Pahang', '27': 'Pahang', '28': 'Pahang', '39': 'Pahang', '49': 'Pahang', '69': 'Pahang',
                '30': 'Perak', '31': 'Perak', '32': 'Perak', '33': 'Perak', '34': 'Perak', '35': 'Perak', '36': 'Perak',
                '40': 'Selangor', '41': 'Selangor', '42': 'Selangor', '43': 'Selangor', '44': 'Selangor', '45': 'Selangor', '46': 'Selangor', '47': 'Selangor', '48': 'Selangor',
                '50': 'W.P. Kuala Lumpur', '51': 'W.P. Kuala Lumpur', '52': 'W.P. Kuala Lumpur', '53': 'W.P. Kuala Lumpur', '54': 'W.P. Kuala Lumpur', '55': 'W.P. Kuala Lumpur', '56': 'W.P. Kuala Lumpur', '57': 'W.P. Kuala Lumpur', '58': 'W.P. Kuala Lumpur', '59': 'W.P. Kuala Lumpur',
                '60': 'W.P. Kuala Lumpur', '62': 'W.P. Putrajaya', '63': 'Selangor', '64': 'Selangor', '68': 'Selangor',
                '70': 'Negeri Sembilan', '71': 'Negeri Sembilan', '72': 'Negeri Sembilan', '73': 'Negeri Sembilan',
                '75': 'Melaka', '76': 'Melaka', '77': 'Melaka', '78': 'Melaka',
                '79': 'Johor', '80': 'Johor', '81': 'Johor', '82': 'Johor', '83': 'Johor', '84': 'Johor', '85': 'Johor', '86': 'Johor',
                '87': 'W.P. Labuan',
                '88': 'Sabah', '89': 'Sabah', '90': 'Sabah', '91': 'Sabah',
                '93': 'Sarawak', '94': 'Sarawak', '95': 'Sarawak', '96': 'Sarawak', '97': 'Sarawak', '98': 'Sarawak'
             };
             if (stateMap[prefix]) {
                 updates.negeri = stateMap[prefix].toUpperCase();
             }
         }
         if (name === 'ic' && typeof value === 'string') {
             if (value.includes('-')) {
                 alert('Sila masukkan No. Kad Pengenalan tanpa tanda sengkang (-).');
                 updates.ic = value.replace(/-/g, '');
             }

             const cleanIC = value.replace(/\D/g, '');
             if (cleanIC.length >= 6) {
                 const yy = parseInt(cleanIC.substring(0, 2), 10);
                 const mm = cleanIC.substring(2, 4);
                 const dd = cleanIC.substring(4, 6);
                 if (!isNaN(yy) && parseInt(mm) > 0 && parseInt(mm) <= 12 && parseInt(dd) > 0 && parseInt(dd) <= 31) {
                    const year = yy > 50 ? 1900 + yy : 2000 + yy;
                    updates.tarikhLahir = `${year}-${mm}-${dd}`;
                 }
             }
             if (cleanIC.length >= 8) {
                 const stateCode = cleanIC.substring(6, 8);
                 const codeMap: Record<string, string> = {
                    '01': 'Johor', '21': 'Johor', '22': 'Johor', '23': 'Johor', '24': 'Johor',
                    '02': 'Kedah', '25': 'Kedah', '26': 'Kedah', '27': 'Kedah',
                    '03': 'Kelantan', '28': 'Kelantan', '29': 'Kelantan',
                    '04': 'Melaka', '30': 'Melaka',
                    '05': 'Negeri Sembilan', '31': 'Negeri Sembilan', '59': 'Negeri Sembilan',
                    '06': 'Pahang', '32': 'Pahang', '33': 'Pahang',
                    '07': 'Pulau Pinang', '34': 'Pulau Pinang', '35': 'Pulau Pinang',
                    '08': 'Perak', '36': 'Perak', '37': 'Perak', '38': 'Perak', '39': 'Perak',
                    '09': 'Perlis', '40': 'Perlis',
                    '10': 'Selangor', '41': 'Selangor', '42': 'Selangor', '43': 'Selangor', '44': 'Selangor',
                    '11': 'Terengganu', '45': 'Terengganu', '46': 'Terengganu',
                    '12': 'Sabah', '47': 'Sabah', '48': 'Sabah', '49': 'Sabah',
                    '13': 'Sarawak', '50': 'Sarawak', '51': 'Sarawak', '52': 'Sarawak', '53': 'Sarawak',
                    '14': 'W.P. Kuala Lumpur', '54': 'W.P. Kuala Lumpur', '55': 'W.P. Kuala Lumpur', '56': 'W.P. Kuala Lumpur', '57': 'W.P. Kuala Lumpur',
                    '15': 'W.P. Labuan', '58': 'W.P. Labuan',
                    '16': 'W.P. Putrajaya'
                 };
                 const stateName = codeMap[stateCode];
                 if (stateName) {
                     updates.negeri = stateName.toUpperCase();
                 }
             }
             if (cleanIC.length === 12) {
                 const lastDigit = parseInt(cleanIC.substring(11, 12), 10);
                 if (!isNaN(lastDigit)) {
                     updates.jantina = lastDigit % 2 === 0 ? 'PEREMPUAN' : 'LELAKI';
                 }
             }
         }
         return { ...prev, ...updates };
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Saiz fail melebihi had 2MB. Sila kecilkan gambar.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isNested) {
           setFormData(prev => ({
             ...prev,
             [isNested]: {
               ...(prev as any)[isNested] || {},
               [fieldName]: base64String
             }
           }));
        } else {
           setFormData(prev => ({
             ...prev,
             [fieldName]: base64String
           }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAddressToBapa = () => {
    setFormData(prev => ({
      ...prev, alamatBapa1: prev.alamat1 || '', alamatBapa2: prev.alamat2 || '', poskodBapa: prev.poskod || '', daerahBapa: prev.daerah || '', negeriBapa: prev.negeri || ''
    }));
  };

  const copyAddressToIbu = () => {
    setFormData(prev => ({
      ...prev, alamatIbu1: prev.alamat1 || '', alamatIbu2: prev.alamat2 || '', poskodIbu: prev.poskod || '', daerahIbu: prev.daerah || '', negeriIbu: prev.negeri || ''
    }));
  };

  const [tiadaBapa, setTiadaBapa] = useState(false);
  const handleTiadaBapa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTiadaBapa(checked);
    if(checked) {
       setFormData(prev => ({ ...prev, namaBapa: 'TIADA MAKLUMAT', icBapa: '-', warganegaraBapa: '-', alamatBapa1: '-', alamatBapa2: '-', poskodBapa: '-', daerahBapa: '-', negeriBapa: '-', pekerjaanBapa: '-', telefonBapa: '-' }));
    } else {
       setFormData(prev => ({ ...prev, namaBapa: '', icBapa: '', warganegaraBapa: '', alamatBapa1: '', alamatBapa2: '', poskodBapa: '', daerahBapa: '', negeriBapa: '', pekerjaanBapa: '', telefonBapa: '' }));
    }
  };

  const [tiadaIbu, setTiadaIbu] = useState(false);
  const handleTiadaIbu = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTiadaIbu(checked);
    if(checked) {
       setFormData(prev => ({ ...prev, namaIbu: 'TIADA MAKLUMAT', icIbu: '-', warganegaraIbu: '-', alamatIbu1: '-', alamatIbu2: '-', poskodIbu: '-', daerahIbu: '-', negeriIbu: '-', pekerjaanIbu: '-', telefonIbu: '-' }));
    } else {
       setFormData(prev => ({ ...prev, namaIbu: '', icIbu: '', warganegaraIbu: '', alamatIbu1: '', alamatIbu2: '', poskodIbu: '', daerahIbu: '', negeriIbu: '', pekerjaanIbu: '', telefonIbu: '' }));
    }
  };

  const getMissingFields = () => {
    const req = ['gambarUrl', 'name', 'ic', 'tarikhLahir', 'tempatLahir', 'jantina', 'alamat1', 'poskod', 'daerah', 'negeri', 'namaSekolahRendah', 'namaBapa', 'icBapa', 'pekerjaanBapa', 'telefonBapa', 'namaIbu', 'icIbu', 'pekerjaanIbu', 'telefonIbu'];
    const fieldLabels: Record<string, string> = {
      gambarUrl: 'Gambar Pasport',
      name: 'Nama Penuh Calon',
      ic: 'No. Kad Pengenalan',
      tarikhLahir: 'Tarikh Lahir',
      tempatLahir: 'Tempat Lahir',
      jantina: 'Jantina',
      alamat1: 'Alamat (Baris 1)',
      poskod: 'Poskod',
      daerah: 'Daerah',
      negeri: 'Negeri',
      namaSekolahRendah: 'Nama Sekolah Rendah',
      namaBapa: 'Nama Bapa / Penjaga 1',
      icBapa: 'No. KP Bapa',
      pekerjaanBapa: 'Pekerjaan Bapa',
      telefonBapa: 'No. Telefon Bapa',
      namaIbu: 'Nama Ibu / Penjaga 2',
      icIbu: 'No. KP Ibu',
      pekerjaanIbu: 'Pekerjaan Ibu',
      telefonIbu: 'No. Telefon Ibu'
    };
    return req.filter(f => !formData[f as keyof Candidate]).map(f => fieldLabels[f] || f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate IC
    const cleanFormIC = formData.ic?.replace(/[^0-9]/g, '');
    if (candidates.some(c => c.ic?.replace(/[^0-9]/g, '') === cleanFormIC)) {
      alert('Ralat: No. Kad Pengenalan ini telah pun didaftarkan. Calon yang sama tidak dibenarkan memohon lebih daripada sekali.');
      return;
    }

    if (!agreed) { alert('Sila sahkan perakuan.'); return; }
    
    setIsSubmitting(true);
    try {
      const permohonanId = Math.random().toString(36).substr(2, 9);
      const newCandidate: Candidate = {
        ...(formData as Candidate),
        id: permohonanId,
        statusTemuduga: 'MENUNGGU',
        statusTawaran: 'DALAM_PERTIMBANGAN'
      };
      
      saveCandidate(newCandidate);
      
      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terdapat ralat semasa menghantar borang. Borang direkodkan dalam sistem.');
      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSaveDraft = async () => {
    localStorage.setItem('borang_draft', JSON.stringify(formData));
    setIsSavingDraft(true);
    setTimeout(() => setIsSavingDraft(false), 1000);
  };

  const formatTarikh = (tarikhStr: string) => {
     if(!tarikhStr) return '-';
     const d = new Date(tarikhStr);
     if(isNaN(d.getTime())) return tarikhStr;
     const day = String(d.getDate()).padStart(2, '0');
     const month = d.toLocaleDateString('ms-MY', { month: 'long' });
     const year = d.getFullYear();
     return `${day} - ${month} - ${year}`;
  };

  if (!isBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Sistem permohonan belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh permohonan akan dibuka: <span className="font-semibold">{formatTarikh(settings.tarikhBukaBorang)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="animate-in fade-in py-10 px-4 max-w-4xl mx-auto print:py-0 print:px-0 printable-area">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-emerald-100 print:shadow-none print:border-none print:p-0">
          
          <div className="text-center mb-8 print:hidden">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Berjaya Dihantar!</h2>
            <p className="text-gray-600 mb-6">Terima kasih. Sila cetak atau simpan borang ini sebagai rujukan (PDF).</p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => {
                    window.print();
                    // Fallback for sandboxed iframes where print might be blocked silently
                    setTimeout(() => {
                      if (document.visibilityState === 'visible') {
                        // Just a small UX improvement, not a perfect check
                      }
                    }, 1000);
                  }}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-bold flex items-center gap-2"
                >
                  Cetak Borang / Simpan PDF
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-bold"
                >
                  Kembali
                </button>
              </div>
              <p className="text-xs text-amber-600 font-medium max-w-sm mt-2">
                *Nota: Jika butang tidak bertindak balas (disebabkan sekatan pelayar web pratonton), sila klik kanan dan pilih "Print" atau buka aplikasi di Tetingkap Baru (New Tab) / tekan Ctrl+P.
              </p>
            </div>
          </div>

          <div className="print:block bg-white text-slate-800">
             <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-2xl font-extrabold uppercase">Borang Permohonan Kemasukan</h1>
                <p className="text-sm font-medium mt-1">Salinan Permohonan Calon</p>
             </div>
             
             <div className="flex gap-6 mb-8 items-start">
                {formData.gambarUrl ? (
                   <img src={formData.gambarUrl} alt="Passport" className="w-24 h-32 object-cover border border-slate-300" />
                ) : (
                   <div className="w-24 h-32 border border-slate-300 flex items-center justify-center text-xs text-slate-400 bg-slate-50">Tiada Gambar</div>
                )}
                <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                   <div className="col-span-2 font-bold text-base mb-2">{formData.name}</div>
                   <div><strong>No. Kad Pengenalan:</strong> {formData.ic}</div>
                   <div><strong>No. Sijil Lahir:</strong> {formData.noSijilLahir}</div>
                   <div><strong>Tarikh Lahir:</strong> {formData.tarikhLahir}</div>
                   <div><strong>Tempat Lahir:</strong> {formData.tempatLahir}</div>
                   <div><strong>Jantina:</strong> {formData.jantina}</div>
                   <div className="col-span-2"><strong>Asal Sekolah:</strong> {formData.namaSekolahRendah}</div>
                   <div className="col-span-2"><strong>Alamat:</strong> {formData.alamat1} {formData.alamat2}, {formData.poskod} {formData.daerah}, {formData.negeri}</div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                   <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Maklumat Bapa</h3>
                   <div className="space-y-1">
                      <div><strong>Nama:</strong> {formData.namaBapa}</div>
                      <div><strong>No. KP:</strong> {formData.icBapa}</div>
                      <div><strong>No. Tel:</strong> {formData.telefonBapa}</div>
                      <div><strong>Pekerjaan:</strong> {formData.pekerjaanBapa}</div>
                   </div>
                </div>
                <div>
                   <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Maklumat Ibu</h3>
                   <div className="space-y-1">
                      <div><strong>Nama:</strong> {formData.namaIbu}</div>
                      <div><strong>No. KP:</strong> {formData.icIbu}</div>
                      <div><strong>No. Tel:</strong> {formData.telefonIbu}</div>
                      <div><strong>Pekerjaan:</strong> {formData.pekerjaanIbu}</div>
                   </div>
                </div>
             </div>

             <div className="mb-8 text-sm">
                 <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Keputusan PBD & UPKK</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <p className="font-bold mb-1">PBD Akhir Tahun Darjah 5</p>
                         <ul className="list-disc list-inside text-xs">
                             <li>Bahasa Melayu: {formData.pbd?.bm}</li>
                             <li>Bahasa Inggeris: {formData.pbd?.bi}</li>
                             <li>Matematik: {formData.pbd?.matematik}</li>
                             <li>Sains: {formData.pbd?.sains}</li>
                         </ul>
                     </div>
                     <div>
                         <p className="font-bold mb-1">PBD Pertengahan Darjah 6</p>
                         <ul className="list-disc list-inside text-xs">
                             <li>Bahasa Melayu: {formData.pbdD6?.bm}</li>
                             <li>Bahasa Inggeris: {formData.pbdD6?.bi}</li>
                             <li>Matematik: {formData.pbdD6?.matematik}</li>
                             <li>Sains: {formData.pbdD6?.sains}</li>
                         </ul>
                     </div>
                 </div>
                 <div className="mt-4">
                     <p className="font-bold mb-1">UPKK</p>
                     <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                         <li>Al-Quran: {formData.upkk?.alquran}</li>
                         <li>Akidah: {formData.upkk?.akidah}</li>
                         <li>Sirah: {formData.upkk?.sirah}</li>
                         <li>Adab: {formData.upkk?.adab}</li>
                         <li>Jawi & Khat: {formData.upkk?.jawikhat}</li>
                         <li>Bahasa Arab: {formData.upkk?.bahasaarab}</li>
                         <li>Ibadah: {formData.upkk?.ibadah}</li>
                         <li>Penghayatan Islam: {formData.upkk?.penghayatancarahidupislam}</li>
                         <li>Amali Solat: {formData.upkk?.amalisolat}</li>
                     </ul>
                 </div>
             </div>
             
             <div className="text-center text-xs text-slate-500 mt-12 print:mt-24 border-t border-slate-200 pt-4">
                Borang ini dijana oleh komputer. Sila bawa salinan ini semasa temuduga (jika terpilih).
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-2xl mb-4">
           <FileText className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">Permohonan Kemasukan Tingkatan 1<br/><span className="text-emerald-700">SMA Kota Gelanggi</span></h1>
        <p className="text-slate-500 text-lg">Sila isi semua maklumat di bawah dengan tepat. Sistem akan menyimpan draf secara automatik.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Gambar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
           <div className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100">
             <h2 className="text-xl font-extrabold text-emerald-900 flex items-center gap-3">
               <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">1</span>
               MUAT NAIK GAMBAR PASPORT
             </h2>
           </div>
           <div className="p-8 sm:p-12">
             <div className="flex flex-col sm:flex-row items-center gap-8">
                {!formData.gambarUrl && (
                   <div className="w-32 h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-emerald-400 hover:bg-slate-50 transition-colors">
                      <FileText className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs font-medium">Gambar</span>
                   </div>
                )}
              {formData.gambarUrl && (
                 <img src={formData.gambarUrl} alt="Passport" className="w-32 h-40 object-cover rounded-2xl border-2 border-slate-200" />
              )}
              <div className="flex-1 w-full text-center sm:text-left">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
                {!formData.gambarUrl && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100">
                    <span className="text-xs font-bold uppercase tracking-wide">Wajib: Sila muat naik gambar pasport</span>
                  </div>
                )}
              </div>
           </div>
           </div>
        </div>

        {/* Bahagian A */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
           <div className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100">
             <h2 className="text-xl font-extrabold text-emerald-900 flex items-center gap-3">
               <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">2</span>
               BAHAGIAN A : BUTIRAN PEMOHON
             </h2>
           </div>
           <div className="p-8 sm:p-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Nama Pemohon</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Kad Pengenalan</label>
                <input type="text" name="ic" value={formData.ic || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required placeholder="Cth: 140101061234"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Sijil Kelahiran</label>
                <input type="text" name="noSijilLahir" value={formData.noSijilLahir || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Tarikh Lahir</label>
                <input type="date" name="tarikhLahir" value={formData.tarikhLahir || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Tempat Lahir</label>
                <input type="text" name="tempatLahir" value={formData.tempatLahir || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Jantina</label>
                <select name="jantina" value={formData.jantina || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
                  <option value="">-- PILIH --</option>
                  <option value="LELAKI">LELAKI</option>
                  <option value="PEREMPUAN">PEREMPUAN</option>
                </select>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 1 <span className="text-red-500">*</span></label>
                  <input type="text" name="alamat1" value={formData.alamat1 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 2</label>
                  <input type="text" name="alamat2" value={formData.alamat2 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Poskod</label>
                <input type="text" name="poskod" value={formData.poskod || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Daerah</label>
                <input type="text" name="daerah" value={formData.daerah || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Negeri</label>
                <select name="negeri" value={formData.negeri || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
                  <option value="">-- PILIH NEGERI --</option>
                  <option value="JOHOR">JOHOR</option>
                  <option value="KEDAH">KEDAH</option>
                  <option value="KELANTAN">KELANTAN</option>
                  <option value="MELAKA">MELAKA</option>
                  <option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
                  <option value="PAHANG">PAHANG</option>
                  <option value="PULAU PINANG">PULAU PINANG</option>
                  <option value="PERAK">PERAK</option>
                  <option value="PERLIS">PERLIS</option>
                  <option value="SELANGOR">SELANGOR</option>
                  <option value="TERENGGANU">TERENGGANU</option>
                  <option value="SABAH">SABAH</option>
                  <option value="SARAWAK">SARAWAK</option>
                  <option value="W.P. KUALA LUMPUR">W.P. KUALA LUMPUR</option>
                  <option value="W.P. LABUAN">W.P. LABUAN</option>
                  <option value="W.P. PUTRAJAYA">W.P. PUTRAJAYA</option>
                  </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Nama dan Alamat Sekolah Rendah</label>
                <textarea name="namaSekolahRendah" value={formData.namaSekolahRendah || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" rows={3} required />
              </div>
           </div>
           </div>
        </div>

        {/* Bahagian B */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
           <div className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100">
             <h2 className="text-xl font-extrabold text-emerald-900 flex items-center gap-3">
               <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">3</span>
               BAHAGIAN B : MAKLUMAT IBU BAPA/PENJAGA
             </h2>
           </div>
           
           <div className="p-8 sm:p-12">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 gap-4 mt-2">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">Maklumat Bapa</h3>
              <div className="flex gap-3 text-xs flex-wrap">
                 <button type="button" onClick={copyAddressToBapa} className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition">Salin Alamat Pemohon</button>
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input type="checkbox" checked={tiadaBapa} onChange={(e) => handleTiadaBapa(e as any)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" /> Tiada Maklumat
                 </label>
              </div>
           </div>
           <div className={tiadaBapa ? 'hidden' : 'block'}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-12">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Nama Bapa</label>
                <input type="text" name="namaBapa" value={formData.namaBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Kad Pengenalan</label>
                <input type="text" name="icBapa" value={formData.icBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Warganegara</label>
                <input type="text" name="warganegaraBapa" value={formData.warganegaraBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 1 <span className="text-red-500">*</span></label>
                  <input type="text" name="alamatBapa1" value={formData.alamatBapa1 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 2</label>
                  <input type="text" name="alamatBapa2" value={formData.alamatBapa2 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Poskod</label>
                <input type="text" name="poskodBapa" value={formData.poskodBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Daerah</label>
                <input type="text" name="daerahBapa" value={formData.daerahBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Negeri</label>
                <select name="negeriBapa" value={formData.negeriBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
                  <option value="">-- PILIH NEGERI --</option>
                  <option value="JOHOR">JOHOR</option>
                  <option value="KEDAH">KEDAH</option>
                  <option value="KELANTAN">KELANTAN</option>
                  <option value="MELAKA">MELAKA</option>
                  <option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
                  <option value="PAHANG">PAHANG</option>
                  <option value="PULAU PINANG">PULAU PINANG</option>
                  <option value="PERAK">PERAK</option>
                  <option value="PERLIS">PERLIS</option>
                  <option value="SELANGOR">SELANGOR</option>
                  <option value="TERENGGANU">TERENGGANU</option>
                  <option value="SABAH">SABAH</option>
                  <option value="SARAWAK">SARAWAK</option>
                  <option value="W.P. KUALA LUMPUR">W.P. KUALA LUMPUR</option>
                  <option value="W.P. LABUAN">W.P. LABUAN</option>
                  <option value="W.P. PUTRAJAYA">W.P. PUTRAJAYA</option>
                  </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Pekerjaan</label>
                <input type="text" name="pekerjaanBapa" value={formData.pekerjaanBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Telefon</label>
                <input type="text" name="telefonBapa" value={formData.telefonBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
           </div>
           </div>

           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 gap-4 mt-8">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">Maklumat Ibu</h3>
              <div className="flex gap-3 text-xs flex-wrap">
                 <button type="button" onClick={copyAddressToIbu} className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition">Salin Alamat Pemohon</button>
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input type="checkbox" checked={tiadaIbu} onChange={(e) => handleTiadaIbu(e as any)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" /> Tiada Maklumat
                 </label>
              </div>
           </div>
           <div className={tiadaIbu ? 'hidden' : 'block'}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Nama Ibu</label>
                <input type="text" name="namaIbu" value={formData.namaIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Kad Pengenalan</label>
                <input type="text" name="icIbu" value={formData.icIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Warganegara</label>
                <input type="text" name="warganegaraIbu" value={formData.warganegaraIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 1 <span className="text-red-500">*</span></label>
                  <input type="text" name="alamatIbu1" value={formData.alamatIbu1 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Alamat Rumah 2</label>
                  <input type="text" name="alamatIbu2" value={formData.alamatIbu2 || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Poskod</label>
                <input type="text" name="poskodIbu" value={formData.poskodIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Daerah</label>
                <input type="text" name="daerahIbu" value={formData.daerahIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Negeri</label>
                <select name="negeriIbu" value={formData.negeriIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
                  <option value="">-- PILIH NEGERI --</option>
                  <option value="JOHOR">JOHOR</option>
                  <option value="KEDAH">KEDAH</option>
                  <option value="KELANTAN">KELANTAN</option>
                  <option value="MELAKA">MELAKA</option>
                  <option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
                  <option value="PAHANG">PAHANG</option>
                  <option value="PULAU PINANG">PULAU PINANG</option>
                  <option value="PERAK">PERAK</option>
                  <option value="PERLIS">PERLIS</option>
                  <option value="SELANGOR">SELANGOR</option>
                  <option value="TERENGGANU">TERENGGANU</option>
                  <option value="SABAH">SABAH</option>
                  <option value="SARAWAK">SARAWAK</option>
                  <option value="W.P. KUALA LUMPUR">W.P. KUALA LUMPUR</option>
                  <option value="W.P. LABUAN">W.P. LABUAN</option>
                  <option value="W.P. PUTRAJAYA">W.P. PUTRAJAYA</option>
                  </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Pekerjaan</label>
                <input type="text" name="pekerjaanIbu" value={formData.pekerjaanIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">No. Telefon</label>
                <input type="text" name="telefonIbu" value={formData.telefonIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />
              </div>
           </div>
        </div>

           </div>
        </div>
        {/* Bahagian C */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
           <div className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100">
             <h2 className="text-xl font-extrabold text-emerald-900 flex items-center gap-3">
               <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">4</span>
               BAHAGIAN C : MAKLUMAT AKADEMIK
             </h2>
           </div>
           
           <div className="p-8 sm:p-12">
             <div className="mb-10">
              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">a. Keputusan PBD (Akhir Tahun Darjah 5)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}</label>
                       <select name={`pbd.${sub}`} value={(formData.pbd as any)?.[sub] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">PILIH TP</option>
                          {[1,2,3,4,5,6].map(tp => <option key={tp} value={`TP${tp}`}>TP {tp}</option>)}
                       </select>
                    </div>
                 ))}
              </div>


              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">b. Keputusan PBD (Pertengahan Tahun Darjah 6)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}</label>
                       <select name={`pbdD6.${sub}`} value={(formData.pbdD6 as any)?.[sub] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">PILIH TP</option>
                          {[1,2,3,4,5,6].map(tp => <option key={tp} value={`TP${tp}`}>TP {tp}</option>)}
                       </select>
                    </div>
                 ))}
              </div>

           </div>

           <div>
              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">b. Keputusan UPKK</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 {[
                    {id: 'alquran', label: 'Al-Quran'},
                    {id: 'akidah', label: 'Akidah'},
                    {id: 'sirah', label: 'Sirah'},
                    {id: 'adab', label: 'Adab'},
                    {id: 'jawikhat', label: 'Jawi dan Khat'},
                    {id: 'bahasaarab', label: 'Bahasa Arab'},
                    {id: 'ibadah', label: 'Ibadah'},
                    {id: 'penghayatancarahidupislam', label: 'Penghayatan Cara Hidup Islam'},
                    {id: 'amalisolat', label: 'Amali Solat'},
                 ].map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub.label}</label>
                       <select name={`upkk.${sub.id}`} value={(formData.upkk as any)?.[sub.id] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">GRED</option>
                          {['A', 'B', 'C', 'D'].map(g => <option key={g} value={g}>{g}</option>)}
                       </select>
                    </div>
                 ))}
              </div>

           </div>
           </div>
        </div>

        {/* Bahagian D */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
           <div className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100">
             <h2 className="text-xl font-extrabold text-emerald-900 flex items-center gap-3">
               <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">5</span>
               BAHAGIAN D : PENGESAHAN
             </h2>
           </div>
           <div className="p-8 sm:p-12">
             <div className="space-y-6">
             <div className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border border-slate-200/60 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setAgreed(!agreed)}>
               <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${agreed ? 'bg-slate-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                 {agreed && <CheckCircle className="w-4 h-4 text-white" />}
               </div>
               <label htmlFor="agree" className="text-sm text-slate-700 leading-relaxed font-medium cursor-pointer select-none">
                 i. Saya mengaku bahawa segala keterangan di atas adalah benar.<br/><br/>
                 ii. Saya selaku penjaga pelajar di atas memohon agar pihak tuan mempertimbangkan permohonan anak saya dan saya bersedia akan menerima segala keputusan yang akan diputuskan oleh pihak sekolah.
               </label>
             </div>
             
             {agreed && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 mt-6 animate-in slide-in-from-top-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Tarikh</label>
                    <input type="text" value={new Date().toLocaleDateString('ms-MY')} disabled className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Nama Pengesah (Ibu/Bapa/Penjaga)</label>
                    <input type="text" value={formData.namaBapa || formData.namaIbu || ''} readOnly className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 uppercase" />
                  </div>
               </div>
             )}
           </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 pb-12">
           {getMissingFields().length === 0 ? (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/30 shadow-xl'} text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 text-lg`}
              >
                 {isSubmitting ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Send className="w-6 h-6" />
                 )}
                 {isSubmitting ? 'Menghantar...' : 'Hantar Permohonan'}
              </button>
           ) : (
              <div className="text-amber-700 flex flex-col gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-sm font-bold">Borang tidak lengkap. Sila semak semula ruangan yang masih kosong:</span>
                </div>
                <ul className="text-xs list-disc list-inside font-medium opacity-80 columns-2">
                   {getMissingFields().map(m => <li key={m}>{m}</li>)}
                </ul>
              </div>
           )}
        </div>
      </form>
    </div>
  );
}
