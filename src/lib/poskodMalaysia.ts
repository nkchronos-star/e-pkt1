// Pemetaan Rasmi Poskod Malaysia ke Daerah Pentadbiran & Negeri
// Direka untuk mengelakkan variasi ejaan bebas oleh pemohon supaya Analisis Mengikut Negeri & Daerah sentiasa 100% tepat.

export interface PoskodLocation {
  daerah: string;
  negeri: string;
}

// Senarai Rasmi Daerah Mengikut Negeri (Untuk Dropdown Piawai jika diperlukan)
export const DAERAH_BY_NEGERI: Record<string, string[]> = {
  'PAHANG': [
    'JERANTUT',
    'TEMERLOH',
    'MARAN',
    'KUANTAN',
    'PEKAN',
    'ROMPIN',
    'LIPIS',
    'RAUB',
    'BENTONG',
    'BERA',
    'CAMERON HIGHLANDS',
  ],
  'SELANGOR': [
    'PETALING',
    'HULU LANGAT',
    'KLANG',
    'GOMBAK',
    'KUALA LANGAT',
    'SEPANG',
    'KUALA SELANGOR',
    'HULU SELANGOR',
    'SABAK BERNAM',
  ],
  'TERENGGANU': [
    'KUALA TERENGGANU',
    'KUALA NERUS',
    'KEMAMAN',
    'DUNGUN',
    'BESUT',
    'MARANG',
    'HULU TERENGGANU',
    'SETIU',
  ],
  'KELANTAN': [
    'KOTA BHARU',
    'PASIR MAS',
    'TUMPAT',
    'BACHOK',
    'TANAH MERAH',
    'PASIR PUTEH',
    'KUALA KRAI',
    'MACHANG',
    'GUA MUSANG',
    'JELI',
  ],
  'JOHOR': [
    'JOHOR BAHRU',
    'BATU PAHAT',
    'KLUANG',
    'KULAI',
    'MUAR',
    'KOTA TINGGI',
    'SEGAMAT',
    'PONTIAN',
    'TANGKAK',
    'MERSING',
  ],
  'PERAK': [
    'KINTA',
    'LARUT, MATANG DAN SELAMA',
    'MANJUNG',
    'HILIR PERAK',
    'KERIAN',
    'BATANG PADANG',
    'KUALA KANGSAR',
    'PERAK TENGAH',
    'HULU PERAK',
    'KAMPAR',
    'MUALLIM',
    'BAGAN DATUK',
  ],
  'KEDAH': [
    'KOTA SETAR',
    'KUALA MUDA',
    'KULIM',
    'KUBANG PASU',
    'BALING',
    'LANGKAWI',
    'PENDANG',
    'YAN',
    'SIK',
    'PADANG TERAP',
    'POKOK SENA',
    'BANDAR BAHARU',
  ],
  'PULAU PINANG': [
    'TIMUR LAUT',
    'BARAT DAYA',
    'SEBERANG PERAI UTARA',
    'SEBERANG PERAI TENGAH',
    'SEBERANG PERAI SELATAN',
  ],
  'NEGERI SEMBILAN': [
    'SEREMBAN',
    'JEMPOL',
    'PORT DICKSON',
    'TAMPIN',
    'KUALA PILAH',
    'REMBAU',
    'JELEBU',
  ],
  'MELAKA': [
    'MELAKA TENGAH',
    'ALOR GAJAH',
    'JASIN',
  ],
  'PERLIS': [
    'PERLIS',
  ],
  'SABAH': [
    'KOTA KINABALU',
    'TAWAU',
    'SANDAKAN',
    'LAHAD DATU',
    'KENINGAU',
    'KINABATANGAN',
    'SEMPORNA',
    'PAPAR',
    'PENAMPANG',
    'BELURAN',
    'TUARAN',
    'RANAU',
    'KOTA BELUD',
    'KUDAT',
    'KOTA MARUDU',
    'BEAUFORT',
    'KUNAK',
    'TENOM',
    'PUTATAN',
    'PITAS',
    'TAMBUNAN',
    'TONGOD',
    'SIPITANG',
    'NABAWAN',
    'KUALA PENYU',
  ],
  'SARAWAK': [
    'KUCHING',
    'MIRI',
    'SIBU',
    'BINTULU',
    'SERIAN',
    'SAMARAHAN',
    'SRI AMAN',
    'MARUDI',
    'BETONG',
    'SARIKEI',
    'KAPIT',
    'BAU',
    'LIMBANG',
    'SARATOK',
    'MUKAH',
    'LAWAS',
  ],
  'W.P. KUALA LUMPUR': ['KUALA LUMPUR'],
  'W.P. PUTRAJAYA': ['PUTRAJAYA'],
  'W.P. LABUAN': ['LABUAN'],
};

/**
 * Mengenal pasti Daerah Pentadbiran & Negeri secara automatik berdasarkan 5 digit poskod Malaysia.
 */
export function lookupPoskodMalaysia(rawPoskod: string): PoskodLocation | null {
  const clean = (rawPoskod || '').replace(/\D/g, '');
  if (clean.length < 5) return null;

  const code = parseInt(clean.substring(0, 5), 10);
  if (isNaN(code)) return null;

  // ================= PERLIS (01000 - 02999) =================
  if (code >= 1000 && code <= 2999) {
    return { daerah: 'PERLIS', negeri: 'PERLIS' };
  }

  // ================= KEDAH (05000 - 09999) =================
  if (code >= 5000 && code <= 9999) {
    if (code >= 5000 && code <= 5999) return { daerah: 'KOTA SETAR', negeri: 'KEDAH' };
    if (code >= 6000 && code <= 6299) return { daerah: 'KUBANG PASU', negeri: 'KEDAH' };
    if (code >= 6300 && code <= 6399) return { daerah: 'PADANG TERAP', negeri: 'KEDAH' };
    if (code >= 6400 && code <= 6499) return { daerah: 'POKOK SENA', negeri: 'KEDAH' };
    if (code >= 6500 && code <= 6699) return { daerah: 'KOTA SETAR', negeri: 'KEDAH' };
    if (code >= 6700 && code <= 6799) return { daerah: 'PENDANG', negeri: 'KEDAH' };
    if (code >= 6800 && code <= 6999) return { daerah: 'YAN', negeri: 'KEDAH' };
    if (code >= 7000 && code <= 7999) return { daerah: 'LANGKAWI', negeri: 'KEDAH' };
    if (code >= 8000 && code <= 8199) return { daerah: 'KUALA MUDA', negeri: 'KEDAH' };
    if (code >= 8200 && code <= 8299) return { daerah: 'SIK', negeri: 'KEDAH' };
    if (code >= 8300 && code <= 8999) return { daerah: 'KUALA MUDA', negeri: 'KEDAH' };
    if (code >= 9000 && code <= 9099) return { daerah: 'KULIM', negeri: 'KEDAH' };
    if (code >= 9100 && code <= 9399) return { daerah: 'BALING', negeri: 'KEDAH' };
    if (code >= 9400 && code <= 9799) return { daerah: 'KULIM', negeri: 'KEDAH' };
    if (code >= 9800 && code <= 9999) return { daerah: 'BANDAR BAHARU', negeri: 'KEDAH' };
    return { daerah: 'KOTA SETAR', negeri: 'KEDAH' };
  }

  // ================= PULAU PINANG (10000 - 14999) =================
  if (code >= 10000 && code <= 14999) {
    if (code >= 10000 && code <= 10999) return { daerah: 'TIMUR LAUT', negeri: 'PULAU PINANG' };
    if (code >= 11000 && code <= 11099) return { daerah: 'BARAT DAYA', negeri: 'PULAU PINANG' };
    if (code >= 11100 && code <= 11899) return { daerah: 'TIMUR LAUT', negeri: 'PULAU PINANG' };
    if (code >= 11900 && code <= 11999) return { daerah: 'BARAT DAYA', negeri: 'PULAU PINANG' };
    if (code >= 12000 && code <= 13499) return { daerah: 'SEBERANG PERAI UTARA', negeri: 'PULAU PINANG' };
    if (code >= 13500 && code <= 14199) return { daerah: 'SEBERANG PERAI TENGAH', negeri: 'PULAU PINANG' };
    if (code >= 14200 && code <= 14999) return { daerah: 'SEBERANG PERAI SELATAN', negeri: 'PULAU PINANG' };
  }

  // ================= KELANTAN (15000 - 18999) =================
  if (code >= 15000 && code <= 18999) {
    if (code >= 15000 && code <= 16199) return { daerah: 'KOTA BHARU', negeri: 'KELANTAN' };
    if (code >= 16200 && code <= 16299) return { daerah: 'TUMPAT', negeri: 'KELANTAN' };
    if (code >= 16300 && code <= 16399) return { daerah: 'BACHOK', negeri: 'KELANTAN' };
    if (code >= 16400 && code <= 16599) return { daerah: 'KOTA BHARU', negeri: 'KELANTAN' };
    if (code >= 16600 && code <= 16699) return { daerah: 'MACHANG', negeri: 'KELANTAN' };
    if (code >= 16700 && code <= 16799) return { daerah: 'KUALA KRAI', negeri: 'KELANTAN' };
    if (code >= 16800 && code <= 16999) return { daerah: 'PASIR PUTEH', negeri: 'KELANTAN' };
    if (code >= 17000 && code <= 17499) return { daerah: 'PASIR MAS', negeri: 'KELANTAN' };
    if (code >= 17500 && code <= 17599) return { daerah: 'TANAH MERAH', negeri: 'KELANTAN' };
    if (code >= 17600 && code <= 17999) return { daerah: 'JELI', negeri: 'KELANTAN' };
    if (code >= 18000 && code <= 18299) return { daerah: 'KUALA KRAI', negeri: 'KELANTAN' };
    if (code >= 18300 && code <= 18499) return { daerah: 'GUA MUSANG', negeri: 'KELANTAN' };
    if (code >= 18500 && code <= 18999) return { daerah: 'MACHANG', negeri: 'KELANTAN' };
    return { daerah: 'KOTA BHARU', negeri: 'KELANTAN' };
  }

  // ================= TERENGGANU (20000 - 24999) =================
  if (code >= 20000 && code <= 24999) {
    if (code === 21090 || (code >= 22100 && code <= 22199)) return { daerah: 'SETIU', negeri: 'TERENGGANU' };
    if (code >= 21020 && code <= 21030) return { daerah: 'KUALA NERUS', negeri: 'TERENGGANU' };
    if (code >= 21200 && code <= 21399) return { daerah: 'KUALA NERUS', negeri: 'TERENGGANU' };
    if (code >= 20000 && code <= 21199) return { daerah: 'KUALA TERENGGANU', negeri: 'TERENGGANU' };
    if (code >= 21400 && code <= 21699) return { daerah: 'MARANG', negeri: 'TERENGGANU' };
    if (code >= 21700 && code <= 21999) return { daerah: 'HULU TERENGGANU', negeri: 'TERENGGANU' };
    if (code >= 22000 && code <= 22999) return { daerah: 'BESUT', negeri: 'TERENGGANU' };
    if (code >= 23000 && code <= 23999) return { daerah: 'DUNGUN', negeri: 'TERENGGANU' };
    if (code >= 24000 && code <= 24999) return { daerah: 'KEMAMAN', negeri: 'TERENGGANU' };
  }

  // ================= PAHANG (25000 - 28999, 39000, 49000, 69000) =================
  if ((code >= 25000 && code <= 28999) || (code >= 39000 && code <= 39999) || (code >= 49000 && code <= 49999) || (code >= 69000 && code <= 69999)) {
    if (code >= 39000 && code <= 39999) return { daerah: 'CAMERON HIGHLANDS', negeri: 'PAHANG' };
    if (code >= 49000 && code <= 49999) return { daerah: 'RAUB', negeri: 'PAHANG' }; // Bukit Fraser
    if (code >= 69000 && code <= 69999) return { daerah: 'BENTONG', negeri: 'PAHANG' }; // Genting Highlands
    if (code === 26200 || code === 26700 || (code >= 26800 && code <= 26999)) return { daerah: 'ROMPIN', negeri: 'PAHANG' };
    if (code >= 25000 && code <= 26399) return { daerah: 'KUANTAN', negeri: 'PAHANG' };
    if ((code >= 26400 && code <= 26599) || (code >= 28100 && code <= 28199)) return { daerah: 'MARAN', negeri: 'PAHANG' }; // Jengka, Maran, Chenor
    if (code >= 26600 && code <= 26699) return { daerah: 'PEKAN', negeri: 'PAHANG' };
    if (code >= 27000 && code <= 27199) return { daerah: 'JERANTUT', negeri: 'PAHANG' };
    if ((code >= 27200 && code <= 27599) || code === 27650) return { daerah: 'LIPIS', negeri: 'PAHANG' };
    if (code >= 27600 && code <= 27999) return { daerah: 'RAUB', negeri: 'PAHANG' };
    if ((code >= 28000 && code <= 28099) || (code >= 28400 && code <= 28599)) return { daerah: 'TEMERLOH', negeri: 'PAHANG' };
    if (code >= 28200 && code <= 28399) return { daerah: 'BERA', negeri: 'PAHANG' };
    if (code >= 28600 && code <= 28999) return { daerah: 'BENTONG', negeri: 'PAHANG' };
    return { daerah: 'JERANTUT', negeri: 'PAHANG' };
  }

  // ================= PERAK (30000 - 36999) =================
  if (code >= 30000 && code <= 36999) {
    if (code >= 30000 && code <= 31699) return { daerah: 'KINTA', negeri: 'PERAK' }; // Ipoh, Batu Gajah, Tanjung Rambutan
    if (code >= 31700 && code <= 31999) return { daerah: 'KAMPAR', negeri: 'PERAK' }; // Malim Nawar, Gopeng, Kampar
    if (code >= 32000 && code <= 32599) return { daerah: 'MANJUNG', negeri: 'PERAK' }; // Sitiawan, Lumut, Ayer Tawar, Pangkor
    if (code >= 32600 && code <= 32999) return { daerah: 'PERAK TENGAH', negeri: 'PERAK' }; // Seri Iskandar, Bota, Parit
    if (code >= 33000 && code <= 33299) return { daerah: 'KUALA KANGSAR', negeri: 'PERAK' };
    if (code >= 33300 && code <= 33999) return { daerah: 'HULU PERAK', negeri: 'PERAK' }; // Gerik, Pengkalan Hulu, Lenggong
    if (code >= 34000 && code <= 34199) return { daerah: 'LARUT, MATANG DAN SELAMA', negeri: 'PERAK' }; // Taiping, Selama
    if (code >= 34200 && code <= 34499) return { daerah: 'KERIAN', negeri: 'PERAK' }; // Parit Buntar, Bagan Serai, Semanggol
    if (code >= 34500 && code <= 34999) return { daerah: 'LARUT, MATANG DAN SELAMA', negeri: 'PERAK' }; // Batu Kurau, Changkat Jering, Trong
    if (code >= 35000 && code <= 35799) return { daerah: 'BATANG PADANG', negeri: 'PERAK' }; // Tapah, Bidor, Sungkai, Trolak
    if (code >= 35800 && code <= 35999) return { daerah: 'MUALLIM', negeri: 'PERAK' }; // Slim River, Tanjong Malim
    if (code >= 36000 && code <= 36099) return { daerah: 'HILIR PERAK', negeri: 'PERAK' }; // Teluk Intan
    if (code >= 36100 && code <= 36399) return { daerah: 'BAGAN DATUK', negeri: 'PERAK' }; // Bagan Datuk, Hutan Melintang
    if (code >= 36400 && code <= 36799) return { daerah: 'HILIR PERAK', negeri: 'PERAK' }; // Langkap, Chenderong Balai
    if (code >= 36800 && code <= 36999) return { daerah: 'PERAK TENGAH', negeri: 'PERAK' }; // Kampung Gajah
    return { daerah: 'KINTA', negeri: 'PERAK' };
  }

  // ================= SELANGOR (40000 - 48999, 63000 - 64999, 68000 - 68199) =================
  if ((code >= 40000 && code <= 48999) || (code >= 63000 && code <= 64999) || (code >= 68000 && code <= 68199)) {
    if (code >= 40000 && code <= 40999) return { daerah: 'PETALING', negeri: 'SELANGOR' }; // Shah Alam
    if (code >= 41000 && code <= 42299) return { daerah: 'KLANG', negeri: 'SELANGOR' }; // Klang, Kapar, Meru
    if (code === 42300) return { daerah: 'KUALA SELANGOR', negeri: 'SELANGOR' }; // Bandar Puncak Alam
    if (code >= 42400 && code <= 42499) return { daerah: 'KLANG', negeri: 'SELANGOR' };
    if (code >= 42500 && code <= 42999) return { daerah: 'KUALA LANGAT', negeri: 'SELANGOR' }; // Telok Panglima Garang, Banting, Jenjarom
    if (code >= 43000 && code <= 43299) return { daerah: 'HULU LANGAT', negeri: 'SELANGOR' }; // Kajang, Hulu Langat, Cheras
    if (code >= 43300 && code <= 43399) return { daerah: 'PETALING', negeri: 'SELANGOR' }; // Seri Kembangan
    if (code >= 43400 && code <= 43499) return { daerah: 'SEPANG', negeri: 'SELANGOR' }; // Serdang / UPM
    if (code >= 43500 && code <= 43799) return { daerah: 'HULU LANGAT', negeri: 'SELANGOR' }; // Semenyih, Bangi, Beranang
    if ((code >= 43800 && code <= 43999) || (code >= 63000 && code <= 64999)) return { daerah: 'SEPANG', negeri: 'SELANGOR' }; // Dengkil, Sepang, Cyberjaya, KLIA
    if (code >= 44000 && code <= 44999) return { daerah: 'HULU SELANGOR', negeri: 'SELANGOR' }; // Kuala Kubu Bharu, Rasa, Batang Kali, Kerling
    if (code >= 45000 && code <= 45099) return { daerah: 'KUALA SELANGOR', negeri: 'SELANGOR' };
    if (code >= 45100 && code <= 45499) return { daerah: 'SABAK BERNAM', negeri: 'SELANGOR' }; // Sungai Air Tawar, Sabak Bernam, Sungai Besar, Sekinchan
    if (code >= 45500 && code <= 45999) return { daerah: 'KUALA SELANGOR', negeri: 'SELANGOR' }; // Tanjong Karang, Bestari Jaya, Jeram
    if (code >= 46000 && code <= 47999) return { daerah: 'PETALING', negeri: 'SELANGOR' }; // PJ, Subang Jaya, Puchong, Sungai Buloh
    if (code >= 48000 && code <= 48199) return { daerah: 'GOMBAK', negeri: 'SELANGOR' }; // Rawang, Batu Arang
    if (code >= 48200 && code <= 48999) return { daerah: 'HULU SELANGOR', negeri: 'SELANGOR' }; // Serendah, Bukit Beruntung
    if (code >= 68000 && code <= 68099) return { daerah: 'HULU LANGAT', negeri: 'SELANGOR' }; // Ampang
    if (code >= 68100 && code <= 68199) return { daerah: 'GOMBAK', negeri: 'SELANGOR' }; // Batu Caves, Gombak, Selayang
    return { daerah: 'PETALING', negeri: 'SELANGOR' };
  }

  // ================= W.P. KUALA LUMPUR (50000 - 60999) =================
  if (code >= 50000 && code <= 60999) {
    return { daerah: 'KUALA LUMPUR', negeri: 'W.P. KUALA LUMPUR' };
  }

  // ================= W.P. PUTRAJAYA (62000 - 62999) =================
  if (code >= 62000 && code <= 62999) {
    return { daerah: 'PUTRAJAYA', negeri: 'W.P. PUTRAJAYA' };
  }

  // ================= NEGERI SEMBILAN (70000 - 73999) =================
  if (code >= 70000 && code <= 73999) {
    if (code >= 70000 && code <= 70999) return { daerah: 'SEREMBAN', negeri: 'NEGERI SEMBILAN' };
    if (code >= 71000 && code <= 71199) return { daerah: 'PORT DICKSON', negeri: 'NEGERI SEMBILAN' }; // Port Dickson, Lukut, Rantau
    if (code >= 71200 && code <= 71299) return { daerah: 'SEREMBAN', negeri: 'NEGERI SEMBILAN' }; // Rantau / Lenggeng
    if (code >= 71300 && code <= 71499) return { daerah: 'REMBAU', negeri: 'NEGERI SEMBILAN' }; // Rembau, Kota, Pedas
    if (code >= 71500 && code <= 71599) return { daerah: 'KUALA PILAH', negeri: 'NEGERI SEMBILAN' }; // Tanjong Ipoh, Seri Menanti
    if (code >= 71600 && code <= 71699) return { daerah: 'JELEBU', negeri: 'NEGERI SEMBILAN' }; // Kuala Klawang, Pertang
    if (code >= 71700 && code <= 71999) return { daerah: 'SEREMBAN', negeri: 'NEGERI SEMBILAN' }; // Mantin, Nilai, Labu (71950 PD)
    if (code >= 72000 && code <= 72099) return { daerah: 'KUALA PILAH', negeri: 'NEGERI SEMBILAN' };
    if (code >= 72100 && code <= 72299) return { daerah: 'JEMPOL', negeri: 'NEGERI SEMBILAN' }; // Bahau, Batu Kikir, Bandar Seri Jempol
    if (code >= 72300 && code <= 72499) return { daerah: 'JELEBU', negeri: 'NEGERI SEMBILAN' }; // SimpangPertang, Simpang Durian
    if (code >= 72500 && code <= 72999) return { daerah: 'KUALA PILAH', negeri: 'NEGERI SEMBILAN' }; // Juasseh, Johol
    if (code >= 73000 && code <= 73499) return { daerah: 'TAMPIN', negeri: 'NEGERI SEMBILAN' }; // Tampin, Gemencheh, Gemas
    if (code >= 73500 && code <= 73999) return { daerah: 'JEMPOL', negeri: 'NEGERI SEMBILAN' }; // Rompin NS
    return { daerah: 'SEREMBAN', negeri: 'NEGERI SEMBILAN' };
  }

  // ================= MELAKA (75000 - 78999) =================
  if (code >= 75000 && code <= 78999) {
    if (code >= 75000 && code <= 75999) return { daerah: 'MELAKA TENGAH', negeri: 'MELAKA' };
    if (code >= 76000 && code <= 76499) return { daerah: 'MELAKA TENGAH', negeri: 'MELAKA' }; // Tanjong Kling, Kem Trendak, Sungai Udang
    if (code >= 77000 && code <= 77999) return { daerah: 'JASIN', negeri: 'MELAKA' }; // Jasin, Asahan, Bemban, Merlimau, Selandar
    if (code >= 78000 && code <= 78999) return { daerah: 'ALOR GAJAH', negeri: 'MELAKA' }; // Alor Gajah, Masjid Tanah, Tampin/Pulau Sebang, Durian Tunggal
    return { daerah: 'MELAKA TENGAH', negeri: 'MELAKA' };
  }

  // ================= JOHOR (79000 - 86999) =================
  if (code >= 79000 && code <= 86999) {
    if (code === 86810) return { daerah: 'ROMPIN', negeri: 'PAHANG' }; // Pulau Tioman (poskod 86810 tetapi daerah Rompin, Pahang)
    if (code >= 79000 && code <= 80999) return { daerah: 'JOHOR BAHRU', negeri: 'JOHOR' };
    if (code >= 81000 && code <= 81099) return { daerah: 'KULAI', negeri: 'JOHOR' };
    if (code >= 81100 && code <= 81399) return { daerah: 'JOHOR BAHRU', negeri: 'JOHOR' };
    if (code >= 81400 && code <= 81499) return { daerah: 'KULAI', negeri: 'JOHOR' };
    if (code >= 81500 && code <= 81549) return { daerah: 'PONTIAN', negeri: 'JOHOR' }; // Pekan Nanas
    if (code >= 81550 && code <= 81599) return { daerah: 'JOHOR BAHRU', negeri: 'JOHOR' }; // Gelang Patah
    if (code >= 81600 && code <= 81699) return { daerah: 'KOTA TINGGI', negeri: 'JOHOR' }; // Pengerang
    if (code >= 81700 && code <= 81899) return { daerah: 'JOHOR BAHRU', negeri: 'JOHOR' }; // Pasir Gudang, Masai, Ulu Tiram
    if (code >= 81900 && code <= 81999) return { daerah: 'KOTA TINGGI', negeri: 'JOHOR' };
    if (code >= 82000 && code <= 82999) return { daerah: 'PONTIAN', negeri: 'JOHOR' };
    if (code >= 83000 && code <= 83999) return { daerah: 'BATU PAHAT', negeri: 'JOHOR' };
    if (code >= 84000 && code <= 84699) return { daerah: 'MUAR', negeri: 'JOHOR' };
    if (code >= 84700 && code <= 84999) return { daerah: 'TANGKAK', negeri: 'JOHOR' }; // Gerisek, Bukit Gambir, Tangkak
    if (code >= 85000 && code <= 85999) return { daerah: 'SEGAMAT', negeri: 'JOHOR' };
    if (code >= 86000 && code <= 86799) return { daerah: 'KLUANG', negeri: 'JOHOR' };
    if (code >= 86800 && code <= 86999) return { daerah: 'MERSING', negeri: 'JOHOR' };
    return { daerah: 'JOHOR BAHRU', negeri: 'JOHOR' };
  }

  // ================= W.P. LABUAN (87000 - 87999) =================
  if (code >= 87000 && code <= 87999) {
    return { daerah: 'LABUAN', negeri: 'W.P. LABUAN' };
  }

  // ================= SABAH (88000 - 91999) =================
  if (code >= 88000 && code <= 91999) {
    if (code >= 88000 && code <= 88999) return { daerah: 'KOTA KINABALU', negeri: 'SABAH' };
    if (code >= 89000 && code <= 89099) return { daerah: 'KENINGAU', negeri: 'SABAH' };
    if (code >= 89100 && code <= 89149) return { daerah: 'KOTA MARUDU', negeri: 'SABAH' };
    if (code >= 89150 && code <= 89199) return { daerah: 'KOTA BELUD', negeri: 'SABAH' };
    if (code >= 89200 && code <= 89299) return { daerah: 'TUARAN', negeri: 'SABAH' };
    if (code >= 89300 && code <= 89399) return { daerah: 'RANAU', negeri: 'SABAH' };
    if (code >= 89500 && code <= 89599) return { daerah: 'PENAMPANG', negeri: 'SABAH' };
    if (code >= 89600 && code <= 89699) return { daerah: 'PAPAR', negeri: 'SABAH' };
    if (code >= 89700 && code <= 89799) return { daerah: 'BEAUFORT', negeri: 'SABAH' };
    if (code >= 89800 && code <= 89899) return { daerah: 'BEAUFORT', negeri: 'SABAH' };
    if (code >= 89900 && code <= 89999) return { daerah: 'TENOM', negeri: 'SABAH' };
    if (code >= 90000 && code <= 90999) return { daerah: 'SANDAKAN', negeri: 'SABAH' };
    if (code >= 91000 && code <= 91099) return { daerah: 'TAWAU', negeri: 'SABAH' };
    if (code >= 91100 && code <= 91199) return { daerah: 'LAHAD DATU', negeri: 'SABAH' };
    if (code >= 91200 && code <= 91299) return { daerah: 'KUNAK', negeri: 'SABAH' };
    if (code >= 91300 && code <= 91999) return { daerah: 'SEMPORNA', negeri: 'SABAH' };
    return { daerah: 'KOTA KINABALU', negeri: 'SABAH' };
  }

  // ================= SARAWAK (93000 - 98999) =================
  if (code >= 93000 && code <= 98999) {
    if (code >= 93000 && code <= 93999) return { daerah: 'KUCHING', negeri: 'SARAWAK' };
    if (code >= 94000 && code <= 94299) return { daerah: 'BAU', negeri: 'SARAWAK' };
    if (code >= 94300 && code <= 94699) return { daerah: 'SAMARAHAN', negeri: 'SARAWAK' };
    if (code >= 94700 && code <= 94999) return { daerah: 'SERIAN', negeri: 'SARAWAK' };
    if (code >= 95000 && code <= 95399) return { daerah: 'SRI AMAN', negeri: 'SARAWAK' };
    if (code >= 95400 && code <= 95999) return { daerah: 'BETONG', negeri: 'SARAWAK' };
    if (code >= 96000 && code <= 96399) return { daerah: 'SIBU', negeri: 'SARAWAK' };
    if (code >= 96400 && code <= 96499) return { daerah: 'MUKAH', negeri: 'SARAWAK' };
    if (code >= 96500 && code <= 96799) return { daerah: 'SARIKEI', negeri: 'SARAWAK' };
    if (code >= 96800 && code <= 96999) return { daerah: 'KAPIT', negeri: 'SARAWAK' };
    if (code >= 97000 && code <= 97999) return { daerah: 'BINTULU', negeri: 'SARAWAK' };
    if (code >= 98000 && code <= 98699) return { daerah: 'MIRI', negeri: 'SARAWAK' };
    if (code >= 98700 && code <= 98799) return { daerah: 'LIMBANG', negeri: 'SARAWAK' };
    if (code >= 98800 && code <= 98999) return { daerah: 'LAWAS', negeri: 'SARAWAK' };
    return { daerah: 'KUCHING', negeri: 'SARAWAK' };
  }

  return null;
}

/**
 * Menyelaraskan (Normalize) nama Daerah & Negeri bagi rekod calon sedia ada
 * supaya variasi ejaan (cth: "BANDAR JENGKA", "BANDAR TUN ABDUL RAZAK", "KOTA GELANGGI", "KUALA LIPIS", "MENTAKAB")
 * dikumpulkan ke dalam Daerah Pentadbiran rasmi yang sama untuk Analisis yang tepat.
 */
export function normalizeCandidateDaerahNegeri(candidate: {
  poskod?: string;
  daerah?: string;
  negeri?: string;
  alamat1?: string;
  alamat2?: string;
  poskodBapa?: string;
  poskodIbu?: string;
}): PoskodLocation {
  // 1. Jika ada poskod 5 digit yang sah, utamakan pengesanan poskod rasmi
  if (candidate.poskod) {
    const byPoskod = lookupPoskodMalaysia(candidate.poskod);
    if (byPoskod) {
      return byPoskod;
    }
  }

  // 2. Semak jika poskod tertulis di dalam alamat1 / alamat2 atau poskodBapa / poskodIbu
  const combinedAddress = `${candidate.alamat1 || ''} ${candidate.alamat2 || ''} ${candidate.daerah || ''}`;
  const addressPostcodeMatch = combinedAddress.match(/\b(\d{5})\b/);
  if (addressPostcodeMatch) {
    const byAddrPoskod = lookupPoskodMalaysia(addressPostcodeMatch[1]);
    if (byAddrPoskod) {
      return byAddrPoskod;
    }
  }
  if (candidate.poskodBapa) {
    const byBapa = lookupPoskodMalaysia(candidate.poskodBapa);
    if (byBapa && (!candidate.daerah || candidate.daerah === '-')) {
      return byBapa;
    }
  }
  if (candidate.poskodIbu) {
    const byIbu = lookupPoskodMalaysia(candidate.poskodIbu);
    if (byIbu && (!candidate.daerah || candidate.daerah === '-')) {
      return byIbu;
    }
  }

  let rawNegeri = (candidate.negeri || '').trim().toUpperCase();
  let rawDaerah = `${candidate.daerah || ''} ${candidate.alamat1 || ''} ${candidate.alamat2 || ''}`.trim().toUpperCase();

  // Bersihkan perkataan umum seperti "DAERAH", "BANDAR", "FELDA" jika ditulis bersama nama daerah
  const cleanDaerahOnly = (candidate.daerah || '')
    .trim()
    .toUpperCase()
    .replace(/^DAERAH\s+/i, '')
    .replace(/\s+PAHANG$/i, '')
    .replace(/\s+SELANGOR$/i, '')
    .replace(/\s+TERENGGANU$/i, '')
    .replace(/\s+KELANTAN$/i, '')
    .replace(/\s+JOHOR$/i, '')
    .trim();

  // Pemetaan pintar variasi kawasan/pekan kepada Daerah Pentadbiran Rasmi
  if (
    rawDaerah.includes('JERANTUT') ||
    rawDaerah.includes('GELANGGI') ||
    rawDaerah.includes('DAMAK') ||
    rawDaerah.includes('PADANG PIOL') ||
    rawDaerah.includes('TEMBELING') ||
    rawDaerah.includes('PULAU TAWAR') ||
    rawDaerah.includes('LEPAR UTARA')
  ) {
    return { daerah: 'JERANTUT', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('JENGKA') ||
    rawDaerah.includes('TUN ABDUL RAZAK') ||
    rawDaerah.includes('TUN RAZAK') ||
    rawDaerah.includes('MARAN') ||
    rawDaerah.includes('CHENOR') ||
    rawDaerah.includes('LUI') ||
    rawDaerah.includes(' BUKIT TAJAU')
  ) {
    return { daerah: 'MARAN', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('TEMERLOH') ||
    rawDaerah.includes('MENTAKAB') ||
    rawDaerah.includes('LANCHANG') ||
    rawDaerah.includes('KUALA KRAU') ||
    rawDaerah.includes('KERDAU')
  ) {
    return { daerah: 'TEMERLOH', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('LIPIS') ||
    rawDaerah.includes('BENTA') ||
    rawDaerah.includes('PADANG TENGKU') ||
    rawDaerah.includes('MERAPOH') ||
    rawDaerah.includes('KOYAN') ||
    rawDaerah.includes('KERAMBIT')
  ) {
    return { daerah: 'LIPIS', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('KUANTAN') ||
    rawDaerah.includes('GAMBANG') ||
    rawDaerah.includes('INDERA MAHKOTA') ||
    rawDaerah.includes('BESERAH') ||
    rawDaerah.includes('SUNGAI LEMBING') ||
    rawDaerah.includes('BALOK') ||
    rawDaerah.includes('JAYA GADING')
  ) {
    return { daerah: 'KUANTAN', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('PEKAN') ||
    rawDaerah.includes('CHINI') ||
    rawDaerah.includes('PALOH HINAI') ||
    rawDaerah.includes('NENASI')
  ) {
    return { daerah: 'PEKAN', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('ROMPIN') ||
    rawDaerah.includes('MUADZAM') ||
    rawDaerah.includes('KERATONG') ||
    rawDaerah.includes('TIOMAN')
  ) {
    return { daerah: 'ROMPIN', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('RAUB') ||
    rawDaerah.includes('DONG') ||
    rawDaerah.includes('CHEROH') ||
    rawDaerah.includes('BUKIT FRASER')
  ) {
    return { daerah: 'RAUB', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('BENTONG') ||
    rawDaerah.includes('KARAK') ||
    rawDaerah.includes('GENTING') ||
    rawDaerah.includes('LURAH BILUT') ||
    rawDaerah.includes('MEMPAGA')
  ) {
    return { daerah: 'BENTONG', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('BERA') ||
    rawDaerah.includes('TRIANG') ||
    rawDaerah.includes('KEMAYAN') ||
    rawDaerah.includes('KERAYONG') ||
    rawDaerah.includes('PURUN')
  ) {
    return { daerah: 'BERA', negeri: rawNegeri || 'PAHANG' };
  }

  if (
    rawDaerah.includes('CAMERON') ||
    rawDaerah.includes('TANAH RATA') ||
    rawDaerah.includes('BRINCHANG') ||
    rawDaerah.includes('RINGLET')
  ) {
    return { daerah: 'CAMERON HIGHLANDS', negeri: rawNegeri || 'PAHANG' };
  }

  // Selangor & KL common variations
  if (rawDaerah.includes('SHAH ALAM') || rawDaerah.includes('PETALING') || rawDaerah.includes('SUBANG') || rawDaerah.includes('PUCHONG') || rawDaerah.includes('DAMANSARA')) {
    return { daerah: 'PETALING', negeri: 'SELANGOR' };
  }
  if (rawDaerah.includes('KAJANG') || rawDaerah.includes('BANGI') || rawDaerah.includes('SEMENYIH') || rawDaerah.includes('HULU LANGAT') || rawDaerah.includes('AMPANG')) {
    return { daerah: 'HULU LANGAT', negeri: 'SELANGOR' };
  }
  if (rawDaerah.includes('BATU CAVES') || rawDaerah.includes('SELAYANG') || rawDaerah.includes('RAWANG') || rawDaerah.includes('GOMBAK')) {
    return { daerah: 'GOMBAK', negeri: 'SELANGOR' };
  }
  if (rawDaerah.includes('KUALA LUMPUR') || rawNegeri.includes('KUALA LUMPUR')) {
    return { daerah: 'KUALA LUMPUR', negeri: 'W.P. KUALA LUMPUR' };
  }
  if (rawDaerah.includes('PUTRAJAYA') || rawNegeri.includes('PUTRAJAYA')) {
    return { daerah: 'PUTRAJAYA', negeri: 'W.P. PUTRAJAYA' };
  }

  return {
    daerah: cleanDaerahOnly || 'TIADA MAKLUMAT',
    negeri: rawNegeri || 'TIADA MAKLUMAT',
  };
}
