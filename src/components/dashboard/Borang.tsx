import { useState, useEffect } from 'react';
import { useAppContext, getTodayMalaysia } from '../../store';
import { FileText, Save, Send, AlertCircle, Calendar, CheckCircle, X, LogIn, Loader2, Lock, Clock, BookOpen, ArrowRight, ArrowLeft, ShieldCheck, Trash2, Check } from 'lucide-react';
import { Candidate } from '../../types';
import { compressImageFile } from '../../lib/imageUtils';
import { lookupPoskodMalaysia } from '../../lib/poskodMalaysia';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Panduan from './Panduan';

interface BorangProps {
  onNavigate?: (view: any) => void;
}

const BORANG_STEPS = [
  { id: 1, title: 'Muat Naik Gambar Pasport', shortTitle: 'Gambar Pasport' },
  { id: 2, title: 'Butiran Pemohon', shortTitle: 'Butiran Pemohon' },
  { id: 3, title: 'Maklumat Ibu Bapa / Penjaga', shortTitle: 'Ibu Bapa / Penjaga' },
  { id: 4, title: 'Maklumat Akademik', shortTitle: 'Maklumat Akademik' },
  { id: 5, title: 'Pengesahan & Hantar Permohonan', shortTitle: 'Pengesahan & Hantar' },
];

export default function Borang({ onNavigate }: BorangProps) {
  const { settings, saveCandidate, candidates } = useAppContext();
  const isBuka = settings.borangBuka;

  // Status Calon Telah Membaca Panduan Permohonan Sebelum Isi Borang
  const [hasReadPanduan, setHasReadPanduan] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('borang_panduan_read') === 'true';
    } catch {
      return false;
    }
  });

  // Langkah Semasa (1 hingga 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepNotice, setStepNotice] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);

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

  // Simpan draf secara automatik setiap kali data borang berubah
  useEffect(() => {
    if (!submitted) {
      try {
        localStorage.setItem('borang_draft', JSON.stringify(formData));
      } catch {}
    }
  }, [formData, submitted]);

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };



  // Selaraskan daerah & negeri secara automatik jika draf sedia ada mempunyai poskod
  useEffect(() => {
    setFormData(prev => {
      let changed = false;
      const next = { ...prev };
      if (prev.poskod && prev.poskod.replace(/\D/g, '').length === 5) {
        const loc = lookupPoskodMalaysia(prev.poskod);
        if (loc && (prev.daerah !== loc.daerah || prev.negeri !== loc.negeri)) {
          next.daerah = loc.daerah;
          next.negeri = loc.negeri;
          changed = true;
        }
      }
      if (prev.poskodBapa && prev.poskodBapa.replace(/\D/g, '').length === 5) {
        const locBapa = lookupPoskodMalaysia(prev.poskodBapa);
        if (locBapa && (prev.daerahBapa !== locBapa.daerah || prev.negeriBapa !== locBapa.negeri)) {
          next.daerahBapa = locBapa.daerah;
          next.negeriBapa = locBapa.negeri;
          changed = true;
        }
      }
      if (prev.poskodIbu && prev.poskodIbu.replace(/\D/g, '').length === 5) {
        const locIbu = lookupPoskodMalaysia(prev.poskodIbu);
        if (locIbu && (prev.daerahIbu !== locIbu.daerah || prev.negeriIbu !== locIbu.negeri)) {
          next.daerahIbu = locIbu.daerah;
          next.negeriIbu = locIbu.negeri;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

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

         // Auto-Detect & Auto-Set Daerah + Negeri Berdasarkan Poskod (Pemohon, Bapa, Ibu)
         if (name === 'poskod' || name === 'poskodBapa' || name === 'poskodIbu') {
           const cleanPoskod = String(value || '').replace(/\D/g, '').substring(0, 5);
           updates[name] = cleanPoskod;
           const daerahField = name === 'poskod' ? 'daerah' : name === 'poskodBapa' ? 'daerahBapa' : 'daerahIbu';
           const negeriField = name === 'poskod' ? 'negeri' : name === 'poskodBapa' ? 'negeriBapa' : 'negeriIbu';

           if (cleanPoskod.length === 5) {
             const loc = lookupPoskodMalaysia(cleanPoskod);
             if (loc) {
               updates[daerahField] = loc.daerah;
               updates[negeriField] = loc.negeri;
             } else {
               updates[daerahField] = '';
               updates[negeriField] = '';
             }
           } else {
             updates[daerahField] = '';
             updates[negeriField] = '';
           }
         }

         if (name === 'ic' && typeof value === 'string') {
             updates.ic = value.trim();

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

  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        // Otomatis kecilkan saiz gambar pasport (anggaran 15KB - 30KB)
        const base64String = await compressImageFile(file, 400, 500, 0.75);
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
      } catch (err: any) {
        console.error('Ralat memproses gambar:', err);
        alert(err?.message || 'Gagal memproses fail gambar. Sila pastikan format fail adalah imej.');
        e.target.value = '';
      } finally {
        setIsCompressingImage(false);
      }
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

  const scrollToStepper = () => {
    const el = document.getElementById('borang-stepper-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setStepNotice(null);
    setCurrentStep(step);
    setTimeout(scrollToStepper, 50);
  };

  const handleNextStep = () => {
    setStepNotice(null);
    if (currentStep === 1) {
      if (!formData.gambarUrl || !formData.gambarUrl.trim()) {
        setStepNotice({
          type: 'warning',
          message: 'Perhatian: Anda belum memuat naik Gambar Pasport. Sila pastikan gambar pasport dimuat naik sebelum menghantar permohonan di Langkah 5.'
        });
      }
    } else if (currentStep === 2) {
      const rawIC = (formData.ic || '').trim();
      const rawPoskod = (formData.poskod || '').trim();
      if (!formData.name?.trim() || !/^\d{12}$/.test(rawIC)) {
        setStepNotice({
          type: 'warning',
          message: 'Perhatian: Pastikan Nama Penuh Calon dan No. Kad Pengenalan (12 digit nombor sahaja) dilengkapkan dengan tepat sebelum menghantar permohonan.'
        });
      } else if (!rawPoskod || rawPoskod.length < 5 || !formData.daerah) {
        setStepNotice({
          type: 'warning',
          message: 'Perhatian: Poskod belum lengkap atau salah diisi. Sila pastikan 5 digit poskod yang sah dimasukkan.'
        });
      }
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      setTimeout(scrollToStepper, 50);
    }
  };

  const handlePrevStep = () => {
    setStepNotice(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setTimeout(scrollToStepper, 50);
    }
  };

  const isStepCompleted = (stepId: number): boolean => {
    if (stepId === 1) return Boolean(formData.gambarUrl && formData.gambarUrl.trim());
    if (stepId === 2) {
      const rawIC = (formData.ic || '').trim();
      return Boolean(formData.name?.trim() && /^\d{12}$/.test(rawIC) && formData.jantina && formData.namaSekolahRendah);
    }
    if (stepId === 3) {
      return Boolean((formData.namaBapa && formData.telefonBapa) || (formData.namaIbu && formData.telefonIbu));
    }
    if (stepId === 4) {
      return Boolean(formData.upkk?.alquran || formData.pbd?.bm || formData.pbdD6?.bm);
    }
    if (stepId === 5) {
      return agreed;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepNotice(null);

    // 0. Semakan Ketat: Pastikan permohonan masih dibuka dan tidak melepasi tarikh tutup
    if (!settings.borangBuka || isPastClosing || isBeforeOpening) {
      setStepNotice({
        type: 'error',
        message: 'Maaf, permohonan kemasukan Tingkatan 1 telah ditutup atau belum dibuka.'
      });
      scrollToStepper();
      return;
    }
    
    // 1. Wajib muat naik gambar pasport pemohon
    if (!formData.gambarUrl || !formData.gambarUrl.trim()) {
      setCurrentStep(1);
      setStepNotice({
        type: 'error',
        message: 'Ralat Wajib: Sila muat naik Gambar Pasport Pemohon terlebih dahulu pada Langkah 1 sebelum menghantar borang.'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    // 2. Semakan Nama Penuh Calon
    if (!formData.name?.trim()) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat Wajib: Sila masukkan Nama Penuh Calon pada Langkah 2 (Butiran Pemohon).'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    // 3. Semakan Ketat No. Kad Pengenalan Calon (Tepat 12 digit nombor sahaja, tiada -, tiada huruf, tidak lebih, tidak kurang)
    const rawIC = (formData.ic || '').trim();
    if (!rawIC) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat Wajib: Sila masukkan No. Kad Pengenalan Calon pada Langkah 2 (Butiran Pemohon).'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    if (rawIC.includes('-')) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat No. KP: No. Kad Pengenalan tidak boleh mengandungi simbol sengkang (-). Sila masukkan 12 digit nombor sahaja tanpa tanda (-) (contoh: 140101061234).'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    if (/[a-zA-Z]/.test(rawIC)) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat No. KP: No. Kad Pengenalan tidak boleh mengandungi sebarang huruf. Sila masukkan 12 digit nombor sahaja (contoh: 140101061234).'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    if (rawIC.length > 12) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: `Ralat No. KP: No. Kad Pengenalan tidak boleh melebihi 12 digit (semasa: ${rawIC.length} aksara). Sila masukkan tepat 12 digit nombor sahaja.`
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    if (rawIC.length < 12) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: `Ralat No. KP: No. Kad Pengenalan mestilah mengandungi tepat 12 digit nombor (semasa: ${rawIC.length} digit).`
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    if (!/^\d{12}$/.test(rawIC)) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat No. KP: No. Kad Pengenalan mestilah mengandungi tepat 12 digit nombor sahaja tanpa sebarang simbol atau huruf.'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    const rawPoskod = (formData.poskod || '').trim();
    if (!rawPoskod || rawPoskod.length < 5 || !formData.daerah) {
      setCurrentStep(2);
      setStepNotice({
        type: 'error',
        message: 'Ralat Poskod: Sila masukkan 5 digit poskod yang lengkap dan sah pada Langkah 2 (Butiran Pemohon).'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    const cleanFormIC = rawIC;

    if (!agreed) {
      setCurrentStep(5);
      setStepNotice({
        type: 'error',
        message: 'Sila tandakan kotak pengesahan perakuan (i & ii) di bawah sebelum menghantar borang permohonan.'
      });
      setTimeout(scrollToStepper, 50);
      return;
    }

    // Check for duplicate IC in Firestore securely
    setIsSubmitting(true);
    try {
      const dRef = doc(db, 'candidates', cleanFormIC);
      const dSnap = await getDoc(dRef);
      if (dSnap.exists()) {
        setStepNotice({
          type: 'error',
          message: 'Ralat Pendua: No. Kad Pengenalan ini telah pun didaftarkan dalam sistem. Calon yang sama tidak dibenarkan memohon lebih daripada sekali.'
        });
        setIsSubmitting(false);
        scrollToStepper();
        return;
      }
      const q = query(collection(db, 'candidates'), where('ic', '==', cleanFormIC), limit(1));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        setStepNotice({
          type: 'error',
          message: 'Ralat Pendua: No. Kad Pengenalan ini telah pun didaftarkan dalam sistem. Calon yang sama tidak dibenarkan memohon lebih daripada sekali.'
        });
        setIsSubmitting(false);
        scrollToStepper();
        return;
      }
    } catch (e) {
      console.warn("Semakan pendua IC:", e);
    }
    
    try {
      const permohonanId = Math.random().toString(36).substr(2, 9);
      const newCandidate: Candidate = {
        ...(formData as Candidate),
        name: formData.name.trim(),
        ic: cleanFormIC,
        id: permohonanId,
        statusTemuduga: 'MENUNGGU',
        statusTawaran: 'DALAM_PERTIMBANGAN'
      };
      
      await saveCandidate(newCandidate);
      
      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStepNotice({
        type: 'error',
        message: 'Ralat semasa menghantar borang: ' + (error?.message || 'Sila pastikan capaian internet anda aktif dan cuba klik butang Hantar sekali lagi. Maklumat borang anda tidak hilang.')
      });
      scrollToStepper();
    } finally {
      setIsSubmitting(false);
    }
  };


  const [isClearedDraft, setIsClearedDraft] = useState(false);

  const handleSaveDraft = async () => {
    localStorage.setItem('borang_draft', JSON.stringify(formData));
    setIsSavingDraft(true);
    setTimeout(() => setIsSavingDraft(false), 1200);
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem('borang_draft');
    } catch {}
    setFormData({
      jantina: '',
      pbd: { bm: '', bi: '', matematik: '', sains: '' },
      pbdD6: { bm: '', bi: '', matematik: '', sains: '' },
      upkk: { alquran: '', akidah: '', sirah: '', adab: '', jawikhat: '', bahasaarab: '', ibadah: '', penghayatancarahidupislam: '', amalisolat: '' }
    });
    setAgreed(false);
    setCurrentStep(1);
    setStepNotice(null);
    setIsClearedDraft(true);
    setTimeout(() => setIsClearedDraft(false), 2500);
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

  const today = getTodayMalaysia();
  const isPastClosing = Boolean(settings.tarikhTutupBorang && today > settings.tarikhTutupBorang);
  const isBeforeOpening = Boolean(settings.tarikhBukaBorang && today < settings.tarikhBukaBorang);

  if (!isBuka || isPastClosing || isBeforeOpening) {
    if (isPastClosing || (!isBuka && !isBeforeOpening)) {
      return (
        <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-amber-500"></div>
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Permohonan Telah Ditutup</h2>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              Tempoh permohonan kemasukan Tingkatan 1 bagi sesi ini telah tamat. Terima kasih atas minat anda memohon ke SMA Kota Gelanggi 3.
            </p>
            {settings.tarikhTutupBorang && (
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-800 font-semibold mb-6">
                Tarikh rasmi permohonan ditutup: <span className="font-bold underline">{formatTarikh(settings.tarikhTutupBorang)}</span>
              </div>
            )}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2 text-left">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Tindakan Seterusnya Bagi Calon Berdaftar:
              </p>
              <p className="leading-relaxed">
                Sila buat semakan panggilan temuduga bermula <strong className="text-emerald-700">{settings.tarikhBukaTemuduga ? formatTarikh(settings.tarikhBukaTemuduga) : '2 Oktober 2026'}</strong> melalui menu <strong>Semak Temuduga</strong> di atas.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Permohonan Belum Dibuka</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">Sistem permohonan belum dibuka buat masa ini. Harap maklum.</p>
          {settings.tarikhBukaBorang && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 font-semibold">
              Tarikh permohonan akan dibuka: <span className="font-bold underline">{formatTarikh(settings.tarikhBukaBorang)}</span>
            </div>
          )}
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
                         <li>Penghayatan Cara Hidup Islam (PCHI): {formData.upkk?.penghayatancarahidupislam}</li>
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

  // JIKA CALON BELUM MEMBACA PANDUAN: CALON WAJIB BACA PANDUAN TERLEBIH DAHULU
  if (!hasReadPanduan) {
    return (
      <Panduan 
        isGateMode={true} 
        onProceed={() => {
          setHasReadPanduan(true);
          try {
            sessionStorage.setItem('borang_panduan_read', 'true');
          } catch {}
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  return (
    <div id="borang-stepper-top" className="animate-in fade-in py-4 sm:py-8 px-2.5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Banner Pengesahan Panduan Telah Dibaca & Butang Rujuk Semula */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-emerald-950">
                Panduan Permohonan Telah Dibaca & Disahkan
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                · Draf Auto-Simpan Aktif
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-700 leading-tight mt-0.5">
              Lengkapkan permohonan mengikut 5 langkah mudah di bawah. Anda boleh klik nombor langkah untuk berpindah bahagian.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setHasReadPanduan(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-100/60 border border-emerald-300 px-3.5 py-2 rounded-xl transition shadow-2xs shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
          title="Buka semula panduan permohonan tanpa kehilangan draf yang sedang diisi"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Rujuk Semula Panduan</span>
        </button>
      </div>

      {/* KAD STEPPER 5 LANGKAH (Reka Bentuk Seperti Gambar Rujukan) */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden mb-6">
        {/* Bar Hijau Zamrud Atas (Seperti "Diploma Program" dalam gambar) */}
        <div className="bg-[#129468] bg-gradient-to-r from-[#0c7a54] via-[#14996c] to-[#0c7a54] px-4 py-3 sm:py-3.5 text-center shadow-xs">
          <h1 className="text-white font-bold text-sm sm:text-lg md:text-xl tracking-wide">
            Borang Permohonan Kemasukan Tingkatan 1 — SMA Kota Gelanggi 3
          </h1>
        </div>

        {/* Barisan 5 Bulatan Langkah & Garisan Penghubung */}
        <div className="px-2 sm:px-6 md:px-10 py-5 sm:py-7 bg-white">
          <div className="relative flex items-start justify-between">
            {BORANG_STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPassed = step.id < currentStep;
              const isDone = isStepCompleted(step.id);
              const isGoldRing = (isPassed || isDone) && !isActive;

              return (
                <div key={step.id} className="relative flex-1 flex flex-col items-center group">
                  {/* Garisan Penghubung ke Langkah Seterusnya */}
                  {idx < BORANG_STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 sm:top-6 md:top-7 left-1/2 w-full h-[3px] sm:h-[3.5px] -translate-y-1/2 transition-colors duration-300 z-0 ${
                        step.id < currentStep
                          ? 'bg-slate-900'
                          : isDone
                          ? 'bg-amber-400'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Bulatan Nombor Langkah (1 - 5) */}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg md:text-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 ${
                      isActive
                        ? 'bg-slate-900 border-[3px] sm:border-[3.5px] border-slate-900 text-white shadow-lg scale-105'
                        : isGoldRing
                        ? 'bg-white border-[3px] sm:border-[3.5px] border-amber-400 text-slate-800 hover:bg-amber-50 shadow-xs'
                        : 'bg-white border-[3px] sm:border-[3.5px] border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                    }`}
                    title={`Langkah ${step.id}: ${step.title}`}
                  >
                    <span>{step.id}</span>
                    {isDone && !isActive && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs ring-2 ring-white">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>

                  {/* Label di Bawah Bulatan */}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`mt-2 sm:mt-3 text-center px-0.5 sm:px-1.5 leading-snug transition-colors cursor-pointer max-w-[72px] min-[400px]:max-w-[85px] sm:max-w-[130px] md:max-w-[150px] ${
                      isActive
                        ? 'text-slate-900 font-extrabold text-[10px] sm:text-xs md:text-[13px]'
                        : isGoldRing
                        ? 'text-slate-700 font-bold text-[9.5px] sm:text-xs md:text-[13px]'
                        : 'text-slate-400 font-medium text-[9.5px] sm:text-xs md:text-[13px]'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifikasi Ralat / Peringatan Langkah Semasa */}
      {stepNotice && (
        <div
          className={`mb-6 p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 ${
            stepNotice.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : stepNotice.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                stepNotice.type === 'error'
                  ? 'text-red-600'
                  : stepNotice.type === 'warning'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            />
            <div className="text-xs sm:text-sm font-bold leading-relaxed">
              {stepNotice.message}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStepNotice(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-6">
        {/* =========================================================
            LANGKAH 1 : MUAT NAIK GAMBAR PASPORT
           ========================================================= */}
        {currentStep === 1 && (
          <div id="section-upload-gambar" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-emerald-50 px-5 sm:px-10 py-4 border-b-2 border-emerald-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  Langkah 1 daripada 5
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 flex items-center gap-2.5 mt-0.5">
                  MUAT NAIK GAMBAR PASPORT <span className="text-red-500 text-xs sm:text-sm font-bold">*WAJIB</span>
                </h2>
              </div>
              {!formData.gambarUrl ? (
                <span className="text-xs font-extrabold text-red-600">
                  Belum Dimuat Naik
                </span>
              ) : (
                <span className="text-xs font-extrabold text-emerald-700">
                  ✓ Gambar Siap Dimuat Naik
                </span>
              )}
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {!formData.gambarUrl ? (
                  <div className="w-36 h-44 bg-slate-50 border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center text-red-400 group hover:border-red-500 hover:bg-red-50/50 transition-colors shrink-0">
                    <FileText className="w-9 h-9 mb-2 group-hover:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-center px-3">Wajib Muat Naik Gambar Pasport</span>
                  </div>
                ) : (
                  <div className="relative group shrink-0">
                    <img
                      src={formData.gambarUrl}
                      alt="Passport"
                      className="w-36 h-44 object-cover rounded-2xl border-2 border-emerald-500 shadow-md"
                    />
                    <div className="mt-2 text-center">
                      <span className="text-[11px] font-bold text-emerald-700">✓ Gambar Tersimpan</span>
                    </div>
                  </div>
                )}

                <div className="flex-1 w-full text-center sm:text-left space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Pilih Fail Gambar Pasport Calon (Berpakaian Kemas / Sopan)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingImage}
                      onChange={(e) => handleFileChange(e, 'gambarUrl')}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 rounded-xl p-1.5 bg-slate-50/50"
                    />
                  </div>

                  {isCompressingImage ? (
                    <p className="text-sm text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sedang mengoptimumkan saiz gambar...
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      Format diterima: <strong>JPG, JPEG, PNG</strong>. Sistem akan mengecilkan dan mengoptimumkan saiz gambar pasport secara automatik supaya muat naik lancar.
                    </p>
                  )}

                  {!formData.gambarUrl && !isCompressingImage && (
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl border border-red-200 text-left">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-xs font-bold">
                        Peringatan: Borang permohonan tidak boleh dihantar tanpa gambar pasport pemohon.
                      </span>
                    </div>
                  )}

                  {formData.gambarUrl && !isCompressingImage && (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-xl border border-emerald-200 text-left">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold">
                        Gambar pasport berjaya dimuat naik! Sila klik butang "Seterusnya" di bawah untuk mengisi Butiran Pemohon.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            LANGKAH 2 : BUTIRAN PEMOHON
           ========================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-emerald-50 px-5 sm:px-10 py-4 border-b-2 border-emerald-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  Langkah 2 daripada 5
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 mt-0.5">
                  BAHAGIAN A : BUTIRAN PEMOHON
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-800">
                * Wajib diisi dengan tepat
              </span>
            </div>

            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Nama Pemohon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="Nama penuh calon seperti dalam Kad Pengenalan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    No. Kad Pengenalan (12 Digit Nombor Sahaja) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ic"
                    inputMode="numeric"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    value={formData.ic || ''}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-4 transition-all font-mono font-bold text-slate-800 ${
                      formData.ic &&
                      (formData.ic.includes('-') ||
                        /[a-zA-Z]/.test(formData.ic) ||
                        formData.ic.length !== 12 ||
                        !/^\d{12}$/.test(formData.ic))
                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                    placeholder="Cth: 140101061234"
                    required
                  />
                  {formData.ic &&
                    (formData.ic.includes('-') ||
                      /[a-zA-Z]/.test(formData.ic) ||
                      formData.ic.length !== 12 ||
                      !/^\d{12}$/.test(formData.ic)) && (
                      <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg space-y-1 animate-in fade-in">
                        {formData.ic.includes('-') && (
                          <p className="flex items-center gap-1.5">
                            ❌ Tanda sengkang (-) tidak dibenarkan. Sila buang tanda (-).
                          </p>
                        )}
                        {/[a-zA-Z]/.test(formData.ic) && (
                          <p className="flex items-center gap-1.5">
                            ❌ Huruf tidak dibenarkan. Sila masukkan 12 digit nombor sahaja.
                          </p>
                        )}
                        {formData.ic.length > 12 && (
                          <p className="flex items-center gap-1.5">
                            ❌ Melebihi 12 digit (semasa: {formData.ic.length} aksara). Sila pastikan tepat 12 digit nombor.
                          </p>
                        )}
                        {formData.ic.length < 12 &&
                          !formData.ic.includes('-') &&
                          !/[a-zA-Z]/.test(formData.ic) && (
                            <p className="flex items-center gap-1.5">
                              ⚠️ Mesti tepat 12 digit nombor (semasa: {formData.ic.length}/12 digit).
                            </p>
                          )}
                      </div>
                    )}
                  {formData.ic && /^\d{12}$/.test(formData.ic) && (
                    <p className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in flex items-center gap-1.5">
                      ✓ Format No. KP sah (Tarikh lahir, negeri & jantina dikesan automatik).
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    No. Sijil Kelahiran
                  </label>
                  <input
                    type="text"
                    name="noSijilLahir"
                    value={formData.noSijilLahir || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Tarikh Lahir
                  </label>
                  <input
                    type="date"
                    name="tarikhLahir"
                    value={formData.tarikhLahir || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Jantina
                  </label>
                  <select
                    name="jantina"
                    value={formData.jantina || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none"
                  >
                    <option value="">-- PILIH --</option>
                    <option value="LELAKI">LELAKI</option>
                    <option value="PEREMPUAN">PEREMPUAN</option>
                  </select>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Alamat Rumah 1
                    </label>
                    <input
                      type="text"
                      name="alamat1"
                      value={formData.alamat1 || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Alamat Rumah 2
                    </label>
                    <input
                      type="text"
                      name="alamat2"
                      value={formData.alamat2 || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Poskod <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="poskod"
                    inputMode="numeric"
                    maxLength={5}
                    value={formData.poskod || ''}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-mono font-bold focus:ring-4 transition-all text-slate-800 ${
                      formData.poskod && (formData.poskod.length < 5 || (formData.poskod.length === 5 && !formData.daerah))
                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  {formData.poskod && formData.poskod.length > 0 && formData.poskod.length < 5 && (
                    <p className="mt-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                      ⚠️ Poskod tidak lengkap ({formData.poskod.length}/5 digit). Sila masukkan 5 digit poskod.
                    </p>
                  )}
                  {formData.poskod && formData.poskod.length === 5 && !formData.daerah && (
                    <p className="mt-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                      ⚠️ Poskod salah atau tidak ditemui. Sila pastikan 5 digit poskod yang sah.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Daerah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="daerah"
                    readOnly
                    tabIndex={-1}
                    value={formData.daerah || ''}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Negeri <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="negeri"
                    readOnly
                    tabIndex={-1}
                    value={formData.negeri || ''}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                    Nama dan Alamat Sekolah Rendah
                  </label>
                  <textarea
                    name="namaSekolahRendah"
                    value={formData.namaSekolahRendah || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            LANGKAH 3 : MAKLUMAT IBU BAPA / PENJAGA
           ========================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-emerald-50 px-5 sm:px-10 py-4 border-b-2 border-emerald-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Langkah 3 daripada 5
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 mt-0.5">
                BAHAGIAN B : MAKLUMAT IBU BAPA / PENJAGA
              </h2>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 gap-4">
                <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">
                  1. Maklumat Bapa / Penjaga
                </h3>
                <div className="flex gap-3 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={copyAddressToBapa}
                    className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                  >
                    Salin Alamat Pemohon
                  </button>
                  <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      checked={tiadaBapa}
                      onChange={(e) => handleTiadaBapa(e as any)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />{' '}
                    Tiada Maklumat
                  </label>
                </div>
              </div>

              <div className={tiadaBapa ? 'hidden' : 'block'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-10">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Nama Bapa
                    </label>
                    <input
                      type="text"
                      name="namaBapa"
                      value={formData.namaBapa || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      No. Kad Pengenalan
                    </label>
                    <input
                      type="text"
                      name="icBapa"
                      autoComplete="off"
                      aria-autocomplete="none"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      value={formData.icBapa || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Warganegara
                    </label>
                    <input
                      type="text"
                      name="warganegaraBapa"
                      value={formData.warganegaraBapa || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Alamat Rumah 1
                      </label>
                      <input
                        type="text"
                        name="alamatBapa1"
                        value={formData.alamatBapa1 || ''}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Alamat Rumah 2
                      </label>
                      <input
                        type="text"
                        name="alamatBapa2"
                        value={formData.alamatBapa2 || ''}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Poskod
                    </label>
                    <input
                      type="text"
                      name="poskodBapa"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.poskodBapa || ''}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-4 py-3 font-mono font-bold focus:ring-4 transition-all text-slate-800 ${
                        formData.poskodBapa && formData.poskodBapa !== '-' && (formData.poskodBapa.length < 5 || (formData.poskodBapa.length === 5 && !formData.daerahBapa))
                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {formData.poskodBapa && formData.poskodBapa !== '-' && formData.poskodBapa.length > 0 && formData.poskodBapa.length < 5 && (
                      <p className="mt-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Poskod tidak lengkap ({formData.poskodBapa.length}/5 digit).
                      </p>
                    )}
                    {formData.poskodBapa && formData.poskodBapa !== '-' && formData.poskodBapa.length === 5 && !formData.daerahBapa && (
                      <p className="mt-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Poskod salah atau tidak ditemui.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Daerah
                    </label>
                    <input
                      type="text"
                      name="daerahBapa"
                      readOnly
                      tabIndex={-1}
                      value={formData.daerahBapa || ''}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Negeri
                    </label>
                    <input
                      type="text"
                      name="negeriBapa"
                      readOnly
                      tabIndex={-1}
                      value={formData.negeriBapa || ''}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      name="pekerjaanBapa"
                      value={formData.pekerjaanBapa || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      No. Telefon
                    </label>
                    <input
                      type="text"
                      name="telefonBapa"
                      value={formData.telefonBapa || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 gap-4 mt-8">
                <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">
                  2. Maklumat Ibu
                </h3>
                <div className="flex gap-3 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={copyAddressToIbu}
                    className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                  >
                    Salin Alamat Pemohon
                  </button>
                  <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      checked={tiadaIbu}
                      onChange={(e) => handleTiadaIbu(e as any)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />{' '}
                    Tiada Maklumat
                  </label>
                </div>
              </div>

              <div className={tiadaIbu ? 'hidden' : 'block'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Nama Ibu
                    </label>
                    <input
                      type="text"
                      name="namaIbu"
                      value={formData.namaIbu || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      No. Kad Pengenalan
                    </label>
                    <input
                      type="text"
                      name="icIbu"
                      autoComplete="off"
                      aria-autocomplete="none"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      value={formData.icIbu || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Warganegara
                    </label>
                    <input
                      type="text"
                      name="warganegaraIbu"
                      value={formData.warganegaraIbu || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Alamat Rumah 1
                      </label>
                      <input
                        type="text"
                        name="alamatIbu1"
                        value={formData.alamatIbu1 || ''}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Alamat Rumah 2
                      </label>
                      <input
                        type="text"
                        name="alamatIbu2"
                        value={formData.alamatIbu2 || ''}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Poskod
                    </label>
                    <input
                      type="text"
                      name="poskodIbu"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.poskodIbu || ''}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-4 py-3 font-mono font-bold focus:ring-4 transition-all text-slate-800 ${
                        formData.poskodIbu && formData.poskodIbu !== '-' && (formData.poskodIbu.length < 5 || (formData.poskodIbu.length === 5 && !formData.daerahIbu))
                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {formData.poskodIbu && formData.poskodIbu !== '-' && formData.poskodIbu.length > 0 && formData.poskodIbu.length < 5 && (
                      <p className="mt-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Poskod tidak lengkap ({formData.poskodIbu.length}/5 digit).
                      </p>
                    )}
                    {formData.poskodIbu && formData.poskodIbu !== '-' && formData.poskodIbu.length === 5 && !formData.daerahIbu && (
                      <p className="mt-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Poskod salah atau tidak ditemui.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Daerah
                    </label>
                    <input
                      type="text"
                      name="daerahIbu"
                      readOnly
                      tabIndex={-1}
                      value={formData.daerahIbu || ''}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Negeri
                    </label>
                    <input
                      type="text"
                      name="negeriIbu"
                      readOnly
                      tabIndex={-1}
                      value={formData.negeriIbu || ''}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase font-bold text-slate-700 bg-slate-100 cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      name="pekerjaanIbu"
                      value={formData.pekerjaanIbu || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                      No. Telefon
                    </label>
                    <input
                      type="text"
                      name="telefonIbu"
                      value={formData.telefonIbu || ''}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            LANGKAH 4 : MAKLUMAT AKADEMIK
           ========================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-emerald-50 px-5 sm:px-10 py-4 border-b-2 border-emerald-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Langkah 4 daripada 5
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 mt-0.5">
                BAHAGIAN C : MAKLUMAT AKADEMIK
              </h2>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <h3 className="font-extrabold text-slate-800 mb-5 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 uppercase tracking-widest text-sm">
                  a. Keputusan PBD (Akhir Tahun Darjah 5)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <label className="text-sm font-bold text-slate-700 uppercase">
                        {sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}
                      </label>
                      <select
                        name={`pbd.${sub}`}
                        value={(formData.pbd as any)?.[sub] || ''}
                        onChange={handleChange}
                        className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none"
                      >
                        <option value="">PILIH TP</option>
                        {[1, 2, 3, 4, 5, 6].map((tp) => (
                          <option key={tp} value={`TP${tp}`}>
                            TP {tp}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 mb-5 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 uppercase tracking-widest text-sm">
                  b. Keputusan PBD (Pertengahan Tahun Darjah 6)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <label className="text-sm font-bold text-slate-700 uppercase">
                        {sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}
                      </label>
                      <select
                        name={`pbdD6.${sub}`}
                        value={(formData.pbdD6 as any)?.[sub] || ''}
                        onChange={handleChange}
                        className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none"
                      >
                        <option value="">PILIH TP</option>
                        {[1, 2, 3, 4, 5, 6].map((tp) => (
                          <option key={tp} value={`TP${tp}`}>
                            TP {tp}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 mb-5 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 uppercase tracking-widest text-sm">
                  c. Keputusan UPKK
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { id: 'alquran', label: 'Al-Quran' },
                    { id: 'akidah', label: 'Akidah' },
                    { id: 'sirah', label: 'Sirah' },
                    { id: 'adab', label: 'Adab' },
                    { id: 'jawikhat', label: 'Jawi dan Khat' },
                    { id: 'bahasaarab', label: 'Bahasa Arab' },
                    { id: 'ibadah', label: 'Ibadah' },
                    { id: 'penghayatancarahidupislam', label: 'Penghayatan Cara Hidup Islam (PCHI)' },
                    { id: 'amalisolat', label: 'Amali Solat' },
                  ].map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <label className="text-sm font-bold text-slate-700 uppercase">{sub.label}</label>
                      <select
                        name={`upkk.${sub.id}`}
                        value={(formData.upkk as any)?.[sub.id] || ''}
                        onChange={handleChange}
                        className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 shrink-0 appearance-none"
                      >
                        <option value="">GRED</option>
                        {['A', 'B', 'C', 'D'].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            LANGKAH 5 : PENGESAHAN & HANTAR PERMOHONAN
           ========================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Kad Ringkasan Semakan Langkah 1 - 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 sm:px-10 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide">
                  Semakan Ringkas Maklumat Permohonan
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Klik mana-mana bahagian untuk mengemaskini
                </span>
              </div>
              <div className="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BORANG_STEPS.slice(0, 4).map((st) => {
                  const done = isStepCompleted(st.id);
                  return (
                    <div
                      key={st.id}
                      onClick={() => goToStep(st.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        done
                          ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                          : 'bg-amber-50/60 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            done
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-400 text-slate-900'
                          }`}
                        >
                          {done ? <Check className="w-4 h-4 stroke-[3]" /> : st.id}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {st.title}
                          </div>
                          <div
                            className={`text-[11px] font-semibold ${
                              done ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {done ? '✓ Telah diisi' : 'Sila semak / lengkapkan'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 underline shrink-0">
                        Ubah
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bahagian D : Perakuan & Pengesahan */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-emerald-50 px-5 sm:px-10 py-4 border-b-2 border-emerald-100">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  Langkah 5 daripada 5
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 mt-0.5">
                  BAHAGIAN D : PENGESAHAN & PERAKUAN PEMOHON
                </h2>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div
                  className={`flex gap-4 items-start p-5 sm:p-6 rounded-2xl border-2 transition-colors cursor-pointer ${
                    agreed
                      ? 'bg-emerald-50/70 border-emerald-500'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                  onClick={() => setAgreed(!agreed)}
                >
                  <div
                    className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      agreed
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {agreed && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>
                  <label className="text-sm text-slate-700 leading-relaxed font-medium cursor-pointer select-none">
                    <strong>i.</strong> Saya mengaku bahawa segala keterangan di atas adalah benar.
                    <br />
                    <br />
                    <strong>ii.</strong> Saya selaku penjaga pelajar di atas memohon agar pihak tuan mempertimbangkan permohonan anak saya dan saya bersedia akan menerima segala keputusan yang akan diputuskan oleh pihak sekolah.
                  </label>
                </div>

                {agreed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Tarikh Pengesahan
                      </label>
                      <input
                        type="text"
                        value={new Date().toLocaleDateString('ms-MY')}
                        disabled
                        className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">
                        Nama Pengesah (Ibu/Bapa/Penjaga)
                      </label>
                      <input
                        type="text"
                        value={formData.namaBapa || formData.namaIbu || ''}
                        readOnly
                        className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 uppercase"
                      />
                    </div>
                  </div>
                )}

                {getMissingFields().length > 0 && (
                  <div className="text-amber-800 bg-amber-50/90 px-5 py-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 font-bold text-sm text-amber-900">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>
                        Peringatan: Terdapat {getMissingFields().length} maklumat pilihan/tambahan yang belum diisi
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Sekiranya Gambar Pasport, Nama Penuh, dan No. Kad Pengenalan (12 digit) telah lengkap, calon tetap dibenarkan menghantar borang permohonan ini sekarang.
                    </p>
                    <details className="text-xs text-amber-800 mt-1 cursor-pointer">
                      <summary className="font-semibold underline">
                        Lihat senarai ruangan yang belum diisi ({getMissingFields().length})
                      </summary>
                      <ul className="list-disc list-inside font-medium mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 pl-2">
                        {getMissingFields().map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}

                {/* Kotak Jaminan Perlindungan Data & Privasi (PDPA) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3.5 shadow-2xs">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-emerald-950 space-y-1">
                    <p className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5 flex-wrap">
                      <span>Jaminan Perlindungan Data & Kerahsiaan Calon</span>
                      <span className="text-[10px] font-black uppercase text-emerald-700">
                        · Dilindungi SSL 256-Bit
                      </span>
                    </p>
                    <p className="leading-relaxed text-emerald-800 font-medium">
                      Semua maklumat calon (No. Kad Pengenalan, rekod akademik UPKK/PBD, maklumat peribadi ibu bapa & pendapatan) dilindungi mengikut prinsip Akta Perlindungan Data Peribadi (PDPA) dan Dasar Privasi Sekolah.
                    </p>
                    <p className="leading-relaxed text-emerald-700 text-[11px]">
                      🔒 Data anda disulitkan secara terus ke pelayan awan pangkalan data rasmi sekolah dan <strong>tidak didedahkan kepada pihak ketiga atau pelawat awam lain</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            BAR NAVIGASI BAWAH (SEBELUMNYA / SIMPAN DRAF / SETERUSNYA / HANTAR)
           ========================================================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
            {/* Kiri: Butang Sebelumnya & Kawalan Draf */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 sm:px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Simpan draf permohonan pada pelayar ini untuk disambung nanti"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>{isSavingDraft ? 'Menyimpan...' : 'Simpan Draf'}</span>
              </button>

              <button
                type="button"
                onClick={handleClearDraft}
                className="px-3.5 py-3 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Padam draf jika anda menggunakan komputer awam atau kafe siber demi keselamatan peribadi"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Padam Draf</span>
              </button>
            </div>

            {isClearedDraft && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg animate-in fade-in">
                ✓ Draf permohonan telah dipadam dari peranti ini.
              </span>
            )}

            {/* Kanan: Butang Seterusnya (Langkah 1-4) atau Hantar Permohonan (Langkah 5) */}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl text-sm sm:text-base transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Seterusnya: {BORANG_STEPS[currentStep]?.shortTitle}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${
                  isSubmitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/30 shadow-xl cursor-pointer'
                } text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-extrabold flex items-center justify-center gap-3 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>{isSubmitting ? 'Menghantar Secara Selamat...' : 'Hantar Permohonan'}</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-right pt-1 border-t border-slate-100">
            💡 <em>Menggunakan komputer awam / kafe siber?</em> Sebaik sahaja selesai menghantar atau mencetak, sila tutup tab atau klik <strong>Padam Draf</strong> untuk menghapuskan sebarang sisa rekod.
          </p>
        </div>
      </form>
    </div>
  );
}
