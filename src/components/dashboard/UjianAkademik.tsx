import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext, isDateActive } from '../../store';
import { AcademicQuestion, Candidate, AssessmentItem } from '../../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Play,
  Award,
  AlertCircle,
  Check,
  Sparkles,
  Image as ImageIcon,
  Eye,
  Send,
  ShieldCheck,
  HelpCircle,
  Calendar,
  Printer,
  Flag,
  ArrowUp,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { compressImageFile } from '../../lib/imageUtils';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const DEFAULT_SAMPLE_QUESTIONS: AcademicQuestion[] = [
  // BAHAGIAN 1 : MATEMATIK (5 soalan x 4 markah = 20 markah)
  {
    id: 'q_math_1',
    subjectId: 'matematik',
    questionText: 'Bundarkan 48,652 kepada ribu yang terdekat.',
    options: ['48,000', '48,600', '48,700', '49,000'],
    correctOptionIndex: 3,
    marks: 4
  },
  {
    id: 'q_math_2',
    subjectId: 'matematik',
    questionText: 'Sebuah kotak mengandungi 240 biji guli. 3/8 daripada guli itu berwarna merah dan selebihnya berwarna biru. Berapakah bilangan guli berwarna biru?',
    options: ['90 biji', '120 biji', '150 biji', '160 biji'],
    correctOptionIndex: 2,
    marks: 4
  },
  {
    id: 'q_math_3',
    subjectId: 'matematik',
    questionText: 'Harga sebuah buku rujukan ialah RM 35.00. Sempena jualan akhir tahun, diskaun sebanyak 20% diberikan. Berapakah harga selepas diskaun?',
    options: ['RM 25.00', 'RM 28.00', 'RM 30.00', 'RM 31.50'],
    correctOptionIndex: 1,
    marks: 4
  },
  {
    id: 'q_math_4',
    subjectId: 'matematik',
    questionText: 'Sebuah kereta bergerak dengan kelajuan purata 90 km/j selama 2 jam 30 minit. Berapakah jumlah jarak yang dilalui oleh kereta tersebut?',
    options: ['180 km', '205 km', '225 km', '240 km'],
    correctOptionIndex: 2,
    marks: 4
  },
  {
    id: 'q_math_5',
    subjectId: 'matematik',
    questionText: 'Panjang sebuah segi empat tepat ialah 12 cm dan lebarnya ialah 8 cm. Hitungkan perimeter segi empat tepat tersebut.',
    options: ['20 cm', '40 cm', '48 cm', '96 cm'],
    correctOptionIndex: 1,
    marks: 4
  },

  // BAHAGIAN 2 : SAINS (5 soalan x 4 markah = 20 markah)
  {
    id: 'q_sci_1',
    subjectId: 'sains',
    questionText: 'Apakah proses tumbuhan hijau membuat makanannya sendiri dengan kehadiran cahaya matahari, air, dan karbon dioksida?',
    options: ['Respirasi', 'Fotosintesis', 'Transpirasi', 'Kondensasi'],
    correctOptionIndex: 1,
    marks: 4
  },
  {
    id: 'q_sci_2',
    subjectId: 'sains',
    questionText: 'Antara mikroorganisma berikut, yang manakah digunakan dalam pembuatan roti dan tapai?',
    options: ['Bakteria', 'Virus', 'Yis (Kulat)', 'Protozoa'],
    correctOptionIndex: 2,
    marks: 4
  },
  {
    id: 'q_sci_3',
    subjectId: 'sains',
    questionText: 'Apakah perubahan keadaan jirim yang berlaku apabila titisan air terbentuk di permukaan luar gelas yang berisi air batu?',
    options: ['Peleburan', 'Penyejatan', 'Kondensasi', 'Pendidihan'],
    correctOptionIndex: 2,
    marks: 4
  },
  {
    id: 'q_sci_4',
    subjectId: 'sains',
    questionText: 'Planet manakah yang paling hampir dengan Matahari dalam Sistem Suria?',
    options: ['Zuhrah', 'Utarid', 'Bumi', 'Marikh'],
    correctOptionIndex: 1,
    marks: 4
  },
  {
    id: 'q_sci_5',
    subjectId: 'sains',
    questionText: 'Alat manakah yang menggunakan prinsip pantulan cahaya untuk melihat objek di sebalik tembok tinggi atau dari dalam kapal selam?',
    options: ['Mikroskop', 'Teleskop', 'Periskop', 'Kanta pembesar'],
    correctOptionIndex: 2,
    marks: 4
  },

  // BAHAGIAN 3 : PSIKOMETRIK (5 soalan x 4 markah = 20 markah)
  {
    id: 'q_psy_1',
    subjectId: 'psikometrik',
    questionText: 'Apabila menghadapi pelajaran atau ayat hafazan yang sukar, apakah tindakan pertama yang paling wajar anda lakukan?',
    options: [
      'Membiarkan bahagian tersebut kerana terlalu sukar',
      'Berusaha mengulang kaji secara berperingkat dan bertanya kepada guru',
      'Menunggu rakan menyiapkan tugasan terlebih dahulu',
      'Menukar jadual belajar mengikut mood semasa sahaja'
    ],
    correctOptionIndex: 1,
    marks: 4
  },
  {
    id: 'q_psy_2',
    subjectId: 'psikometrik',
    questionText: 'Jika rakan sebilik di asrama mengalami kesukaran menyesuaikan diri pada minggu pertama persekolahan, anda akan:',
    options: [
      'Tidak mencampuri urusan peribadi rakan tersebut',
      'Meminta rakan tersebut pulang ke rumah',
      'Memberi kata semangat, membantu rakan dan mengajak melakukan aktiviti bersama',
      'Mengadu terus kepada ibu bapa di rumah'
    ],
    correctOptionIndex: 2,
    marks: 4
  },
  {
    id: 'q_psy_3',
    subjectId: 'psikometrik',
    questionText: 'Bagaimanakah cara terbaik untuk menguruskan masa antara kelas hafazan al-Quran pada waktu pagi dan kelas akademik pada waktu tengah hari?',
    options: [
      'Menyusun jadual harian yang tetap, tidur awal dan mematuhi disiplin masa',
      'Menumpukan kepada satu subjek sahaja dan mengabaikan subjek lain',
      'Belajar pada saat-saat akhir sebelum peperiksaan bermula',
      'Bergantung sepenuhnya kepada ingatan tanpa membuat ulang kaji'
    ],
    correctOptionIndex: 0,
    marks: 4
  },
  {
    id: 'q_psy_4',
    subjectId: 'psikometrik',
    questionText: 'Semasa kerja berkumpulan di dalam kelas, seorang ahli kumpulan memberikan pendapat yang berbeza daripada pendapat anda. Apakah reaksi terbaik?',
    options: [
      'Menolak pendapat tersebut dengan serta-merta',
      'Mendengar dengan berhemah dan berbincang secara terbuka untuk mencari keputusan terbaik',
      'Keluar daripada kumpulan dan membuat kerja secara berseorangan',
      'Mendiamkan diri dan tidak lagi memberi kerjasama'
    ],
    correctOptionIndex: 1,
    marks: 4
  },
  {
    id: 'q_psy_5',
    subjectId: 'psikometrik',
    questionText: 'Apakah matlamat utama anda memohon kemasukan ke aliran Kelas Al-Quran dan Tahfiz (KBT) di sekolah menengah agama?',
    options: [
      'Kerana mengikut pilihan kawan semata-mata',
      'Ingin menguasai hafazan al-Quran, cemerlang dalam akademik serta membina sahsiah mulia',
      'Untuk mengelakkan daripada mengambil subjek yang banyak',
      'Tiada sebarang perancangan khusus'
    ],
    correctOptionIndex: 1,
    marks: 4
  }
];

export const DEFAULT_THREE_AKADEMIK_ITEMS: AssessmentItem[] = [
  { id: 'matematik', name: 'Matematik', weight: 20 },
  { id: 'sains', name: 'Sains', weight: 20 },
  { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
];

// Helper untuk memadankan soalan dengan komponen akademik walaupun ID berubah
export function matchQuestionToSubject(q: AcademicQuestion, item: AssessmentItem): boolean {
  if (q.subjectId === item.id) return true;
  const qSub = q.subjectId.toLowerCase();
  const itemName = item.name.toLowerCase();
  const itemId = item.id.toLowerCase();
  if (qSub.includes('mat') && (itemName.includes('mat') || itemId.includes('mat'))) return true;
  if (qSub.includes('sains') && (itemName.includes('sains') || itemId.includes('sains'))) return true;
  if (qSub.includes('psiko') && (itemName.includes('psiko') || itemId.includes('psiko'))) return true;
  return false;
}

// Pastikan soalan mempunyai kesemua 3 bahagian jika pengguna masih menggunakan soalan contoh lama (2 bahagian sahaja)
export function getEffectiveExamQuestions(
  storedQuestions: AcademicQuestion[] | undefined,
  akademikItems: AssessmentItem[]
): AcademicQuestion[] {
  if (!storedQuestions || storedQuestions.length === 0) {
    return DEFAULT_SAMPLE_QUESTIONS;
  }
  const hasPsikoItem = akademikItems.some(
    (i) => i.id.toLowerCase().includes('psiko') || i.name.toLowerCase().includes('psiko')
  );
  const hasPsikoQuestions = storedQuestions.some((q) =>
    q.subjectId.toLowerCase().includes('psiko')
  );
  if (hasPsikoItem && !hasPsikoQuestions) {
    const psikoSamples = DEFAULT_SAMPLE_QUESTIONS.filter((q) => q.subjectId === 'psikometrik');
    return [...storedQuestions, ...psikoSamples];
  }
  return storedQuestions;
}

// Helper mengira skor automatik mengikut wajaran setiap subjek dalam akademikItems
export function calculateAutoAcademicScores(
  questions: AcademicQuestion[],
  answers: Record<string, number>,
  akademikItems: AssessmentItem[]
) {
  const subjectScores: Record<string, number> = {};
  const details: Record<
    string,
    {
      betul: number;
      jumlahSoalan: number;
      skorMentah: number;
      skorPenuhMentah: number;
      markahAkhir: number;
      wajaranSubjek: number;
      namaSubjek: string;
    }
  > = {};

  akademikItems.forEach((item) => {
    const subQuestions = questions.filter((q) => matchQuestionToSubject(q, item));
    const jumlahSoalan = subQuestions.length;
    const skorPenuhMentah = subQuestions.reduce((acc, q) => acc + (Number(q.marks) || 1), 0);

    let betul = 0;
    let skorMentah = 0;

    subQuestions.forEach((q) => {
      const selected = answers[q.id];
      if (selected !== undefined && selected === q.correctOptionIndex) {
        betul += 1;
        skorMentah += Number(q.marks) || 1;
      }
    });

    let markahAkhir = 0;
    if (skorPenuhMentah > 0) {
      if (skorPenuhMentah === item.weight) {
        markahAkhir = skorMentah;
      } else {
        markahAkhir = Math.round((skorMentah / skorPenuhMentah) * item.weight);
      }
    }
    if (markahAkhir > item.weight) markahAkhir = item.weight;
    if (markahAkhir < 0) markahAkhir = 0;

    subjectScores[item.id] = markahAkhir;
    details[item.id] = {
      betul,
      jumlahSoalan,
      skorMentah,
      skorPenuhMentah,
      markahAkhir,
      wajaranSubjek: item.weight,
      namaSubjek: item.name
    };
  });

  const jumlah = Object.values(subjectScores).reduce((a, b) => a + b, 0);

  return {
    subjectScores,
    details,
    jumlah
  };
}

// ============================================================================
// 1. KOMPONEN PENGURUSAN SOALAN UJIAN AKADEMIK (UNTUK GURU AKADEMIK & ADMIN)
// ============================================================================
export function PengurusanSoalanAkademik({
  onLaunchCandidateExam
}: {
  onLaunchCandidateExam?: (candidateIc?: string) => void;
}) {
  const { settings, updateSettings, syncSettingsToServer, candidates, resetCandidateExamMark } = useAppContext();

  const akademikItems: AssessmentItem[] =
    settings.akademikItems && settings.akademikItems.length > 0
      ? settings.akademikItems
      : DEFAULT_THREE_AKADEMIK_ITEMS;

  const questions: AcademicQuestion[] = getEffectiveExamQuestions(
    settings.soalanAkademik,
    akademikItems
  );
  const [activeSubjectId, setActiveSubjectId] = useState<string>(akademikItems[0]?.id || 'matematik');
  const [editingQuestion, setEditingQuestion] = useState<AcademicQuestion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // State borang soalan
  const [formSubjectId, setFormSubjectId] = useState<string>(akademikItems[0]?.id || 'matematik');
  const [questionText, setQuestionText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [marks, setMarks] = useState<number>(4);
  const [saveBanner, setSaveBanner] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!akademikItems.some((i) => i.id === activeSubjectId) && akademikItems.length > 0) {
      setActiveSubjectId(akademikItems[0].id);
    }
  }, [akademikItems, activeSubjectId]);

  const showToast = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(''), 3500);
  };

  const handleSaveQuestionsToCloud = async (updatedQuestions: AcademicQuestion[], customMsg?: string) => {
    setIsSaving(true);
    try {
      updateSettings({ soalanAkademik: updatedQuestions });
      await syncSettingsToServer({ soalanAkademik: updatedQuestions });
      showToast(customMsg || 'Senarai soalan ujian berjaya disimpan!');
    } catch (e) {
      console.error('Ralat menyimpan soalan:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExamConfig = async (partial: Partial<typeof settings>, msg: string) => {
    setIsSaving(true);
    try {
      updateSettings(partial);
      await syncSettingsToServer(partial);
      showToast(msg);
    } catch (e) {
      console.error('Ralat menyimpan konfigurasi ujian:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const openNewQuestionForm = (subjectId?: string) => {
    setEditingQuestion(null);
    setFormError('');
    setFormSubjectId(subjectId || activeSubjectId || akademikItems[0]?.id || 'matematik');
    setQuestionText('');
    setImageUrl('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setMarks(4);
    setShowForm(true);
  };

  const openEditQuestionForm = (q: AcademicQuestion) => {
    setEditingQuestion(q);
    setFormError('');
    setFormSubjectId(q.subjectId);
    setQuestionText(q.questionText);
    setImageUrl(q.imageUrl || '');
    setOptions([
      q.options[0] || '',
      q.options[1] || '',
      q.options[2] || '',
      q.options[3] || ''
    ]);
    setCorrectOptionIndex(q.correctOptionIndex);
    setMarks(q.marks || 4);
    setShowForm(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!questionText.trim()) {
      setFormError('Sila masukkan teks penyataan soalan.');
      return;
    }
    const cleanedOptions = options.map((o) => o.trim());
    if (cleanedOptions.some((o) => !o)) {
      setFormError('Sila lengkapkan keempat-empat pilihan jawapan (A, B, C, dan D).');
      return;
    }

    const newQ: AcademicQuestion = {
      id: editingQuestion ? editingQuestion.id : `q_${Date.now()}`,
      subjectId: formSubjectId,
      questionText: questionText.trim(),
      imageUrl: imageUrl || undefined,
      options: cleanedOptions,
      correctOptionIndex,
      marks: Number(marks) || 1
    };

    const updated = editingQuestion
      ? questions.map((item) => (item.id === editingQuestion.id ? newQ : item))
      : [...questions, newQ];

    await handleSaveQuestionsToCloud(
      updated,
      editingQuestion ? 'Soalan berjaya dikemas kini!' : 'Soalan baharu berjaya ditambah!'
    );
    setActiveSubjectId(formSubjectId);
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    await handleSaveQuestionsToCloud(updated, 'Soalan telah dipadam.');
  };

  const handleLoadSampleQuestions = async () => {
    const mathItem =
      akademikItems.find((i) => i.name.toLowerCase().includes('mat') || i.id.toLowerCase().includes('mat')) ||
      akademikItems[0];
    const sciItem =
      akademikItems.find((i) => i.name.toLowerCase().includes('sains') || i.id.toLowerCase().includes('sains')) ||
      akademikItems[1] ||
      akademikItems[0];
    const psyItem =
      akademikItems.find((i) => i.name.toLowerCase().includes('psiko') || i.id.toLowerCase().includes('psiko')) ||
      akademikItems[2] ||
      { id: 'psikometrik', name: 'Psikometrik', weight: 20 };

    const mappedSamples = DEFAULT_SAMPLE_QUESTIONS.map((sq) => ({
      ...sq,
      id: `${sq.id}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      subjectId:
        sq.subjectId === 'matematik'
          ? mathItem.id
          : sq.subjectId === 'sains'
          ? sciItem.id
          : psyItem.id
    }));

    await handleSaveQuestionsToCloud(
      mappedSamples,
      '15 Soalan Contoh (Bahagian 1: Matematik, Bahagian 2: Sains & Bahagian 3: Psikometrik) berjaya dimuatkan!'
    );
  };

  const eligibleCandidates = candidates.filter((c) => c.statusTemuduga === 'LAYAK');
  const autoGradedCandidates = eligibleCandidates.filter((c) => c.markahAkademik?.autoGraded);
  const autoGradedCount = autoGradedCandidates.length;
  const evaluatedCount = eligibleCandidates.filter(
    (c) => c.markahAkademik && (c.markahAkademik.jumlah > 0 || c.markahAkademik.dinilaiOleh)
  ).length;

  const activeSubjectIdx = Math.max(
    0,
    akademikItems.findIndex((i) => i.id === activeSubjectId)
  );
  const activeSubject = akademikItems[activeSubjectIdx] || akademikItems[0];
  const subjectQuestions = questions.filter((q) =>
    activeSubject ? matchQuestionToSubject(q, activeSubject) : false
  );
  const totalRawMarksForSubject = subjectQuestions.reduce((acc, q) => acc + (Number(q.marks) || 1), 0);

  if (previewMode) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                Mod Pratonton Kertas Ujian & Cetakan Skema (Guru Akademik)
              </h4>
              <p className="text-xs text-amber-800">
                Paparan kertas soalan mengikut Bahagian 1 (Matematik), Bahagian 2 (Sains) & Bahagian 3 (Psikometrik) berserta fungsi cetakan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
          >
            Kembali ke Pembina Soalan
          </button>
        </div>

        <PortalUjianCalon isTeacherPreview onExitPreview={() => setPreviewMode(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {saveBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveBanner}</span>
          </div>
        </div>
      )}

      {/* Kad 1: Kawalan Bilik Ujian Akademik & Status Auto-Skor */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Sistem Ujian Akademik & Auto-Skor
                </h4>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    settings.ujianAkademikBuka
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {settings.ujianAkademikBuka ? '● UJIAN DIBUKA KEPADA CALON' : '● UJIAN DITUTUP'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Kertas ujian dibahagikan kepada{' '}
                <strong className="text-slate-800">
                  Bahagian 1 : Matematik, Bahagian 2 : Sains & Bahagian 3 : Psikometrik
                </strong>
                . Sebaik sahaja calon menghantar jawapan, markah dikira secara automatik dan terus dimasukkan ke dalam rekod{' '}
                <strong className="text-blue-700">Markah Akademik</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Pratonton Kertas Ujian & Cetak</span>
            </button>

            {onLaunchCandidateExam && (
              <button
                type="button"
                onClick={() => onLaunchCandidateExam()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Buka Kiosk Ujian Calon</span>
              </button>
            )}
          </div>
        </div>

        {/* Tetapan Pantas Bilik Ujian */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Toggle Buka / Tutup Ujian */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-slate-800">Status Portal Ujian Calon</span>
                {settings.tarikhBukaUjianAkademik && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {isDateActive(settings.tarikhBukaUjianAkademik, settings.tarikhTutupUjianAkademik)
                      ? '✓ Auto-Buka'
                      : '⏳ Auto-Tutup'}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {settings.ujianAkademikBuka
                  ? 'Menu "Ujian Akademik" dipaparkan kepada calon'
                  : 'Menu "Ujian Akademik" disembunyikan daripada calon'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={Boolean(settings.ujianAkademikBuka)}
                onChange={(e) =>
                  handleSaveExamConfig(
                    { ujianAkademikBuka: e.target.checked },
                    e.target.checked
                      ? 'Portal Ujian Akademik telah DIBUKA! Menu "Ujian Akademik" kini dipaparkan di bar navigasi utama.'
                      : 'Portal Ujian Akademik telah DITUTUP. Menu "Ujian Akademik" disembunyikan daripada paparan awam.'
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Tempoh Masa Ujian */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800">Tempoh Masa (Minit)</label>
              <span className="text-[11px] text-slate-500">Masa menjawab bagi setiap calon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={5}
                max={180}
                value={settings.masaUjianAkademikMinit || 30}
                onChange={(e) => {
                  const val = Math.max(5, parseInt(e.target.value) || 30);
                  handleSaveExamConfig(
                    { masaUjianAkademikMinit: val },
                    `Tempoh masa ujian ditetapkan kepada ${val} minit.`
                  );
                }}
                className="w-20 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-black text-center text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">min</span>
            </div>
          </div>

          {/* Kod PIN Bilik Ujian (Pilihan) */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-extrabold text-slate-800">Kod PIN Ujian (Pilihan)</label>
              <span className="text-[11px] text-slate-500 block truncate">
                Kosongkan jika tiada sekatan PIN
              </span>
            </div>
            <input
              type="text"
              placeholder="Tiada PIN"
              value={settings.pinUjianAkademik || ''}
              onChange={(e) => {
                const val = e.target.value.trim();
                updateSettings({ pinUjianAkademik: val });
              }}
              onBlur={(e) => {
                syncSettingsToServer({ pinUjianAkademik: e.target.value.trim() });
                showToast('Kod PIN bilik ujian telah dikemas kini.');
              }}
              className="w-28 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-center text-slate-900 placeholder:font-sans placeholder:font-normal"
            />
          </div>
        </div>

        {/* Jadual Buka / Tutup Automatik Portal Ujian Akademik */}
        <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-200/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <h5 className="text-xs font-extrabold text-slate-800">
                  Jadual Buka & Tutup Portal Ujian Secara Automatik (Pilihan)
                </h5>
                <p className="text-[11px] text-slate-500">
                  Jika tarikh ditetapkan, sistem akan membuka & menutup menu <strong>Ujian Akademik</strong> secara automatik mengikut tarikh semasa.
                </p>
              </div>
            </div>
            {(settings.tarikhBukaUjianAkademik || settings.tarikhTutupUjianAkademik) && (
              <button
                type="button"
                onClick={() =>
                  handleSaveExamConfig(
                    { tarikhBukaUjianAkademik: '', tarikhTutupUjianAkademik: '' },
                    'Jadual automatik dikosongkan. Kawalan kini secara manual sepenuhnya.'
                  )
                }
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-200 px-2.5 py-1 rounded-lg transition self-start sm:self-auto cursor-pointer"
              >
                Kosongkan Tarikh Auto
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tarikh Mula Buka Portal Ujian
              </label>
              <input
                type="date"
                value={settings.tarikhBukaUjianAkademik || ''}
                onChange={(e) => {
                  const start = e.target.value;
                  const end = settings.tarikhTutupUjianAkademik;
                  const autoOpen = start ? isDateActive(start, end) : settings.ujianAkademikBuka;
                  handleSaveExamConfig(
                    { tarikhBukaUjianAkademik: start, ujianAkademikBuka: autoOpen },
                    `Tarikh mula ujian ditetapkan (${start || 'tiada'}). Status semasa: ${autoOpen ? 'DIBUKA' : 'DITUTUP'}.`
                  );
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tarikh Akhir / Tutup Portal Ujian (Pilihan)
              </label>
              <input
                type="date"
                value={settings.tarikhTutupUjianAkademik || ''}
                onChange={(e) => {
                  const end = e.target.value;
                  const start = settings.tarikhBukaUjianAkademik || '';
                  const autoOpen = start ? isDateActive(start, end) : settings.ujianAkademikBuka;
                  handleSaveExamConfig(
                    { tarikhTutupUjianAkademik: end, ujianAkademikBuka: autoOpen },
                    `Tarikh tutup ujian ditetapkan (${end || 'tiada'}). Status semasa: ${autoOpen ? 'DIBUKA' : 'DITUTUP'}.`
                  );
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Statistik Ringkas Auto-Skor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-blue-700 uppercase">Jumlah Soalan Aktif</div>
            <div className="text-2xl font-black text-blue-950 mt-0.5">{questions.length} Soalan</div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-700 uppercase">Markah Penuh Akademik</div>
            <div className="text-2xl font-black text-emerald-950 mt-0.5">
              {akademikItems.reduce((a, b) => a + (b.weight || 0), 0)} Markah
            </div>
          </div>
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-indigo-700 uppercase">Selesai Jawab (Auto-Skor)</div>
            <div className="text-2xl font-black text-indigo-950 mt-0.5">
              {autoGradedCount} / {eligibleCandidates.length}
            </div>
          </div>
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-amber-800 uppercase">Jumlah Selesai Dinilai</div>
            <div className="text-2xl font-black text-amber-950 mt-0.5">
              {evaluatedCount} / {eligibleCandidates.length}
            </div>
          </div>
        </div>

        {/* Senarai Calon Yang Telah Menjawab Ujian Atas Talian (Beserta Fungsi Reset / Kembalikan Markah Asal) */}
        {autoGradedCandidates.length > 0 && (
          <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h5 className="text-xs font-extrabold text-indigo-950">
                  Senarai Calon Selesai Ujian Atas Talian ({autoGradedCandidates.length} Calon)
                </h5>
                <p className="text-[11px] text-indigo-800/80">
                  Jika anda hanya menguji sistem menggunakan No. KP calon atau mahu calon menjawab semula, klik <strong>Kembalikan Markah Asal / Reset</strong>.
                </p>
              </div>
            </div>
            <div className="divide-y divide-indigo-100 bg-white rounded-xl border border-indigo-100 overflow-hidden">
              {autoGradedCandidates.map((cand) => (
                <div
                  key={cand.ic}
                  className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{cand.name}</span>{' '}
                    <span className="font-mono text-slate-500">({cand.ic})</span>
                    <span className="ml-2 inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
                      Skor Ujian: {cand.markahAkademik?.jumlah ?? 0}m
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await resetCandidateExamMark(cand.ic);
                      showToast(`Markah akademik calon ${cand.name} (${cand.ic}) telah dikembalikan kepada asal!`);
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Kembalikan Markah Asal / Reset</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kad 2: Pembina Soalan Mengikut Bahagian (Bahagian 1: Matematik, Bahagian 2: Sains, Bahagian 3: Psikometrik) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tab Pilihan Bahagian */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {akademikItems.map((item, idx) => {
              const count = questions.filter((q) => matchQuestionToSubject(q, item)).length;
              const isSelected = activeSubject?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSubjectId(item.id);
                    setShowForm(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#1d3b8b] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>
                    Bahagian {idx + 1} : {item.name}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-extrabold ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-600'
                    }`}
                  >
                    {count} soalan · {item.weight}m
                  </span>
                </button>
              );
            })}
          </div>

          {/* Butang Tindakan */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleQuestions}
              disabled={isSaving}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Set Contoh 3 Bahagian</span>
            </button>
            <button
              type="button"
              onClick={() => openNewQuestionForm(activeSubject?.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                Tambah Soalan Bahagian {activeSubjectIdx + 1} ({activeSubject?.name})
              </span>
            </button>
          </div>
        </div>

        {/* Info Auto-Penyelarasan Wajaran Markah */}
        {activeSubject && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1d3b8b] shrink-0" />
              <span>
                <strong className="text-[#1d3b8b]">
                  Bahagian {activeSubjectIdx + 1} : {activeSubject.name}
                </strong>{' '}
                mempunyai <strong className="text-blue-700">{subjectQuestions.length} soalan objektif</strong>{' '}
                (Jumlah markah mentah: <strong>{totalRawMarksForSubject} markah</strong>).
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Wajaran Rasmi Bahagian {activeSubjectIdx + 1}: {activeSubject.weight} Markah
            </span>
          </div>
        )}

        {/* Borang Tambah / Kemas Kini Soalan */}
        {showForm && (
          <form
            onSubmit={handleSubmitQuestion}
            className="bg-blue-50/40 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-blue-200/70 pb-3">
              <h5 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{editingQuestion ? 'Kemas Kini Soalan Ujian' : 'Tambah Soalan Ujian Baharu'}</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingQuestion(null);
                  setFormError('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-white transition cursor-pointer"
              >
                Batal
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Bahagian Ujian Akademik</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                >
                  {akademikItems.map((item, idx) => (
                    <option key={item.id} value={item.id}>
                      Bahagian {idx + 1} : {item.name} ({item.weight} Markah)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pemberat Markah Soalan</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={marks}
                  onChange={(e) => setMarks(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penyataan / Teks Soalan *</label>
              <textarea
                rows={3}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Taip soalan ujian di sini..."
                className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-xl p-3.5 text-sm font-medium text-slate-800 outline-none"
              />
            </div>

            {/* Gambar Rajah Pilihan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-700">Gambar Rajah / Ilustrasi Soalan (Pilihan)</div>
                  <div className="text-[11px] text-slate-500">
                    Sesuai untuk soalan geometri Matematik, rajah eksperimen Sains atau visual Psikometrik
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <img src={imageUrl} alt="Rajah" className="h-10 w-14 object-contain rounded border border-slate-200 bg-slate-50" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                    >
                      Padam
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition">
                  <span>Muat Naik Rajah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const compressed = await compressImageFile(file, 700, 500, 0.8);
                        if (compressed) setImageUrl(compressed);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Pilihan Jawapan A, B, C, D */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawapan (Tandakan bulatan hijau pada <strong className="text-emerald-700">Jawapan Betul</strong>) *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter, idx) => {
                  const isCorrect = correctOptionIndex === idx;
                  return (
                    <div
                      key={letter}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectOptionIndex(idx)}
                        className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 transition cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-400 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Klik untuk tetapkan sebagai jawapan betul"
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        required
                        value={options[idx]}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = e.target.value;
                          setOptions(next);
                        }}
                        placeholder={`Pilihan ${letter}...`}
                        className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                      {isCorrect && (
                        <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-md shrink-0">
                          Betul ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingQuestion(null);
                  setFormError('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#1d3b8b] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingQuestion ? 'Simpan Perubahan Soalan' : 'Simpan Soalan Ini'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Senarai Soalan Bagi Bahagian Aktif */}
        {subjectQuestions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <h5 className="font-bold text-slate-700 text-sm">
                Tiada Soalan Bagi Bahagian {activeSubjectIdx + 1} : {activeSubject?.name}
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Klik butang <strong>+ Tambah Soalan</strong> di atas untuk membina soalan objektif, atau muatkan set soalan contoh 3 bahagian.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => openNewQuestionForm(activeSubject?.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Bina Soalan Pertama</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleQuestions}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Muatkan Contoh 3 Bahagian</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span className="text-base font-extrabold text-[#1d3b8b] w-6 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900 text-sm sm:text-base leading-relaxed">
                        {q.questionText}
                      </p>
                      {q.imageUrl && (
                        <img
                          src={q.imageUrl}
                          alt={`Rajah Soalan ${idx + 1}`}
                          className="max-h-44 rounded-xl border border-slate-200 bg-white p-2 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-extrabold text-[#1d3b8b] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      {q.marks || 1} markah
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditQuestionForm(q)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit soalan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Padam soalan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pl-0 sm:pl-9 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const letter = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1);
                    const isRight = q.correctOptionIndex === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 ${
                          isRight
                            ? 'bg-emerald-50/90 border border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-white text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border ${
                              isRight
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-white border-slate-400 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>
                        {isRight && (
                          <span className="text-[11px] font-extrabold text-emerald-700 shrink-0 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Jawapan Betul
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. PORTAL UJIAN CALON (GAYA KERTAS JAWAPAN KIRI + KERTAS SOALAN KANAN)
//    Bahagian 1 : Matematik | Bahagian 2 : Sains | Bahagian 3 : Psikometrik
// ============================================================================
export function PortalUjianCalon({
  preselectedIc,
  isTeacherPreview = false,
  onExitPreview,
  onCompleted
}: {
  preselectedIc?: string;
  isTeacherPreview?: boolean;
  onExitPreview?: () => void;
  onCompleted?: () => void;
}) {
  const { settings, candidates, updateCandidate, resetCandidateExamMark } = useAppContext();

  const akademikItems: AssessmentItem[] =
    settings.akademikItems && settings.akademikItems.length > 0
      ? settings.akademikItems
      : DEFAULT_THREE_AKADEMIK_ITEMS;

  const questions: AcademicQuestion[] = getEffectiveExamQuestions(
    settings.soalanAkademik,
    akademikItems
  );

  const [icInput, setIcInput] = useState(preselectedIc || '');
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isCheckingIc, setIsCheckingIc] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [examStarted, setExamStarted] = useState(isTeacherPreview);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || '');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState((settings.masaUjianAkademikMinit || 30) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnansweredConfirmModal, setShowUnansweredConfirmModal] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState('');
  const [printMode, setPrintMode] = useState<'NONE' | 'SOALAN_SAHAJA' | 'DENGAN_SKEMA' | 'KUNCI_SAHAJA'>('NONE');
  const [submittedResult, setSubmittedResult] = useState<{
    jumlah: number;
    maxTotal: number;
    details: Record<string, any>;
  } | null>(null);

  // Susun soalan mengikut Bahagian (Bahagian 1: Matematik, Bahagian 2: Sains, Bahagian 3: Psikometrik)
  // dengan nombor turutan berterusan (1, 2, 3... N) seperti dalam gambar rujukan
  const groupedSections = useMemo(() => {
    let globalCounter = 0;
    return akademikItems.map((item, sIdx) => {
      const subQuestions = questions.filter((q) => matchQuestionToSubject(q, item));
      const numberedQuestions = subQuestions.map((q) => {
        globalCounter += 1;
        return {
          question: q,
          globalNumber: globalCounter
        };
      });
      const rawMarks = subQuestions.reduce((acc, q) => acc + (Number(q.marks) || 1), 0);
      return {
        sectionNumber: sIdx + 1,
        title: `Bahagian ${sIdx + 1}: ${item.name}`,
        item,
        rawMarks,
        numberedQuestions
      };
    });
  }, [akademikItems, questions]);

  const allOrderedQuestions = useMemo(
    () => groupedSections.flatMap((s) => s.numberedQuestions),
    [groupedSections]
  );

  const totalQuestionsCount = allOrderedQuestions.length;

  // Jika preselectedIc diberikan, log masuk terus
  useEffect(() => {
    if (preselectedIc) {
      const clean = preselectedIc.replace(/[^a-zA-Z0-9]/g, '');
      const found = candidates.find((c) => c.ic?.replace(/[^a-zA-Z0-9]/g, '') === clean);
      if (found) {
        setActiveCandidate(found);
      }
    }
  }, [preselectedIc, candidates]);

  // Muatkan draf jawapan calon jika ada
  useEffect(() => {
    if (activeCandidate && examStarted) {
      try {
        const raw = localStorage.getItem(`eqabul_exam_draft_${activeCandidate.ic}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            setAnswers(parsed);
          }
        }
      } catch {}
    }
  }, [activeCandidate, examStarted]);

  // Pemasa Undur (Countdown Timer)
  useEffect(() => {
    if (!examStarted || submittedResult) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, submittedResult]);

  // Auto-submit apabila masa tamat
  useEffect(() => {
    if (examStarted && secondsLeft === 0 && !submittedResult && !isSubmitting) {
      executeFinalSubmit();
    }
  }, [secondsLeft, examStarted, submittedResult, isSubmitting]);

  // Kesan soalan aktif secara automatik mengikut skrol calon (supaya bulatan aktif pada Kertas jawapan turut bergerak ikut skrol)
  useEffect(() => {
    if (!examStarted || submittedResult || printMode === 'KUNCI_SAHAJA') return;

    const handleWindowScroll = () => {
      const viewportTriggerY = 240;
      let closestId = allOrderedQuestions[0]?.question.id || '';
      let smallestDistance = Infinity;

      for (const { question } of allOrderedQuestions) {
        const el = document.getElementById(`exam-q-${question.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - viewportTriggerY);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestId = question.id;
          }
        }
      }

      if (closestId) {
        setActiveQuestionId((prev) => (prev !== closestId ? closestId : prev));
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [examStarted, submittedResult, printMode, allOrderedQuestions]);

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!settings.ujianAkademikBuka && !preselectedIc && !isTeacherPreview) {
      setLoginError('Bilik Ujian Akademik masih belum dibuka oleh pihak sekolah.');
      return;
    }

    if (settings.pinUjianAkademik && settings.pinUjianAkademik.trim() !== '' && !preselectedIc) {
      if (pinInput.trim() !== settings.pinUjianAkademik.trim()) {
        setLoginError('Kod PIN Bilik Ujian tidak tepat. Sila dapatkan Kod PIN daripada Guru Pengawas.');
        return;
      }
    }

    const cleanIc = icInput.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanIc) {
      setLoginError('Sila masukkan No. Kad Pengenalan yang sah.');
      return;
    }

    setIsCheckingIc(true);
    try {
      // 1. Semak memori tempatan jika Admin sedang log masuk
      let found: Candidate | null =
        candidates.find((c) => c.ic?.replace(/[^a-zA-Z0-9]/g, '') === cleanIc) || null;

      // 2. Jika pelawat awam (candidates kosong atas faktor keselamatan), semak terus dari Firestore
      if (!found) {
        const docRef = doc(db, 'candidates', cleanIc);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          found = { id: docSnap.id, ...docSnap.data() } as Candidate;
        }
      }

      if (!found) {
        const q = query(collection(db, 'candidates'), where('ic', '==', cleanIc), limit(1));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const d = qSnap.docs[0];
          found = { id: d.id, ...d.data() } as Candidate;
        }
      }

      if (!found && icInput.trim() !== cleanIc) {
        const q2 = query(collection(db, 'candidates'), where('ic', '==', icInput.trim()), limit(1));
        const q2Snap = await getDocs(q2);
        if (!q2Snap.empty) {
          const d2 = q2Snap.docs[0];
          found = { id: d2.id, ...d2.data() } as Candidate;
        }
      }

      if (!found) {
        setLoginError('Rekod No. Kad Pengenalan tidak ditemui dalam sistem.');
        return;
      }

      if (found.statusTemuduga !== 'LAYAK') {
        setLoginError('Maaf, hanya calon yang berstatus LAYAK TEMUDUGA dibenarkan menduduki ujian ini.');
        return;
      }

      setActiveCandidate(found);
    } catch (err) {
      console.error('Ralat menyemak IC calon:', err);
      setLoginError('Ralat menyemak maklumat calon. Sila cuba sekali lagi.');
    } finally {
      setIsCheckingIc(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setActiveQuestionId(questionId);
    const next = { ...answers, [questionId]: optionIdx };
    setAnswers(next);
    if (activeCandidate) {
      try {
        localStorage.setItem(`eqabul_exam_draft_${activeCandidate.ic}`, JSON.stringify(next));
      } catch {}
    }
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const scrollToQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    if (printMode === 'KUNCI_SAHAJA') {
      setPrintMode('NONE');
    }
    setTimeout(() => {
      const el = document.getElementById(`exam-q-${questionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 30);
  };

  const triggerPrint = (mode: 'SOALAN_SAHAJA' | 'DENGAN_SKEMA' | 'KUNCI_SAHAJA') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 180);
  };

  const answeredCount = useMemo(
    () =>
      allOrderedQuestions.filter(({ question }) => answers[question.id] !== undefined).length,
    [allOrderedQuestions, answers]
  );

  const unansweredCount = Math.max(0, totalQuestionsCount - answeredCount);

  // Klik butang Hantar Jawapan (tanpa guna window.confirm supaya berfungsi lancar dalam semua pelayar/iframe)
  const handleRequestSubmit = () => {
    if (isSubmitting) return;
    setSubmitErrorMsg('');
    if (unansweredCount > 0 && !isTeacherPreview) {
      setShowUnansweredConfirmModal(true);
      return;
    }
    executeFinalSubmit();
  };

  const executeFinalSubmit = async () => {
    if (isSubmitting) return;
    setShowUnansweredConfirmModal(false);
    setSubmitErrorMsg('');
    setIsSubmitting(true);

    try {
      const { subjectScores, details, jumlah } = calculateAutoAcademicScores(
        questions,
        answers,
        akademikItems
      );
      const maxTotal = akademikItems.reduce((a, b) => a + (b.weight || 0), 0);

      if (activeCandidate && !isTeacherPreview) {
        const summaryNote = Object.values(details)
          .map(
            (d) =>
              `${d.namaSubjek}: ${d.markahAkhir}/${d.wajaranSubjek} (Betul ${d.betul}/${d.jumlahSoalan})`
          )
          .join(' | ');

        const targetId = activeCandidate.ic || activeCandidate.id;
        const previousManualBackup =
          (activeCandidate.markahAkademik as any)?.sandaranMarkahAsal ||
          (activeCandidate.markahAkademik && !activeCandidate.markahAkademik.autoGraded
            ? { ...activeCandidate.markahAkademik }
            : undefined);

        await updateCandidate(targetId, {
          markahAkademik: {
            ...(activeCandidate.markahAkademik || {}),
            ...(previousManualBackup ? { sandaranMarkahAsal: previousManualBackup } : {}),
            ...subjectScores,
            jumlah,
            dinilaiOleh: 'Sistem Auto-Skor (Ujian Atas Talian)',
            tarikhDinilai: new Date().toISOString(),
            catatan: `Auto-Skor Ujian: ${summaryNote}`,
            autoGraded: true,
            jawapanCalon: answers,
            butiranSkor: details
          }
        });

        try {
          localStorage.removeItem(`eqabul_exam_draft_${activeCandidate.ic}`);
        } catch {}
      }

      setSubmittedResult({
        jumlah,
        maxTotal,
        details
      });

      // Skrol ke atas supaya kad keputusan terus kelihatan
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
    } catch (err) {
      console.error('Ralat menghantar jawapan ujian:', err);
      setSubmitErrorMsg('Gagal menghantar jawapan ke pelayan. Sila tekan Hantar Jawapan sekali lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (totalQuestionsCount === 0) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
        <HelpCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-extrabold text-slate-900">Tiada Soalan Ujian Ditetapkan</h3>
        <p className="text-sm text-slate-600">
          Guru Akademik belum memasukkan sebarang soalan ujian buat masa ini.
        </p>
        {onExitPreview && (
          <button
            type="button"
            onClick={onExitPreview}
            className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Kembali
          </button>
        )}
      </div>
    );
  }

  // PAPARAN KEPUTUSAN SELEPAS HANTAR
  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-white rounded-3xl border border-emerald-200 shadow-lg overflow-hidden animate-in zoom-in-95">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-emerald-100" />
          <h3 className="text-2xl font-extrabold">Jawapan Ujian Berjaya Dihantar!</h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {isTeacherPreview
              ? 'Simulasi selesai. Dalam mod sebenar, markah ini terus direkodkan ke dalam pangkalan data.'
              : 'Markah anda telah dikira secara automatik dan direkodkan terus ke dalam sistem Penilaian Akademik.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {activeCandidate && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Nama Calon</div>
                <div className="font-extrabold text-slate-900 text-base">{activeCandidate.name}</div>
                <div className="text-xs font-mono text-slate-600">{activeCandidate.ic}</div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                Auto-Direkodkan ✓
              </span>
            </div>
          )}

          {/* Pecahan Skor Mengikut Bahagian */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Ringkasan Markah Akademik Mengikut Bahagian (Auto-Skor)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(submittedResult.details).map((d: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="text-[11px] font-bold text-[#1d3b8b] uppercase">
                      Bahagian {idx + 1}
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm">{d.namaSubjek}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Betul: <strong>{d.betul}</strong> / {d.jumlahSoalan} soalan
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">Markah:</span>
                    <div>
                      <span className="text-2xl font-black text-[#1d3b8b]">{d.markahAkhir}</span>
                      <span className="text-xs font-bold text-slate-500"> / {d.wajaranSubjek}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1d3b8b] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase">Jumlah Keseluruhan Markah Akademik</div>
                <div className="text-[11px] text-blue-200/90">Telah dimasukkan secara automatik ke dalam sistem</div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-amber-300">{submittedResult.jumlah}</span>
                <span className="text-sm font-bold text-blue-200"> / {submittedResult.maxTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isTeacherPreview && (
              <button
                type="button"
                onClick={() => {
                  setSubmittedResult(null);
                  setAnswers({});
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Cuba Semula Kertas Soalan
              </button>
            )}
            {activeCandidate && !isTeacherPreview && (
              <button
                type="button"
                onClick={async () => {
                  await resetCandidateExamMark(activeCandidate.ic);
                  setSubmittedResult(null);
                  setExamStarted(false);
                  setAnswers({});
                  setActiveCandidate(null);
                  setIcInput('');
                }}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Batalkan ujian percubaan ini dan kembalikan markah asal calon"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Kembalikan Markah Asal (Jika Sekadar Ujian)</span>
              </button>
            )}
            {onExitPreview ? (
              <button
                type="button"
                onClick={onExitPreview}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Kembali ke Panel Guru Akademik
              </button>
            ) : onCompleted ? (
              <button
                type="button"
                onClick={onCompleted}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Selesai & Kembali
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveCandidate(null);
                  setExamStarted(false);
                  setSubmittedResult(null);
                  setAnswers({});
                  setIcInput('');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Log Keluar Bilik Ujian
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: LOG MASUK CALON (JIKA BELUM LOG MASUK & BUKAN PREVIEW GURU)
  if (!activeCandidate && !isTeacherPreview) {
    return (
      <div className="max-w-xl mx-auto my-8 px-4 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#084e36] via-[#0d6e4d] to-[#084e36] p-6 sm:p-8 text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Portal Ujian Temuduga Akademik
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              SMA Kota Gelanggi 3 · Pengambilan Tingkatan 1 Sesi {settings.sesiKemasukan || '2027'}
            </p>
          </div>

          <form onSubmit={handleCandidateLogin} className="p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                No. Kad Pengenalan Calon (Tanpa Sengkang)
              </label>
              <input
                type="text"
                required
                value={icInput}
                onChange={(e) => setIcInput(e.target.value)}
                placeholder="Contoh: 140101061234"
                className="w-full border-2 border-slate-200 focus:border-emerald-600 rounded-xl px-4 py-3 text-base font-bold text-slate-900 bg-slate-50 focus:bg-white outline-none transition"
              />
            </div>

            {settings.pinUjianAkademik && settings.pinUjianAkademik.trim() !== '' && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kod PIN Bilik Ujian
                </label>
                <input
                  type="text"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan Kod PIN daripada Guru Pengawas"
                  className="w-full border-2 border-slate-200 focus:border-emerald-600 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-none transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isCheckingIc}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCheckingIc ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyemak Kelayakan Calon...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Semak & Masuk Bilik Ujian</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // JIKA CALON SUDAH PERNAH MENJAWAB UJIAN INI
  if (activeCandidate && activeCandidate.markahAkademik?.autoGraded && !examStarted) {
    return (
      <div className="max-w-xl mx-auto my-8 px-4 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-lg p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Anda Telah Selesai Menjawab Ujian Ini
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rekod jawapan dan markah akademik bagi <strong>{activeCandidate.name}</strong> ({activeCandidate.ic}) telah pun disimpan di dalam sistem.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-emerald-900">
            Status Penilaian Akademik: SELESAI DIREKODKAN SECARA AUTOMATIK
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await resetCandidateExamMark(activeCandidate.ic);
                setActiveCandidate((prev) =>
                  prev
                    ? {
                        ...prev,
                        markahAkademik: (prev.markahAkademik as any)?.sandaranMarkahAsal || undefined
                      }
                    : null
                );
                setAnswers({});
              }}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Kembalikan Markah Asal / Jawab Semula</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCandidate(null);
                setIcInput('');
              }}
              className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: SKRIN TAKLIMAT SEBELUM MULA MENJAWAB
  if (activeCandidate && !examStarted) {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Pengesahan Identiti Calon
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {activeCandidate.name}
              </h3>
              <p className="text-xs font-mono text-slate-500">No. KP: {activeCandidate.ic}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#1d3b8b] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                {totalQuestionsCount} Soalan Keseluruhan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {groupedSections.map((sec) => (
              <div key={sec.item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-[11px] font-extrabold text-[#1d3b8b] uppercase">
                  Bahagian {sec.sectionNumber}
                </div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{sec.item.name}</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">
                  {sec.numberedQuestions.length} Soalan · {sec.item.weight} Markah
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5 leading-relaxed">
            <div className="font-extrabold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Arahan Menjawab ({settings.masaUjianAkademikMinit || 30} Minit):</span>
            </div>
            <p>
              1. Kertas soalan ini mengandungi{' '}
              <strong>
                {groupedSections.map((s) => `Bahagian ${s.sectionNumber}: ${s.item.name}`).join(', ')}
              </strong>
              .
            </p>
            <p>2. Klik pada pilihan jawapan (A, B, C, atau D) yang paling tepat bagi setiap soalan.</p>
            <p>3. Anda boleh menyemak status jawapan melalui panel <strong>Kertas jawapan</strong> di sebelah kiri.</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveCandidate(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Tukar Calon
            </button>
            <button
              type="button"
              onClick={() => {
                setSecondsLeft((settings.masaUjianAkademikMinit || 30) * 60);
                setExamStarted(true);
              }}
              className="bg-[#1d3b8b] hover:bg-blue-900 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Buka Kertas Soalan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // STEP 3: ANTARAMUKA KERTAS JAWAPAN (KIRI - BERGERAK IKUT SKROL CALON)
  //         & KERTAS SOALAN (KANAN)
  // ==========================================================================
  return (
    <div id="exam-paper-top" className="max-w-6xl mx-auto my-4 px-2 sm:px-4 animate-in fade-in">
      {/* Modal Pengesahan Dalam Aplikasi Jika Ada Soalan Belum Dijawab */}
      {showUnansweredConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Masih Ada {unansweredCount} Soalan Belum Dijawab
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Anda telah menjawab <strong>{answeredCount}</strong> daripada{' '}
                  <strong>{totalQuestionsCount}</strong> soalan. Adakah anda pasti mahu menghantar kertas jawapan sekarang?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUnansweredConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Semak Semula Soalan
              </button>
              <button
                type="button"
                onClick={executeFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#1d3b8b] hover:bg-blue-900 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ya, Hantar Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mesej Ralat Hantar (Jika Ada) */}
      {submitErrorMsg && (
        <div className="mb-3 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{submitErrorMsg}</span>
          </div>
        </div>
      )}

      {/* Bar Maklumat Calon & Masa (Melekat di Atas Semasa Calon Skrol) */}
      <div className="sticky top-[var(--header-height,86px)] z-30 bg-white/95 backdrop-blur-md rounded-t-2xl border border-slate-300 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#1d3b8b] text-white font-black text-xs flex items-center justify-center shrink-0">
            {answeredCount}/{totalQuestionsCount}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {activeCandidate ? activeCandidate.name : 'Mod Pratonton Kertas Soalan (Guru Akademik)'}
            </div>
            <div className="text-[11px] text-slate-500">
              {activeCandidate ? `No. KP: ${activeCandidate.ic} · ` : ''}
              Dijawab: <strong className="text-[#1d3b8b]">{answeredCount}</strong> daripada{' '}
              <strong>{totalQuestionsCount}</strong> soalan
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={`px-3.5 py-2 rounded-xl font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 border ${
              secondsLeft < 180
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-[#1d3b8b]" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={handleRequestSubmit}
            disabled={isSubmitting}
            className="bg-[#1d3b8b] hover:bg-blue-900 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghantar...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Hantar Jawapan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Kontena Utama: TIADA overflow-hidden supaya position:sticky pada Kertas jawapan bergerak lancar ikut skrol calon */}
      <div className="bg-white border border-t-0 border-slate-300 rounded-b-2xl shadow-sm flex flex-col lg:flex-row items-stretch min-h-[760px] print:border-0 print:shadow-none">
        {/* ===================================================================
            LAJUR KIRI: KERTAS JAWAPAN (MELEKAT & BERGERAK IKUT SKROL CALON)
           =================================================================== */}
        <aside className="w-full lg:w-[275px] xl:w-[295px] shrink-0 bg-[#eff1f7] border-b lg:border-b-0 lg:border-r-[3px] border-[#8b6f56]/50 lg:rounded-bl-2xl p-5 sm:p-6 print:hidden">
          <div className="lg:sticky lg:top-[calc(var(--header-height,86px)+74px)] space-y-6">
            <h3 className="text-[#1d3b8b] font-extrabold text-base sm:text-lg tracking-tight">
              Kertas jawapan
            </h3>

            {/* Senarai Bahagian & Bulatan Nombor Soalan */}
            <div className="space-y-6">
              {groupedSections.map((section) => (
                <div key={section.item.id} className="space-y-3">
                  <div className="text-xs sm:text-[13px] font-semibold text-slate-600">
                    Bahagian {section.sectionNumber}: {section.item.name}
                  </div>

                  {section.numberedQuestions.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic">Tiada soalan</div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2.5 max-w-[230px]">
                      {section.numberedQuestions.map(({ question, globalNumber }) => {
                        const isAnswered = answers[question.id] !== undefined;
                        const isFlagged = Boolean(flaggedQuestions[question.id]);
                        const isActive = activeQuestionId === question.id;
                        const selectedLetter =
                          isAnswered ? ['A', 'B', 'C', 'D'][answers[question.id]] : null;

                        return (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() => scrollToQuestion(question.id)}
                            title={
                              selectedLetter
                                ? `Soalan ${globalNumber}: Dijawab (${selectedLetter})`
                                : `Soalan ${globalNumber}: Belum dijawab`
                            }
                            className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer select-none ${
                              isAnswered
                                ? 'bg-[#1d3b8b] border-[1.5px] border-[#1d3b8b] text-white shadow-2xs'
                                : 'bg-white border-[1.5px] border-slate-600 text-slate-800 hover:border-[#1d3b8b] hover:text-[#1d3b8b]'
                            } ${isActive ? 'ring-2 ring-offset-2 ring-[#1d3b8b]/70 scale-105' : ''}`}
                          >
                            <span>{globalNumber}</span>

                            {/* Titik Jingga (Ditanda untuk semakan - seperti nombor 15 & 17 dalam gambar) */}
                            {isFlagged && (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-[#e67e22] border border-white absolute -top-0.5 -right-0.5"
                                title="Ditanda untuk semakan"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Petunjuk Status, Butang Hantar Jawapan & Pautan Kembali Ke Atas */}
            <div className="pt-4 border-t border-slate-300/80 space-y-3.5 text-[11px] text-slate-600">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-600 inline-block shrink-0" />
                  <span>Belum dijawab ({unansweredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#1d3b8b] border border-[#1d3b8b] inline-block shrink-0" />
                  <span>Telah dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative w-4 h-4 rounded-full bg-white border border-slate-600 inline-block shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#e67e22] absolute -top-0.5 -right-0.5" />
                  </span>
                  <span>Ditanda untuk semakan</span>
                </div>
              </div>

              {/* Butang Hantar Jawapan Terus Dalam Panel Kertas Jawapan */}
              <button
                type="button"
                onClick={handleRequestSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#1d3b8b] hover:bg-blue-900 disabled:bg-slate-400 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghantar...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Hantar Jawapan ({answeredCount}/{totalQuestionsCount})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#1d3b8b] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Kembali ke atas</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ===================================================================
            LAJUR KANAN: KERTAS SOALAN (BAHAGIAN 1, BAHAGIAN 2 & BAHAGIAN 3)
           =================================================================== */}
        <div className="flex-1 bg-white lg:rounded-br-2xl p-5 sm:p-8 lg:p-10 space-y-10">
          {/* Bar Butang Cetakan (Untuk Guru Akademik / Admin - Sama Seperti Dalam Gambar) */}
          {isTeacherPreview && (
            <div className="flex flex-wrap items-center gap-2.5 pb-2 print:hidden">
              <button
                type="button"
                onClick={() => triggerPrint('SOALAN_SAHAJA')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                  printMode === 'SOALAN_SAHAJA'
                    ? 'bg-blue-50 border-[#1d3b8b] text-[#1d3b8b] font-bold'
                    : 'bg-white border-[#8fa3c7] text-[#1d3b8b] hover:bg-blue-50/50'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak soalan sahaja</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPrint('DENGAN_SKEMA')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                  printMode === 'DENGAN_SKEMA'
                    ? 'bg-blue-50 border-[#1d3b8b] text-[#1d3b8b] font-bold'
                    : 'bg-white border-[#8fa3c7] text-[#1d3b8b] hover:bg-blue-50/50'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak dengan skema</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPrint('KUNCI_SAHAJA')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                  printMode === 'KUNCI_SAHAJA'
                    ? 'bg-blue-50 border-[#1d3b8b] text-[#1d3b8b] font-bold'
                    : 'bg-white border-[#8fa3c7] text-[#1d3b8b] hover:bg-blue-50/50'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak kunci jawapan sahaja</span>
              </button>

              {printMode !== 'NONE' && (
                <button
                  type="button"
                  onClick={() => setPrintMode('NONE')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer"
                >
                  Paparan Biasa
                </button>
              )}
            </div>
          )}

          {/* JIKA MOD CETAK KUNCI JAWAPAN SAHAJA DIPILIH */}
          {printMode === 'KUNCI_SAHAJA' ? (
            <div className="space-y-6">
              <div className="border-b-2 border-[#1d3b8b] pb-3">
                <h2 className="text-xl font-extrabold text-[#1d3b8b]">
                  Kunci Jawapan Rasmi — Ujian Akademik Tingkatan 1
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  SMA Kota Gelanggi 3 · Bahagian 1 (Matematik), Bahagian 2 (Sains) & Bahagian 3 (Psikometrik)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {groupedSections.map((sec) => (
                  <div key={sec.item.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-extrabold text-[#1d3b8b] text-sm">
                        Bahagian {sec.sectionNumber}: {sec.item.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-semibold">{sec.item.weight} markah</span>
                    </div>
                    <div className="space-y-2">
                      {sec.numberedQuestions.map(({ question, globalNumber }) => {
                        const correctLetter = ['A', 'B', 'C', 'D'][question.correctOptionIndex] || 'A';
                        return (
                          <div
                            key={question.id}
                            className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-100 last:border-0"
                          >
                            <span className="font-extrabold text-[#1d3b8b]">Soalan {globalNumber}</span>
                            <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                              {correctLetter} ({question.marks || 1}m)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* PAPARAN KERTAS SOALAN PENUH MENGIKUT BAHAGIAN */
            <div className="space-y-12">
              {groupedSections.map((section) => (
                <section key={section.item.id} className="space-y-6">
                  {/* Kepala Bahagian (Gaya Gambar Rujukan) */}
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d3b8b] tracking-tight">
                        Bahagian {section.sectionNumber}: {section.item.name}
                      </h2>
                      <span className="text-sm sm:text-base font-medium text-slate-600 shrink-0">
                        {section.item.weight} markah
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                      Pilih satu jawapan yang paling tepat bagi setiap soalan.
                    </p>
                    <div className="border-b-[1.5px] border-[#3b5998] mt-3" />
                  </div>

                  {/* Senarai Soalan Dalam Bahagian Ini */}
                  {section.numberedQuestions.length === 0 ? (
                    <div className="py-6 text-sm text-slate-400 italic">
                      Tiada soalan ditetapkan untuk bahagian ini.
                    </div>
                  ) : (
                    <div className="space-y-8 divide-y divide-slate-100">
                      {section.numberedQuestions.map(({ question, globalNumber }) => {
                        const selectedIdx = answers[question.id];
                        const isFlagged = Boolean(flaggedQuestions[question.id]);

                        return (
                          <div
                            key={question.id}
                            id={`exam-q-${question.id}`}
                            className="pt-6 first:pt-2 flex items-start gap-4 sm:gap-7 scroll-mt-36"
                          >
                            {/* Nombor Soalan di Sebelah Kiri (Biru Gelap Tebal) */}
                            <div className="w-7 text-left shrink-0 select-none pt-0.5">
                              <span className="text-base sm:text-lg font-extrabold text-[#1d3b8b]">
                                {globalNumber}
                              </span>
                            </div>

                            {/* Kandungan Soalan & Pilihan Jawapan A, B, C, D */}
                            <div className="flex-1 space-y-4 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm sm:text-[15.5px] text-slate-900 font-medium leading-relaxed">
                                  {question.questionText}
                                </p>

                                {/* Butang Tandakan Semakan (Titik Jingga pada Kertas Jawapan) */}
                                <button
                                  type="button"
                                  onClick={() => toggleFlagQuestion(question.id)}
                                  title={
                                    isFlagged
                                      ? 'Buang tanda semakan'
                                      : 'Tandakan soalan ini untuk disemak semula'
                                  }
                                  className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer print:hidden ${
                                    isFlagged
                                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                                      : 'bg-white border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                                  }`}
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">
                                    {isFlagged ? 'Ditanda' : 'Semak'}
                                  </span>
                                </button>
                              </div>

                              {/* Gambar Rajah Soalan (Jika Ada) */}
                              {question.imageUrl && (
                                <div className="py-1">
                                  <img
                                    src={question.imageUrl}
                                    alt={`Rajah Soalan ${globalNumber}`}
                                    className="max-h-60 object-contain rounded-xl border border-slate-200 bg-slate-50 p-2"
                                  />
                                </div>
                              )}

                              {/* Pilihan Jawapan (A), (B), (C), (D) */}
                              <div className="space-y-2.5 pt-1">
                                {question.options.map((opt, oIdx) => {
                                  const letter = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1);
                                  const isSelected = selectedIdx === oIdx;
                                  const isSchemaCorrect =
                                    printMode === 'DENGAN_SKEMA' && question.correctOptionIndex === oIdx;

                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => handleSelectOption(question.id, oIdx)}
                                      className={`w-full text-left py-2 px-2.5 -ml-2.5 rounded-xl transition-all flex items-center gap-3.5 cursor-pointer group ${
                                        isSelected
                                          ? 'bg-blue-50/80 text-slate-950'
                                          : isSchemaCorrect
                                          ? 'bg-emerald-50/90 text-emerald-950'
                                          : 'hover:bg-slate-50 text-slate-800'
                                      }`}
                                    >
                                      <span
                                        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center shrink-0 transition-all ${
                                          isSelected
                                            ? 'bg-[#1d3b8b] border-[1.5px] border-[#1d3b8b] text-white font-bold shadow-2xs'
                                            : isSchemaCorrect
                                            ? 'bg-emerald-600 border-[1.5px] border-emerald-600 text-white font-bold'
                                            : 'bg-white border-[1.5px] border-slate-400 text-slate-600 font-semibold group-hover:border-[#1d3b8b] group-hover:text-[#1d3b8b]'
                                        }`}
                                      >
                                        {letter}
                                      </span>

                                      <span
                                        className={`text-sm sm:text-[15px] leading-snug flex-1 ${
                                          isSelected || isSchemaCorrect ? 'font-bold' : 'font-normal'
                                        }`}
                                      >
                                        {opt}
                                      </span>

                                      {isSchemaCorrect && (
                                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                                          Skema Jawapan ✓
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* Bahagian Bawah Kertas Soalan: Butang Hantar Jawapan */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div className="text-xs sm:text-sm text-slate-600">
              Status Kertas Jawapan:{' '}
              <strong className="text-[#1d3b8b]">{answeredCount}</strong> daripada{' '}
              <strong>{totalQuestionsCount}</strong> soalan telah dijawab.
            </div>

            <button
              type="button"
              onClick={handleRequestSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#1d3b8b] hover:bg-blue-900 disabled:bg-slate-400 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghantar Jawapan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Selesai & Hantar Jawapan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
