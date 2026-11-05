export type Role = 'SUPER_ADMIN' | 'TAHFIZ' | 'AKADEMIK' | 'PENTADBIR';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  password?: string;
}

export interface TahfizRubricBand {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  criteria: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  weight: number;
  soalanPanduan?: string;
  rubrics?: TahfizRubricBand[];
}

export interface AcademicQuestion {
  id: string;
  subjectId: string;
  questionText: string;
  imageUrl?: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
}

export interface PengenalanItem {
  id: string;
  type: 'PARAGRAPH' | 'LIST_ITEM';
  text: string;
}

export interface VideoKorporatItem {
  id: string;
  title: string;
  embedUrl: string;
}

export interface InfoSmag3Item {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  facebookUrl?: string;
}

export interface SubjekKategoriItem {
  id: string;
  kategori: string;
  subjek: string[];
}

export interface PanduanLangkahItem {
  id: string;
  title: string;
  description: string;
}

export interface PanduanItem {
  id: string;
  text: string;
}

export interface ApplicationSettings {
  borangBuka: boolean;
  tarikhBukaBorang: string;
  tarikhTutupBorang?: string;
  temudugaBuka: boolean;
  tarikhBukaTemuduga: string;
  tarikhTutupTemuduga?: string;
  tawaranBuka: boolean;
  tarikhBukaTawaran: string;
  tarikhTutupTawaran?: string;
  tarikhTemuduga?: string;
  tarikhLaporDiri?: string;
  tarikhAkhirTerimaTawaran?: string;
  tarikhAkhirTerimaTawaranDate?: string;
  linkGroupWhatsapp?: string;
  linkGroupWhatsappTemuduga?: string;
  tarikhSemakPertimbangan?: string;
  tarikhSemakPertimbanganDate?: string;
  tarikhSuratPanggilan?: string;
  hariTemuduga?: string;
  masaTemuduga?: string;
  tempatTemuduga?: string;
  pakaianTemuduga?: string;
  borangPendaftaranUrl?: string;
  namaPengetua?: string;
  tandatanganPengetua?: string;
  sesiKemasukan?: string;
  borangTingkatan1Link?: string;
  utamaPanduanLink?: string;
  utamaContent?: string;
  panduanContent?: string;
  pengenalanItems?: PengenalanItem[];
  videoKorporatItems?: VideoKorporatItem[];
  infoSmag3Items?: InfoSmag3Item[];
  subjekMenengahBawah?: SubjekKategoriItem[];
  subjekMenengahAtas?: SubjekKategoriItem[];
  panduanSyaratItems?: PanduanItem[];
  panduanLangkahItems?: PanduanLangkahItem[];
  panduanDokumenItems?: PanduanItem[];
  logoEqabulUrl?: string;
  logoEqabulHorizontalUrl?: string;
  rujukanSuratTawaran?: string;
  tarikhSuratTawaran?: string;
  masaLaporDiri?: string;
  tandatanganPengarahTawaran?: string;
  namaPengarahTawaran?: string;
  jawatanPengarahTawaran1?: string;
  jawatanPengarahTawaran2?: string;
  jawatanPengarahTawaran3?: string;
  tahfizItems?: AssessmentItem[];
  akademikItems?: AssessmentItem[];
  ujianAkademikBuka?: boolean;
  tarikhBukaUjianAkademik?: string;
  tarikhTutupUjianAkademik?: string;
  masaUjianAkademikMinit?: number;
  pinUjianAkademik?: string;
  soalanAkademik?: AcademicQuestion[];
}

export interface Candidate {
  id: string; // generate a random ID
  ic: string;
  name: string;
  
  // Borang Data
  gambarUrl?: string;
  
  // Bahagian A
  noSijilLahir: string;
  tarikhLahir: string;
  tempatLahir: string;
  jantina: 'Lelaki' | 'Perempuan' | '';
  alamat1: string;
  alamat2: string;
  poskod: string;
  daerah: string;
  negeri: string;
  namaSekolahRendah: string;

  // Bahagian B
  namaBapa: string;
  icBapa: string;
  warganegaraBapa: string;
  alamatBapa1: string;
  alamatBapa2: string;
  poskodBapa: string;
  daerahBapa: string;
  negeriBapa: string;
  pekerjaanBapa: string;
  telefonBapa: string;

  namaIbu: string;
  icIbu: string;
  warganegaraIbu: string;
  alamatIbu1: string;
  alamatIbu2: string;
  poskodIbu: string;
  daerahIbu: string;
  negeriIbu: string;
  pekerjaanIbu: string;
  telefonIbu: string;

  // Bahagian C
  pbd: {
    bm: string;
    bi: string;
    matematik: string;
    sains: string;
    slipUrl?: string;
  };
  pbdD6?: {
    bm: string;
    bi: string;
    matematik: string;
    sains: string;
    slipUrl?: string;
  };
  
  upkk: {
    alquran: string;
    akidah: string;
    sirah: string;
    adab: string;
    jawikhat: string;
    bahasaarab: string;
    ibadah: string;
    penghayatancarahidupislam: string;
    amalisolat: string;
    slipUrl?: string;
  };

  // Status & Admin
  statusBorang: 'LENGKAP' | 'DRAF';
  statusTemuduga: 'LAYAK' | 'TIDAK_LAYAK' | 'MENUNGGU';
  
  markahTahfiz?: {
    [key: string]: any; // Dynamic items
    hafazan?: number; // /70
    tilawah?: number; // /25
    sahsiah?: number; // /5
    jumlah: number;
    dinilaiOleh?: string;
    tarikhDinilai?: string;
    catatan?: string;
  };
  sedangDinilaiTahfiz?: {
    dinilaiOleh: string;
    dimulaPada: string;
  } | null;
  markahAkademik?: {
    [key: string]: any; // Dynamic items
    bm?: number;
    bi?: number;
    sains?: number;
    matematik?: number;
    jumlah: number;
    dinilaiOleh?: string;
    tarikhDinilai?: string;
    catatan?: string;
  };
  statusTawaran: 'BERJAYA' | 'GAGAL' | 'DALAM_PERTIMBANGAN';
  maklumBalasTawaran?: 'TERIMA' | 'TOLAK' | 'TERBATAL';
}

export interface Infographic {
  id: string;
  title: string;
  url: string;
}
