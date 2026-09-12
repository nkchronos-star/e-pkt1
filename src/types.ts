export type Role = 'SUPER_ADMIN' | 'TAHFIZ' | 'AKADEMIK' | 'PENTADBIR';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  password?: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  weight: number;
}

export interface ApplicationSettings {
  borangBuka: boolean;
  tarikhBukaBorang: string;
  temudugaBuka: boolean;
  tarikhBukaTemuduga: string;
  tawaranBuka: boolean;
  tarikhBukaTawaran: string;
  tarikhTemuduga?: string;
  tarikhLaporDiri?: string;
  tarikhAkhirTerimaTawaran?: string;
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
  tahfizItems?: AssessmentItem[];
  akademikItems?: AssessmentItem[];
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
  maklumBalasTawaran?: 'TERIMA' | 'TOLAK';
}

export interface Infographic {
  id: string;
  title: string;
  url: string;
}
