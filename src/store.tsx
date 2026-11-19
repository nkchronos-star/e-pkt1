import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, ApplicationSettings, User, Infographic, PengenalanItem, VideoKorporatItem, InfoSmag3Item, SubjekKategoriItem, PanduanLangkahItem, PanduanItem } from './types';
import { db } from './lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, deleteField, onSnapshot, getDoc, getDocs, query, where } from 'firebase/firestore';
import { DEFAULT_TANDATANGAN_PENGETUA, DEFAULT_TANDATANGAN_PENGARAH } from './lib/imageUtils';
import { normalizeCandidateDaerahNegeri, lookupPoskodMalaysia } from './lib/poskodMalaysia';

export const getTodayMalaysia = (): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

export const isDateActive = (tarikhMula?: string, tarikhAkhir?: string): boolean => {
  if (!tarikhMula || tarikhMula.trim() === '') return false;
  const today = getTodayMalaysia();
  if (tarikhAkhir && tarikhAkhir.trim() !== '') {
    return today >= tarikhMula && today <= tarikhAkhir;
  }
  return today >= tarikhMula;
};

export const parseMalayDateToIso = (str?: string): string | null => {
  if (!str) return null;
  const s = str.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Format: DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0');
    const month = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const months: Record<string, string> = {
    januari: '01', jan: '01',
    februari: '02', feb: '02',
    mac: '03',
    april: '04', apr: '04',
    mei: '05', may: '05',
    jun: '06',
    julai: '07', jul: '07',
    ogos: '08', ogo: '08', aug: '08',
    september: '09', sep: '09', sept: '09',
    oktober: '10', okt: '10', oct: '10',
    november: '11', nov: '11',
    disember: '12', dis: '12', dec: '12'
  };

  // Extract day, month word, and year from string like '28 November 2026' or '28 Nov 2026 (Sabtu)'
  const wordMatch = s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (wordMatch) {
    const day = wordMatch[1].padStart(2, '0');
    const monthKey = wordMatch[2].toLowerCase();
    const year = wordMatch[3];
    if (months[monthKey]) {
      return `${year}-${months[monthKey]}-${day}`;
    }
  }

  const parts = s.split(/[\s,/-]+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const monthName = parts[1].toLowerCase();
    const year = parts[2];
    if (months[monthName] && /^\d{4}$/.test(year)) {
      return `${year}-${months[monthName]}-${day}`;
    }
  }
  return null;
};

export const formatIsoToMalayDate = (iso?: string): string => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
  const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  const [year, m, d] = iso.split('-');
  const monthName = months[parseInt(m, 10) - 1];
  return `${parseInt(d, 10)} ${monthName} ${year}`;
};

export const isOfferExpired = (
  candidate?: Candidate | null,
  settings?: ApplicationSettings | null
): boolean => {
  if (!candidate || candidate.statusTawaran !== 'BERJAYA') return false;
  if (candidate.maklumBalasTawaran === 'TERIMA' || candidate.maklumBalasTawaran === 'TOLAK') {
    return false;
  }
  if (candidate.maklumBalasTawaran === 'TERBATAL') {
    return true;
  }

  if (!settings) return false;

  let deadlineIso = settings.tarikhAkhirTerimaTawaranDate;
  if (!deadlineIso && settings.tarikhAkhirTerimaTawaran) {
    deadlineIso = parseMalayDateToIso(settings.tarikhAkhirTerimaTawaran) || undefined;
  }

  if (!deadlineIso) return false;

  const today = getTodayMalaysia();
  return today > deadlineIso;
};

export const DEFAULT_TAHFIZ_ITEMS = [
  {
    id: 'hafazan',
    name: 'Hafazan',
    weight: 70,
    soalanPanduan: 'Ujian menghafaz potongan ayat pilihan dalam masa 10–15 minit (Kelancaran, Ingatan, Tajwid & Fasohah)',
    rubrics: [
      {
        id: 'haf_mumtaz',
        label: 'Mumtaz (Cemerlang)',
        minScore: 60,
        maxScore: 70,
        criteria: 'Hafazan sangat lancar tanpa sangkut, ingatan kukuh, makhraj dan hukum tajwid sangat tepat.'
      },
      {
        id: 'haf_jayyid_jiddan',
        label: 'Jayyid Jiddan (Kepujian)',
        minScore: 45,
        maxScore: 59,
        criteria: 'Hafazan lancar dengan 1–2 teguran kecil sahaja, sebutan huruf jelas dan tajwid terjaga.'
      },
      {
        id: 'haf_jayyid',
        label: 'Jayyid (Baik / Sederhana)',
        minScore: 30,
        maxScore: 44,
        criteria: 'Hafazan sederhana, terdapat beberapa sangkutan (3–4 kali dibantu) dan penguasaan tajwid asas.'
      },
      {
        id: 'haf_maqbul',
        label: 'Maqbul (Lemah)',
        minScore: 1,
        maxScore: 29,
        criteria: 'Hafazan kurang lancar, kerap terlupa potongan ayat dan memerlukan banyak bimbingan penilai.'
      }
    ]
  },
  {
    id: 'tilawah',
    name: 'Tilawah',
    weight: 25,
    soalanPanduan: 'Bacaan mushaf ayat pilihan (Hukum Nun/Mim Mati, Mad, Makhraj Huruf, Dengung & Kelancaran)',
    rubrics: [
      {
        id: 'til_mumtaz',
        label: 'Mumtaz (Cemerlang)',
        minScore: 21,
        maxScore: 25,
        criteria: 'Bacaan bertajwid sempurna, makhraj tepat, suara jelas serta alunan bacaan teratur.'
      },
      {
        id: 'til_jayyid_jiddan',
        label: 'Jayyid Jiddan (Kepujian)',
        minScore: 15,
        maxScore: 20,
        criteria: 'Bacaan lancar dan menjaga hukum tajwid utama dengan sedikit ralat kecil.'
      },
      {
        id: 'til_jayyid',
        label: 'Jayyid (Baik / Sederhana)',
        minScore: 8,
        maxScore: 14,
        criteria: 'Bacaan agak merangkak atau terdapat kesalahan hukum tajwid asas (dengung / panjang pendek).'
      },
      {
        id: 'til_maqbul',
        label: 'Maqbul (Lemah)',
        minScore: 1,
        maxScore: 7,
        criteria: 'Bacaan lemah, kurang mengenal tanda bacaan atau kerap tersalah huruf/baris.'
      }
    ]
  },
  {
    id: 'sahsiah',
    name: 'Sahsiah',
    weight: 5,
    soalanPanduan: 'Penampilan diri, adab bersama Al-Quran, komunikasi, minat & kesungguhan mengikuti KBT Tahfiz',
    rubrics: [
      {
        id: 'sah_cemerlang',
        label: 'Cemerlang',
        minScore: 5,
        maxScore: 5,
        criteria: 'Beradab tinggi, penampilan kemas, menjawab dengan yakin & sangat berminat masuk kelas Tahfiz.'
      },
      {
        id: 'sah_baik',
        label: 'Baik',
        minScore: 3,
        maxScore: 4,
        criteria: 'Beradab sopan, komunikasi sederhana dan menunjukkan minat yang baik.'
      },
      {
        id: 'sah_sederhana',
        label: 'Sederhana / Perlu Bimbingan',
        minScore: 1,
        maxScore: 2,
        criteria: 'Kurang keyakinan diri atau kurang persediaan semasa sesi temuduga.'
      }
    ]
  }
];

export const ensureTahfizRubrics = (items?: ApplicationSettings['tahfizItems']) => {
  const source = items && items.length > 0 ? items : DEFAULT_TAHFIZ_ITEMS;
  return source.map((item) => {
    if (item.rubrics && item.rubrics.length > 0) return item;
    const def = DEFAULT_TAHFIZ_ITEMS.find(
      d => d.id === item.id || d.name.toLowerCase() === item.name?.toLowerCase()
    );
    if (def) {
      return {
        ...item,
        soalanPanduan: item.soalanPanduan || def.soalanPanduan,
        rubrics: def.rubrics
      };
    }
    const w = Number(item.weight || 10);
    return {
      ...item,
      soalanPanduan: item.soalanPanduan || `Penilaian komponen ${item.name}`,
      rubrics: [
        {
          id: `${item.id}_cemerlang`,
          label: 'Cemerlang',
          minScore: Math.max(1, Math.round(w * 0.8)),
          maxScore: w,
          criteria: `Penguasaan ${item.name} pada tahap sangat cemerlang dan tepat.`
        },
        {
          id: `${item.id}_baik`,
          label: 'Baik / Kepujian',
          minScore: Math.max(1, Math.round(w * 0.5)),
          maxScore: Math.max(1, Math.round(w * 0.8) - 1),
          criteria: `Penguasaan ${item.name} pada tahap baik dan memuaskan.`
        },
        {
          id: `${item.id}_sederhana`,
          label: 'Lemah / Perlu Bimbingan',
          minScore: 1,
          maxScore: Math.max(1, Math.round(w * 0.5) - 1),
          criteria: `Penguasaan ${item.name} masih lemah dan memerlukan bimbingan.`
        }
      ]
    };
  });
};

export const DEFAULT_PENGENALAN_ITEMS: PengenalanItem[] = [
  {
    id: 'peng_1',
    type: 'PARAGRAPH',
    text: 'Matlamat utama pelaksanaan Kurikulum Bersepadu Tahfiz (KBT) di SMAG3 adalah untuk melahirkan golongan profesional, teknokrat dan usahawan hafiz yang mengamalkan ajaran Islam (mutadayyin) dan memiliki pelbagai kemahiran ilmu selaras dengan Falsafah Pendidikan Negara.'
  },
  {
    id: 'peng_2',
    type: 'LIST_ITEM',
    text: 'Menghafaz 30 juzuk Al-Quran.'
  },
  {
    id: 'peng_3',
    type: 'LIST_ITEM',
    text: 'Profesional dengan asas keagamaan mantap berlandaskan Al-Quran dan Al-Sunnah.'
  },
  {
    id: 'peng_4',
    type: 'LIST_ITEM',
    text: 'Memaksimumkan keupayaan berfikir aras tinggi, kreatif dan inovatif.'
  },
  {
    id: 'peng_5',
    type: 'LIST_ITEM',
    text: 'Hubungan baik dengan Allah, manusia dan alam sekitar.'
  }
];

export const DEFAULT_VIDEO_KORPORAT_ITEMS: VideoKorporatItem[] = [
  {
    id: 'vid_1',
    title: 'Video Korporat',
    embedUrl: 'https://www.youtube.com/embed/JT6Py5iXp1g?si=VRrKskCawUxW1W1B'
  }
];

export const DEFAULT_INFO_SMAG3_ITEMS: InfoSmag3Item[] = [
  {
    id: 'info_smag3_1',
    title: 'Info SMAG3',
    imageUrl: 'https://i.postimg.cc/yNK9VCKH/infografik.png',
    linkUrl: 'https://tinyurl.com/y5h7jxxx',
    facebookUrl: 'https://www.facebook.com/SMAKG03/'
  }
];

export const DEFAULT_SUBJEK_MENENGAH_BAWAH: SubjekKategoriItem[] = [
  {
    id: 'mb_teras',
    kategori: 'Teras',
    subjek: ['Bahasa Melayu', 'Sains', 'Bahasa Inggeris', 'Sejarah', 'Bahasa Arab', 'Pendidikan Islam', 'Matematik']
  },
  {
    id: 'mb_wajib',
    kategori: 'Wajib',
    subjek: ['Pend. Jasmani & Kesihatan', 'Geografi', 'Reka Bentuk Teknologi', 'Pendidikan Seni Visual']
  },
  {
    id: 'mb_tahfiz',
    kategori: 'Tahfiz',
    subjek: ['Hifz Al-Quran', 'Maharat Al-Quran']
  }
];

export const DEFAULT_SUBJEK_MENENGAH_ATAS: SubjekKategoriItem[] = [
  {
    id: 'ma_teras',
    kategori: 'Teras',
    subjek: ['Bahasa Melayu', 'Sains', 'Bahasa Inggeris', 'Sejarah', 'Bahasa Arab', 'Matematik']
  },
  {
    id: 'ma_wajib',
    kategori: 'Wajib',
    subjek: ['Pend. Jasmani & Kesihatan', 'Perniagaan', 'Pendidikan Islam']
  },
  {
    id: 'ma_tahfiz',
    kategori: 'Tahfiz',
    subjek: ['Hifz Al-Quran', 'Maharat Al-Quran']
  }
];

export const DEFAULT_PANDUAN_SYARAT_ITEMS: PanduanItem[] = [
  { id: 'syarat_1', text: 'Warganegara Malaysia yang beragama Islam.' },
  { id: 'syarat_2', text: 'Berumur 13 tahun pada tahun kemasukan.' },
  { id: 'syarat_3', text: 'Tamat Darjah 6 di Sekolah Kementerian Pendidikan Malaysia (KPM) atau institusi setaraf dengannya.' },
  { id: 'syarat_4', text: 'Memperoleh sekurang-kurangnya Tahap Penguasaan 4 (TP4) bagi semua mata pelajaran dalam Pentaksiran Bilik Darjah (PBD).' },
  { id: 'syarat_5', text: 'Memperoleh sekurang-kurangnya 5A dalam Ujian Penilaian Kelas Kafa (UPKK) atau setaraf dengannya.' },
  { id: 'syarat_6', text: 'Boleh menulis dan membaca tulisan Jawi dengan baik.' },
  { id: 'syarat_7', text: 'Lancar bacaan Al-Quran dan mempunyai minat yang tinggi untuk menghafaz Al-Quran (Kurikulum Bersepadu Tahfiz - KBT).' },
  { id: 'syarat_8', text: 'Memiliki tubuh badan yang sihat, tiada masalah disiplin berat, dan mempunyai sahsiah terpuji.' }
];

export const DEFAULT_PANDUAN_LANGKAH_ITEMS: PanduanLangkahItem[] = [
  {
    id: 'langkah_1',
    title: 'Langkah 1: Mengisi Borang Permohonan Atas Talian',
    description: 'Ibu bapa atau penjaga perlu mengisi borang permohonan secara atas talian. Pastikan semua maklumat peribadi calon, maklumat ibu bapa/penjaga, dan maklumat akademik (PBD & UPKK) diisi dengan lengkap dan tepat.'
  },
  {
    id: 'langkah_2',
    title: 'Langkah 2: Semakan Panggilan Temuduga',
    description: 'Pihak sekolah akan membuat saringan awal terhadap permohonan yang diterima. Calon boleh membuat semakan status panggilan temuduga melalui menu "Semak Temuduga" dengan memasukkan No. Kad Pengenalan. Calon yang layak wajib mencetak Surat Panggilan Temuduga rasmi.'
  },
  {
    id: 'langkah_3',
    title: 'Langkah 3: Menghadiri Sesi Temuduga (Tahfiz & Akademik)',
    description: 'Calon hadir ke SMA Kota Gelanggi 3 bersama ibu bapa/penjaga pada tarikh, masa, dan tempat yang telah ditetapkan. Calon akan dinilai dari aspek hafazan & tilawah Al-Quran (Tahfiz) serta ujian kefahaman asas (Akademik & Sahsiah).'
  },
  {
    id: 'langkah_4',
    title: 'Langkah 4: Semakan Tawaran & Pengesahan Penerimaan',
    description: 'Keputusan tawaran kemasukan akan diumumkan melalui portal di menu "Semak Tawaran". Calon yang berjaya ditawarkan perlu mengesahkan penerimaan tawaran (Terima / Tolak), mencetak Surat Tawaran, memuat turun Borang Pendaftaran (12 Halaman), dan menyertai Group WhatsApp rasmi sekolah.'
  }
];

export const DEFAULT_PANDUAN_DOKUMEN_ITEMS: PanduanItem[] = [
  { id: 'dok_1', text: 'Gambar Pasport Pemohon (format JPG / PNG yang jelas berlatar belakang biru atau putih).' },
  { id: 'dok_2', text: 'Salinan maklumat keputusan PBD Darjah 6 dan Slip Keputusan UPKK untuk rujukan semasa mengisi gred.' }
];

export const applyAutoDates = (s: ApplicationSettings): ApplicationSettings => {
  const res = { ...s };
  const today = getTodayMalaysia();

  // Borang Permohonan: Jika tarikh tutup telah lepas atau belum buka, MESTI DITUTUP
  if (s.tarikhTutupBorang && today > s.tarikhTutupBorang) {
    res.borangBuka = false;
  } else if (s.tarikhBukaBorang && today < s.tarikhBukaBorang) {
    res.borangBuka = false;
  }

  // Semakan Temuduga: Jika tempoh temuduga telah tamat, MESTI DITUTUP
  if (s.tarikhTutupTemuduga && today > s.tarikhTutupTemuduga) {
    res.temudugaBuka = false;
  } else if (s.tarikhBukaTemuduga && today < s.tarikhBukaTemuduga) {
    res.temudugaBuka = false;
  }

  // Semakan Tawaran
  if (s.tarikhTutupTawaran && today > s.tarikhTutupTawaran) {
    res.tawaranBuka = false;
  } else if (s.tarikhBukaTawaran && today < s.tarikhBukaTawaran) {
    res.tawaranBuka = false;
  }

  // Portal Ujian Akademik Calon: Jika tarikh mula/tutup ditetapkan, auto buka/tutup mengikut tarikh
  if (s.tarikhTutupUjianAkademik && today > s.tarikhTutupUjianAkademik) {
    res.ujianAkademikBuka = false;
  } else if (s.tarikhBukaUjianAkademik && today < s.tarikhBukaUjianAkademik) {
    res.ujianAkademikBuka = false;
  } else if (s.tarikhBukaUjianAkademik && isDateActive(s.tarikhBukaUjianAkademik, s.tarikhTutupUjianAkademik)) {
    res.ujianAkademikBuka = true;
  }

  res.tahfizItems = ensureTahfizRubrics(s.tahfizItems);

  // Pastikan 3 bahagian akademik (Matematik, Sains, Psikometrik) tersedia secara lalai
  if (!res.akademikItems || res.akademikItems.length === 0) {
    res.akademikItems = [
      { id: 'matematik', name: 'Matematik', weight: 20 },
      { id: 'sains', name: 'Sains', weight: 20 },
      { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
    ];
  } else if (
    res.akademikItems.length === 2 &&
    res.akademikItems.some(i => i.id === 'matematik' || i.name?.toLowerCase().includes('mat')) &&
    res.akademikItems.some(i => i.id === 'sains' || i.name?.toLowerCase().includes('sains')) &&
    !res.akademikItems.some(i => i.id === 'psikometrik' || i.name?.toLowerCase().includes('psiko'))
  ) {
    res.akademikItems = [
      ...res.akademikItems,
      { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
    ];
  }

  if (!res.pengenalanItems) res.pengenalanItems = DEFAULT_PENGENALAN_ITEMS;
  if (!res.videoKorporatItems) res.videoKorporatItems = DEFAULT_VIDEO_KORPORAT_ITEMS;
  if (!res.infoSmag3Items) res.infoSmag3Items = DEFAULT_INFO_SMAG3_ITEMS;
  if (!res.subjekMenengahBawah) res.subjekMenengahBawah = DEFAULT_SUBJEK_MENENGAH_BAWAH;
  if (!res.subjekMenengahAtas) res.subjekMenengahAtas = DEFAULT_SUBJEK_MENENGAH_ATAS;
  if (!res.panduanSyaratItems) res.panduanSyaratItems = DEFAULT_PANDUAN_SYARAT_ITEMS;
  if (!res.panduanLangkahItems) res.panduanLangkahItems = DEFAULT_PANDUAN_LANGKAH_ITEMS;
  if (!res.panduanDokumenItems) res.panduanDokumenItems = DEFAULT_PANDUAN_DOKUMEN_ITEMS;

  return res;
};

interface AppState {
  settings: ApplicationSettings;
  candidates: Candidate[];
  users: User[];
  currentUser: User | null;
  userRole: 'SUPER_ADMIN' | 'PENTADBIR' | 'TAHFIZ' | 'AKADEMIK' | null;
  infographics: Infographic[];
  isInitialized: boolean;
}

interface AppContextType extends AppState {
  updateSettings: (settings: Partial<ApplicationSettings>) => void;
  syncSettingsToServer: (customPartial?: Partial<ApplicationSettings>) => Promise<void>;
  saveCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (ic: string, data: Partial<Candidate>) => Promise<void>;
  resetCandidateExamMark: (ic: string) => Promise<void>;
  deleteCandidate: (ic: string) => Promise<void>;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
  addInfographic: (info: Infographic) => void;
  deleteInfographic: (id: string) => void;
}

const defaultSettings: ApplicationSettings = {
  borangBuka: false,
  tarikhBukaBorang: '2026-09-07',
  tarikhTutupBorang: '2026-09-30',
  temudugaBuka: false,
  tarikhBukaTemuduga: '2026-10-02',
  tarikhTutupTemuduga: '2026-10-09',
  tawaranBuka: false,
  tarikhBukaTawaran: '2026-10-19',
  tarikhTutupTawaran: '',
  tarikhTemuduga: '10 Oktober 2026',
  tarikhLaporDiri: '3 Januari 2027',
  tarikhAkhirTerimaTawaran: '28 November 2026',
  tarikhAkhirTerimaTawaranDate: '2026-11-28',
  linkGroupWhatsapp: '',
  linkGroupWhatsappTemuduga: '',
  tarikhSemakPertimbangan: '30 Oktober 2026',
  tarikhSemakPertimbanganDate: '2026-10-30',
  tarikhSuratPanggilan: '28 September 2026',
  hariTemuduga: 'Sabtu',
  masaTemuduga: '8.30 pagi',
  tempatTemuduga: 'Laman Selera, SMA Kota Gelanggi 3',
  pakaianTemuduga: 'Uniform sekolah',
  sesiKemasukan: '2027',
  borangPendaftaranUrl: '',
  namaPengetua: 'JUITA BINTI HAMZAH',
  tandatanganPengetua: DEFAULT_TANDATANGAN_PENGETUA,
  borangTingkatan1Link: '',
  utamaPanduanLink: '',
  utamaContent: '',
  panduanContent: '',
  logoEqabulUrl: '',
  rujukanSuratTawaran: 'JPNP.SPI.800-1/1/4 Jld.2',
  tarikhSuratTawaran: '17 November 2025',
  masaLaporDiri: '8.30 PAGI',
  tandatanganPengarahTawaran: DEFAULT_TANDATANGAN_PENGARAH,
  namaPengarahTawaran: 'HAJI HASDAN BIN HASAN',
  jawatanPengarahTawaran1: 'Ketua Penolong Pengarah Kanan',
  jawatanPengarahTawaran2: 'Sektor Pendidikan Islam',
  jawatanPengarahTawaran3: 'b.p Pengarah Pendidikan Pahang',
  tahfizItems: DEFAULT_TAHFIZ_ITEMS,
  akademikItems: [
    { id: 'matematik', name: 'Matematik', weight: 20 },
    { id: 'sains', name: 'Sains', weight: 20 },
    { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
  ],
  ujianAkademikBuka: true,
  tarikhBukaUjianAkademik: '',
  tarikhTutupUjianAkademik: '',
  masaUjianAkademikMinit: 30,
  pinUjianAkademik: '',
  soalanAkademik: []
};

const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '@cft2001', name: 'Super Admin', role: 'SUPER_ADMIN' },
  { id: 'tahfiz1', username: 'tahfiz1', password: '123', name: 'Panel Tahfiz 1', role: 'TAHFIZ' },
  { id: 'tahfiz2', username: 'tahfiz2', password: '123', name: 'Panel Tahfiz 2', role: 'TAHFIZ' },
  { id: 'tahfiz3', username: 'tahfiz3', password: '123', name: 'Panel Tahfiz 3', role: 'TAHFIZ' },
  { id: 'akademik1', username: 'akademik1', password: '123', name: 'Panel Akademik 1', role: 'AKADEMIK' },
  { id: 'akademik2', username: 'akademik2', password: '123', name: 'Panel Akademik 2', role: 'AKADEMIK' }
];

const SETTINGS_STORAGE_KEY = 'smag3_settings_cache_v2';
const USERS_STORAGE_KEY = 'smag3_users_cache_v2';
const CANDIDATES_STORAGE_KEY = 'smag3_candidates_cache_v2';

const purgeSensitiveDataFromBrowser = () => {
  try {
    const sensitiveKeys = [
      'sma_candidates',
      'sma_users',
      'smag3_candidates_cache',
      'smag3_users_cache',
      USERS_STORAGE_KEY,
      CANDIDATES_STORAGE_KEY
    ];
    sensitiveKeys.forEach(k => localStorage.removeItem(k));
  } catch {}
};
const SIG_PENGETUA_KEY = 'smag3_sig_pengetua_v1';
const SIG_PENGARAH_KEY = 'smag3_sig_pengarah_v1';

const sanitizeForFirestore = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined && val !== null) {
        res[key] = sanitizeForFirestore(val);
      }
    }
    return res;
  }
  return obj;
};

const loadCachedSettings = (): ApplicationSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const cachedPengetuaSig = localStorage.getItem(SIG_PENGETUA_KEY);
    const cachedPengarahSig = localStorage.getItem(SIG_PENGARAH_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...defaultSettings, ...parsed };
        if (merged.namaPengarahTawaran === 'YAHAYA BIN TAHIR' || !merged.namaPengarahTawaran) {
          merged.namaPengarahTawaran = 'HAJI HASDAN BIN HASAN';
        }
        if (!merged.jawatanPengarahTawaran1) {
          merged.jawatanPengarahTawaran1 = 'Ketua Penolong Pengarah Kanan';
        }
        if (cachedPengetuaSig && !merged.tandatanganPengetua) {
          merged.tandatanganPengetua = cachedPengetuaSig;
        }
        if (cachedPengarahSig && !merged.tandatanganPengarahTawaran) {
          merged.tandatanganPengarahTawaran = cachedPengarahSig;
        }
        if (!merged.tandatanganPengetua) {
          merged.tandatanganPengetua = DEFAULT_TANDATANGAN_PENGETUA;
        }
        if (!merged.tandatanganPengarahTawaran) {
          merged.tandatanganPengarahTawaran = DEFAULT_TANDATANGAN_PENGARAH;
        }
        if (Array.isArray(merged.akademikItems)) {
          merged.akademikItems = merged.akademikItems.filter((item: any) => 
            item.id !== 'bm' && item.id !== 'bi' && !item.name?.toLowerCase().includes('bahasa')
          );
          merged.akademikItems = merged.akademikItems.map((item: any) => {
            if ((item.id === 'matematik' || item.name?.toLowerCase() === 'matematik') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
              return { ...item, weight: 20 };
            }
            if ((item.id === 'sains' || item.name?.toLowerCase() === 'sains') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
              return { ...item, weight: 20 };
            }
            return item;
          });
          if (merged.akademikItems.length === 0) {
            merged.akademikItems = [
              { id: 'matematik', name: 'Matematik', weight: 20 },
              { id: 'sains', name: 'Sains', weight: 20 }
            ];
          }
        }
        return applyAutoDates(merged);
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache tetapan:', e);
  }
  return applyAutoDates(defaultSettings);
};

const SESSION_USER_KEY = 'sma_admin_session';

const loadCachedSessionUser = (): User | null => {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        return parsed as User;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca sesi pentadbir:', e);
  }
  return null;
};

const loadCachedCandidates = (hasUser: boolean): Candidate[] => {
  if (!hasUser) return [];
  try {
    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Candidate[];
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache calon:', e);
  }
  return [];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = loadCachedSessionUser();

  const [state, setState] = useState<AppState>(() => {
    // Zero-leakage check: jika bukan pentadbir, padam sebarang sisa cache calon dan pengguna dari pelayar
    if (!initialUser) {
      purgeSensitiveDataFromBrowser();
    }

    return {
      settings: loadCachedSettings(),
      candidates: loadCachedCandidates(Boolean(initialUser)),
      users: initialUser ? defaultUsers : [],
      currentUser: initialUser,
      userRole: initialUser ? initialUser.role : null,
      infographics: [],
      isInitialized: true,
    };
  });

  // 1. Dengar data awam sahaja (Settings & Infografik) untuk semua pelawat
  useEffect(() => {
    try {
      if (!localStorage.getItem('smag3_reset_140110060181_v1')) {
        localStorage.removeItem('eqabul_exam_draft_140110060181');
        localStorage.removeItem('eqabul_draft_akademik_140110060181');
        localStorage.setItem('smag3_reset_140110060181_v1', '1');
      }
    } catch {}

    // 1. Settings
    const unsubSettings = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as ApplicationSettings;
        const cleanFirestoreData: any = {};
        for (const [k, v] of Object.entries(firestoreData)) {
          if (v !== null && v !== undefined && v !== '') {
            cleanFirestoreData[k] = v;
          }
        }
        if (cleanFirestoreData.namaPengarahTawaran === 'YAHAYA BIN TAHIR' || !cleanFirestoreData.namaPengarahTawaran) {
          cleanFirestoreData.namaPengarahTawaran = 'HAJI HASDAN BIN HASAN';
        }
        if (!cleanFirestoreData.jawatanPengarahTawaran1) {
          cleanFirestoreData.jawatanPengarahTawaran1 = 'Ketua Penolong Pengarah Kanan';
        }
        if (cleanFirestoreData.tandatanganPengetua) {
          try { localStorage.setItem(SIG_PENGETUA_KEY, cleanFirestoreData.tandatanganPengetua); } catch {}
        } else {
          cleanFirestoreData.tandatanganPengetua = DEFAULT_TANDATANGAN_PENGETUA;
        }
        if (cleanFirestoreData.tandatanganPengarahTawaran) {
          try { localStorage.setItem(SIG_PENGARAH_KEY, cleanFirestoreData.tandatanganPengarahTawaran); } catch {}
        } else {
          cleanFirestoreData.tandatanganPengarahTawaran = DEFAULT_TANDATANGAN_PENGARAH;
        }
        if (Array.isArray(cleanFirestoreData.akademikItems)) {
          cleanFirestoreData.akademikItems = cleanFirestoreData.akademikItems.filter((item: any) => 
            item.id !== 'bm' && item.id !== 'bi' && !item.name?.toLowerCase().includes('bahasa')
          );
          let hasOldWeight = false;
          cleanFirestoreData.akademikItems = cleanFirestoreData.akademikItems.map((item: any) => {
            if ((item.id === 'matematik' || item.name?.toLowerCase() === 'matematik') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
              hasOldWeight = true;
              return { ...item, weight: 20 };
            }
            if ((item.id === 'sains' || item.name?.toLowerCase() === 'sains') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
              hasOldWeight = true;
              return { ...item, weight: 20 };
            }
            return item;
          });
          if (cleanFirestoreData.akademikItems.length === 0) {
            cleanFirestoreData.akademikItems = [
              { id: 'matematik', name: 'Matematik', weight: 20 },
              { id: 'sains', name: 'Sains', weight: 20 }
            ];
            hasOldWeight = true;
          }
          if (hasOldWeight) {
            setDoc(doc(db, 'config', 'main'), { akademikItems: cleanFirestoreData.akademikItems }, { merge: true }).catch(err => {
              console.warn("Kemaskini akademikItems ke Firestore:", err);
            });
          }
        }
        setState(prev => {
          const merged = applyAutoDates({ ...defaultSettings, ...prev.settings, ...cleanFirestoreData });
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Gagal simpan cache ke localStorage:', e);
          }
          return { ...prev, settings: merged, isInitialized: true };
        });
      } else {
        // Document does not exist yet in Firestore - preserve current cached settings
        setState(prev => {
          const autoApplied = applyAutoDates(prev.settings);
          const toSave = sanitizeForFirestore(autoApplied);
          setDoc(doc(db, 'config', 'main'), toSave, { merge: true }).catch(err => {
            console.error("Gagal create config di Firestore:", err);
          });
          return { ...prev, settings: autoApplied, isInitialized: true };
        });
      }
    }, (error) => {
      console.error("Firestore onSnapshot error for settings:", error);
      setState(prev => ({ ...prev, isInitialized: true }));
    });

    // 2. Infographics (Awam)
    const unsubInfographics = onSnapshot(collection(db, 'infographics'), (snapshot) => {
      const infoList: Infographic[] = [];
      snapshot.forEach(docSnap => {
        infoList.push({ id: docSnap.id, ...docSnap.data() } as Infographic);
      });
      setState(prev => ({ ...prev, infographics: infoList }));
    }, (error) => {
      console.error("Firestore infographics error:", error);
    });

    return () => {
      unsubSettings();
      unsubInfographics();
    };
  }, []);

  // 2. KAWALAN KESELAMATAN KETAT: Dengar senarai calon & pengguna HANYA jika pentadbir telah log masuk!
  useEffect(() => {
    if (!state.currentUser) {
      // Pastikan sifar data calon atau pengguna wujud dalam peranti pelawat awam
      setState(prev => ({ ...prev, candidates: [], users: [] }));
      purgeSensitiveDataFromBrowser();
      return;
    }

    // 2.1 Pengguna (Hanya untuk Admin Panel)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.username) {
          usersList.push({ id: docSnap.id, ...data } as User);
        }
      });
      defaultUsers.forEach(u => {
        if (!usersList.some(existing => existing.username?.toLowerCase() === u.username.toLowerCase())) {
          usersList.push(u);
        }
      });
      setState(prev => ({
        ...prev,
        users: usersList,
      }));
    }, (error) => {
      console.error("Firestore users error:", error);
    });

    // 2.2 Calon-calon (Hanya dimuat turun oleh Pentadbir berdaftar)
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesList: Candidate[] = [];
      const toStandardizeInFirestore: { docId: string; updates: Partial<Candidate> }[] = [];

      snapshot.forEach(docSnap => {
        const raw = { id: docSnap.id, ...docSnap.data() } as Candidate;
        const norm = normalizeCandidateDaerahNegeri(raw);
        const updates: Partial<Candidate> = {};

        if (norm.daerah !== 'TIADA MAKLUMAT') {
          if ((raw.daerah || '').trim().toUpperCase() !== norm.daerah) {
            raw.daerah = norm.daerah;
            updates.daerah = norm.daerah;
          }
          if ((raw.negeri || '').trim().toUpperCase() !== norm.negeri) {
            raw.negeri = norm.negeri;
            updates.negeri = norm.negeri;
          }
        }
        if (raw.poskodBapa) {
          const locBapa = lookupPoskodMalaysia(raw.poskodBapa);
          if (locBapa && ((raw.daerahBapa || '').trim().toUpperCase() !== locBapa.daerah || (raw.negeriBapa || '').trim().toUpperCase() !== locBapa.negeri)) {
            raw.daerahBapa = locBapa.daerah;
            raw.negeriBapa = locBapa.negeri;
            updates.daerahBapa = locBapa.daerah;
            updates.negeriBapa = locBapa.negeri;
          }
        }
        if (raw.poskodIbu) {
          const locIbu = lookupPoskodMalaysia(raw.poskodIbu);
          if (locIbu && ((raw.daerahIbu || '').trim().toUpperCase() !== locIbu.daerah || (raw.negeriIbu || '').trim().toUpperCase() !== locIbu.negeri)) {
            raw.daerahIbu = locIbu.daerah;
            raw.negeriIbu = locIbu.negeri;
            updates.daerahIbu = locIbu.daerah;
            updates.negeriIbu = locIbu.negeri;
          }
        }

        if (
          raw.statusTawaran === 'BERJAYA' &&
          !raw.maklumBalasTawaran &&
          isOfferExpired(raw, state.settings)
        ) {
          raw.maklumBalasTawaran = 'TERBATAL';
          updates.maklumBalasTawaran = 'TERBATAL';
        }

        if (Object.keys(updates).length > 0) {
          toStandardizeInFirestore.push({ docId: docSnap.id, updates });
        }

        candidatesList.push(raw);
      });

      setState(prev => ({ ...prev, candidates: candidatesList }));
      try {
        localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidatesList));
      } catch (e) {
        console.warn('Gagal menyimpan cache calon:', e);
      }

      // Automatik kemas kini rekod calon yang sudah daftar di Firestore supaya daerah & negeri seragam serta kunci status TERBATAL
      if (toStandardizeInFirestore.length > 0) {
        Promise.allSettled(
          toStandardizeInFirestore.map(item =>
            setDoc(doc(db, 'candidates', item.docId), item.updates, { merge: true })
          )
        ).catch(err => console.warn('Auto-standardize daerah/negeri/terbatal:', err));
      }
    }, (error) => {
      console.error("Firestore candidates error:", error);
    });

    return () => {
      unsubUsers();
      unsubCandidates();
    };
  }, [state.currentUser?.id, state.currentUser?.username]);

  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
    const fieldsToSave: Partial<ApplicationSettings> = { ...newSettings };
    const mergedNow = { ...state.settings, ...newSettings };

    if ('tarikhBukaBorang' in newSettings || 'tarikhTutupBorang' in newSettings) {
      mergedNow.borangBuka = isDateActive(mergedNow.tarikhBukaBorang, mergedNow.tarikhTutupBorang);
      fieldsToSave.borangBuka = mergedNow.borangBuka;
    }
    if ('tarikhBukaTemuduga' in newSettings || 'tarikhTutupTemuduga' in newSettings) {
      mergedNow.temudugaBuka = isDateActive(mergedNow.tarikhBukaTemuduga, mergedNow.tarikhTutupTemuduga);
      fieldsToSave.temudugaBuka = mergedNow.temudugaBuka;
    }
    if ('tarikhBukaTawaran' in newSettings || 'tarikhTutupTawaran' in newSettings) {
      mergedNow.tawaranBuka = isDateActive(mergedNow.tarikhBukaTawaran, mergedNow.tarikhTutupTawaran);
      fieldsToSave.tawaranBuka = mergedNow.tawaranBuka;
    }

    if (newSettings.tandatanganPengetua !== undefined) {
      if (newSettings.tandatanganPengetua) {
        try { localStorage.setItem(SIG_PENGETUA_KEY, newSettings.tandatanganPengetua); } catch {}
      } else {
        try { localStorage.removeItem(SIG_PENGETUA_KEY); } catch {}
      }
    }
    if (newSettings.tandatanganPengarahTawaran !== undefined) {
      if (newSettings.tandatanganPengarahTawaran) {
        try { localStorage.setItem(SIG_PENGARAH_KEY, newSettings.tandatanganPengarahTawaran); } catch {}
      } else {
        try { localStorage.removeItem(SIG_PENGARAH_KEY); } catch {}
      }
    }

    setState(prev => {
      const nextSettings = { ...prev.settings, ...fieldsToSave };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
      } catch (e) {
        console.warn("Gagal simpan settings ke localStorage:", e);
      }
      return { ...prev, settings: nextSettings };
    });

    try {
      // ONLY save specific fields changed with merge: true so sections never overwrite or erase each other!
      const cleanData = sanitizeForFirestore(fieldsToSave);
      await setDoc(doc(db, 'config', 'main'), cleanData, { merge: true });
    } catch (e) {
      console.error("Firebase background sync failed in updateSettings:", e);
    }
  };

  const syncSettingsToServer = async (customPartial?: Partial<ApplicationSettings>) => {
    try {
      const merged = customPartial ? { ...state.settings, ...customPartial } : state.settings;
      const settingsToSave = applyAutoDates(merged);
      setState(prev => ({ ...prev, settings: settingsToSave }));
      const dataToPersist = customPartial ? sanitizeForFirestore(customPartial) : sanitizeForFirestore(settingsToSave);
      await setDoc(doc(db, 'config', 'main'), dataToPersist, { merge: true });
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      } catch {}
    } catch (e: any) {
      console.error("Ralat menyimpan tetapan:", e);
      throw e;
    }
  };

  const saveCandidate = async (candidate: Candidate) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(candidate));
      const safeId = String(cleanData.ic || cleanData.id).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!safeId) {
        throw new Error('ID atau No. Kad Pengenalan calon tidak sah');
      }
      await setDoc(doc(db, 'candidates', safeId), cleanData);

      // Kawalan Keselamatan: Hanya simpan senarai calon dalam memori global jika pentadbir log masuk
      if (state.currentUser) {
        setState(prev => {
          const nextList = [cleanData, ...prev.candidates.filter(c => c.ic !== cleanData.ic && c.id !== cleanData.id)];
          return { ...prev, candidates: nextList };
        });
      } else {
        // Pelawat awam: Pastikan tiada data calon lain kekal dalam storan cache pelayar
        purgeSensitiveDataFromBrowser();
      }
    } catch (e) {
      console.error("Error saving candidate:", e);
      throw e;
    }
  };

  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      const clearMaklumBalas = 'maklumBalasTawaran' in data && !data.maklumBalasTawaran;
      const cleanData = JSON.parse(JSON.stringify(data));
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');

      // Jika No. Kad Pengenalan ditukar, pindahkan rekod ke ID dokumen baharu dan padam ID lama
      if (cleanData.ic && typeof cleanData.ic === 'string') {
        const newSafeId = String(cleanData.ic).replace(/[^a-zA-Z0-9_-]/g, '');
        if (newSafeId && newSafeId !== safeId) {
          const oldDocSnap = await getDoc(doc(db, 'candidates', safeId));
          const oldData = oldDocSnap.exists() ? oldDocSnap.data() : {};
          const mergedData = { ...oldData, ...cleanData, id: newSafeId, ic: cleanData.ic };
          await setDoc(doc(db, 'candidates', newSafeId), mergedData);
          await deleteDoc(doc(db, 'candidates', safeId));

          setState(prev => {
            const nextList = prev.candidates.map(c => 
              (c.ic === ic || c.id === safeId) ? { ...c, ...cleanData, id: newSafeId, ic: cleanData.ic } : c
            );
            return { ...prev, candidates: nextList };
          });
          return;
        }
      }

      if (clearMaklumBalas) {
        cleanData.maklumBalasTawaran = deleteField();
      }

      await setDoc(doc(db, 'candidates', safeId), cleanData, { merge: true });

      setState(prev => {
        const nextList = prev.candidates.map(c => {
          if (c.ic === ic || c.id === safeId) {
            const updated = { ...c, ...data };
            if (clearMaklumBalas) {
              delete updated.maklumBalasTawaran;
            }
            return updated;
          }
          return c;
        });
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error updating candidate:", e);
      throw e;
    }
  };

  const resetCandidateExamMark = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      const docRef = doc(db, 'candidates', safeId);
      const snap = await getDoc(docRef);
      const currentData = snap.exists() ? (snap.data() as Candidate) : null;
      const currentAkd = currentData?.markahAkademik;

      let restoredAkd: Candidate['markahAkademik'] | undefined = undefined;

      if (currentAkd?.sandaranMarkahAsal && typeof currentAkd.sandaranMarkahAsal === 'object') {
        restoredAkd = { ...currentAkd.sandaranMarkahAsal };
        delete restoredAkd.sandaranMarkahAsal;
        delete restoredAkd.autoGraded;
        delete restoredAkd.jawapanCalon;
        delete restoredAkd.butiranSkor;
        await updateDoc(docRef, { markahAkademik: restoredAkd });
      } else if (currentAkd?.a_1791595296044 !== undefined) {
        const origSains = Number(currentAkd.a_1791595296044) || 11;
        const origMath =
          currentAkd.autoGraded ? 11 : Number(currentAkd.matematik) || 11;
        restoredAkd = {
          matematik: origMath,
          sains: origSains,
          a_1791595296044: origSains,
          jumlah: origMath + origSains,
          dinilaiOleh:
            currentAkd.dinilaiOleh && !currentAkd.dinilaiOleh.includes('Auto')
              ? currentAkd.dinilaiOleh
              : 'Norafiza binti Hashim',
          tarikhDinilai:
            currentAkd.tarikhDinilai && !currentAkd.autoGraded
              ? currentAkd.tarikhDinilai
              : '2026-10-10T04:32:00.000Z'
        };
        await updateDoc(docRef, { markahAkademik: restoredAkd });
      } else {
        await updateDoc(docRef, { markahAkademik: deleteField() });
        restoredAkd = undefined;
      }

      try {
        localStorage.removeItem(`eqabul_exam_draft_${safeId}`);
        localStorage.removeItem(`eqabul_draft_akademik_${safeId}`);
      } catch {}

      setState(prev => {
        const nextList = prev.candidates.map(c => {
          if (c.ic === ic || c.id === safeId) {
            const copy = { ...c };
            if (restoredAkd) {
              copy.markahAkademik = restoredAkd;
            } else {
              delete copy.markahAkademik;
            }
            return copy;
          }
          return c;
        });
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error('Error resetting candidate academic exam mark:', e);
      throw e;
    }
  };

  const deleteCandidate = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await deleteDoc(doc(db, 'candidates', safeId));

      setState(prev => {
        const nextList = prev.candidates.filter(c => c.ic !== ic);
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };

  const login = async (username: string, password?: string): Promise<boolean> => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();
    if (!cleanUser) return false;

    // 1. Semak pengguna lalai tempatan (contohnya akaun pentadbir default)
    const localDefault = defaultUsers.find(u => u.username.toLowerCase() === cleanUser);
    if (localDefault && localDefault.password === cleanPass) {
      try {
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(localDefault));
      } catch {}
      setState(prev => ({ ...prev, currentUser: localDefault, userRole: localDefault.role }));
      return true;
    }

    // 2. Semakan terus ke Firestore untuk akaun guru/penilai tanpa memuat turun semua pengguna
    try {
      const q = query(collection(db, 'users'), where('username', '==', cleanUser));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const matchedDoc = querySnap.docs[0];
        const freshUser = { id: matchedDoc.id, ...matchedDoc.data() } as User;
        if (freshUser.password === cleanPass) {
          try {
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(freshUser));
          } catch {}
          setState(prev => ({ ...prev, currentUser: freshUser, userRole: freshUser.role }));
          return true;
        }
      }
    } catch (err) {
      console.warn("Ralat semakan Firestore login:", err);
    }

    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null, userRole: null, candidates: [], users: [] }));
    try {
      localStorage.removeItem(SESSION_USER_KEY);
      purgeSensitiveDataFromBrowser();
    } catch {}
  };

  const addUser = async (user: User) => {
    try {
      const docId = user.id || Date.now().toString();
      await setDoc(doc(db, 'users', docId), user, { merge: true });
      setState(prev => {
        const nextUsers = [...prev.users.filter(u => u.id !== docId), { ...user, id: docId }];
        return { ...prev, users: nextUsers };
      });
    } catch (e) {
      console.error("Error adding user:", e);
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    // 1. Instantly update React state
    setState(prev => {
      const nextUsers = prev.users.map(u => u.id === id ? { ...u, ...user } : u);
      const updatedCurrentUser = prev.currentUser?.id === id 
        ? { ...prev.currentUser, ...user } 
        : prev.currentUser;
      return { 
        ...prev, 
        users: nextUsers, 
        currentUser: updatedCurrentUser,
        userRole: updatedCurrentUser?.role || prev.userRole
      };
    });

    // 2. Persist to Firestore with setDoc merge
    try {
      await setDoc(doc(db, 'users', id), user, { merge: true });
    } catch (e) {
      console.error("Error updating user in Firestore:", e);
      throw e;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setState(prev => {
        const nextUsers = prev.users.filter(u => u.id !== id);
        return { ...prev, users: nextUsers };
      });
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  };

  const addInfographic = async (info: Infographic) => {
    try {
      await setDoc(doc(db, 'infographics', info.id || Date.now().toString()), info);
    } catch (e) {
      console.error("Error adding infographic:", e);
    }
  };

  const deleteInfographic = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'infographics', id));
    } catch (e) {
      console.error("Error deleting infographic:", e);
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      updateSettings,
      syncSettingsToServer,
      saveCandidate,
      updateCandidate,
      resetCandidateExamMark,
      deleteCandidate,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addInfographic,
      deleteInfographic
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
