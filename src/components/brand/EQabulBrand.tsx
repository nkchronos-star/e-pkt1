import React from 'react';

/**
 * Image 2: Logo eQabul (Logo eQabul.png)
 * Reka bentuk lambang rasmi mengikut imej muat naik pengguna:
 * - Gerbang Mihrab Islamik berbingkai emas dengan corak hijau zamrud.
 * - Dua siluet murid (lelaki berkopiah/songkok, perempuan bertudung) melangkah ke pintu ilmu.
 * - Laluan keemasan (path of knowledge) menuju ke gerbang.
 * - Huruf 'e' dinamik zamrud dengan gugusan piksel digital di sebelah kiri bawah.
 * - Buku terbuka (Al-Quran / Kitab Ilmu) di sebelah kanan dengan lembaran bertingkat dan lambang tandatangan/semakan keemasan di atas.
 */
export const EQabulEmblem: React.FC<{ 
  className?: string; 
  size?: number;
  style?: React.CSSProperties;
  withBackground?: boolean;
}> = ({ 
  className = "w-14 h-14", 
  size,
  style 
}) => {
  return (
    <svg 
      viewBox="0 0 240 210" 
      className={className} 
      style={size ? { width: size, height: size, ...style } : style}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo e-QABUL Rasmi (Image 2)"
    >
      <defs>
        {/* Emerald Gradients */}
        <linearGradient id="embGreenMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="45%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id="embGreenDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#046c4e" />
          <stop offset="100%" stopColor="#023b2c" />
        </linearGradient>

        <linearGradient id="embGreenBright" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Gold Gradients */}
        <linearGradient id="embGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id="embGoldLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Arch Light Halo */}
        <radialGradient id="embArchGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="1" />
          <stop offset="45%" stopColor="#fef08a" stopOpacity="0.75" />
          <stop offset="85%" stopColor="#fefce8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Drop Shadow */}
        <filter id="embShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#042f24" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ================= 1. GERBANG MIHRAB ISLAMIK (ATAS) ================= */}
      <g filter="url(#embShadow)">
        {/* Bingkai Luar Kubah Emas */}
        <path 
          d="M68 135 V75 C68 45, 85 24, 118 10 C151 24, 168 45, 168 75 V135 Z" 
          fill="url(#embGoldMain)" 
        />

        {/* Gerbang Luar Hijau Zamrud Bertekstur */}
        <path 
          d="M72 135 V76 C72 48, 88 28, 118 15 C148 28, 164 48, 164 76 V135 Z" 
          fill="url(#embGreenDark)" 
        />

        {/* Motif Ukiran Islamik Halus dalam Gerbang */}
        <path 
          d="M118 16 V40 M98 48 L118 32 L138 48 M88 74 L118 52 L148 74" 
          stroke="#10b981" 
          strokeWidth="1.2" 
          strokeOpacity="0.35" 
        />

        {/* Gerbang Dalaman (Lengkungan Emas Kedua) */}
        <path 
          d="M84 135 V82 C84 60, 96 42, 118 32 C140 42, 152 60, 152 82 V135 Z" 
          fill="url(#embGoldMain)" 
        />

        {/* Pintu Cahaya Nur Putih/Kuning Berseri di Dalam Gerbang */}
        <path 
          d="M88 135 V84 C88 64, 99 47, 118 38 C137 47, 148 64, 148 84 V135 Z" 
          fill="#fefce8" 
        />
        <ellipse cx="118" cy="80" rx="24" ry="32" fill="url(#embArchGlow)" />

        {/* Dua Murid di Dalam Gerbang (Siluet Hijau Gelap Berilmu) */}
        {/* Murid Lelaki (Kiri): Berkopiah/Songkok & Beg Galas */}
        <g fill="#064e3b">
          {/* Songkok */}
          <path d="M102 69 H111 V73 H102 Z" />
          <line x1="102" y1="72" x2="111" y2="72" stroke="#facc15" strokeWidth="0.6" />
          {/* Kepala & Leher */}
          <circle cx="106.5" cy="77" r="3.6" />
          <path d="M100 95 C100 87, 102 83, 106.5 83 C111 83, 113 87, 113 95 H100 Z" />
          {/* Beg Galas */}
          <path d="M97 86 C97 83, 100 83, 100 88 V95 H97 Z" />
        </g>

        {/* Murid Perempuan (Kanan): Bertudung Kemas & Beg Galas */}
        <g fill="#064e3b">
          {/* Tudung */}
          <path d="M125 72 C120 72, 117 76, 117 82 C117 89, 120 95, 126 95 C132 95, 135 89, 135 82 C135 76, 131 72, 125 72 Z" />
          <ellipse cx="125" cy="78" rx="3.2" ry="3.8" fill="#fefce8" />
          {/* Badan & Beg */}
          <path d="M118 95 C118 90, 122 86, 126 86 C130 86, 134 90, 134 95 H118 Z" />
          <path d="M132 86 C134 86, 135 89, 135 94 H133 Z" />
        </g>

        {/* Tiang & Pangkal Gerbang Emas */}
        <rect x="66" y="132" width="104" height="4" rx="1.5" fill="url(#embGoldMain)" />
      </g>

      {/* ================= 2. LALUAN KEEMASAN (PATH OF KNOWLEDGE) ================= */}
      {/* Laluan melengkung dari bawah ke arah gerbang pintu */}
      <path 
        d="M106 134 C108 148, 122 158, 140 162 C125 158, 116 148, 116 134 Z" 
        fill="url(#embGoldMain)" 
      />

      {/* ================= 3. HURUF 'e' DINAMIK HIJAU ZAMRUD ================= */}
      <g filter="url(#embShadow)">
        {/* Lengkungan Luar Huruf 'e' Zamrud 3D */}
        <path 
          d="M58 168 C38 168, 22 152, 28 132 C33 116, 52 104, 78 104 C112 104, 136 122, 144 142 C126 130, 96 126, 76 132 C54 138, 44 150, 56 160 C66 168, 86 168, 110 162 C126 158, 142 148, 154 136 C140 156, 118 174, 88 180 C78 182, 68 182, 58 180 C40 176, 36 162, 44 152 C48 147, 56 144, 66 142 C56 144, 48 152, 50 160 C52 166, 62 170, 74 168 Z" 
          fill="url(#embGreenMain)" 
        />

        {/* Garis Kilauan Hijau Berseri Pada Lengkungan Atas 'e' */}
        <path 
          d="M38 128 C46 114, 64 106, 86 106 C114 106, 136 120, 144 136" 
          stroke="url(#embGreenBright)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />

        {/* Lengkungan Dalaman & Jalur Tengah 'e' */}
        <path 
          d="M62 136 C78 130, 102 132, 124 142 C108 136, 86 136, 68 142 Z" 
          fill="#34d399" 
          opacity="0.8" 
        />
      </g>

      {/* Piksel Digital Kubus Hijau Zamrud & Emas di Bawah Kiri */}
      <g fill="#10b981">
        <rect x="6" y="156" width="6" height="6" rx="1.2" />
        <rect x="14" y="148" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="157" width="6.5" height="6.5" rx="1.2" fill="#059669" />
        <rect x="14" y="166" width="6.5" height="6.5" rx="1.2" fill="#047857" />
        <rect x="22" y="140" width="7" height="7" rx="1.5" fill="#facc15" />
        <rect x="22" y="150" width="7" height="7" rx="1.5" />
        <rect x="22" y="160" width="7" height="7" rx="1.5" fill="#059669" />
        <rect x="31" y="132" width="7.5" height="7.5" rx="1.5" fill="#34d399" />
        <rect x="31" y="142" width="7.5" height="7.5" rx="1.5" fill="#10b981" />
      </g>

      {/* ================= 4. BUKU TERBUKA (KITAB / AL-QURAN) & SAYAP ILMU ================= */}
      <g filter="url(#embShadow)">
        {/* Lembaran Bawah Emas (Open Bottom Page) */}
        <path 
          d="M106 172 C126 166, 158 168, 196 182 C184 172, 154 162, 134 162 C120 162, 110 166, 106 172 Z" 
          fill="url(#embGoldMain)" 
        />
        <path 
          d="M108 174 C132 168, 166 172, 206 190 C190 178, 156 168, 132 168 Z" 
          fill="url(#embGoldLight)" 
        />

        {/* Lembaran-lembaran Buku Tengah (Fanned Green & White Pages) */}
        <path 
          d="M120 156 C140 148, 172 152, 202 168 C188 156, 158 146, 138 148 Z" 
          fill="#064e3b" 
        />
        <path 
          d="M124 152 C146 142, 178 146, 206 160 C192 148, 162 140, 142 142 Z" 
          fill="#ffffff" 
          stroke="#d97706" 
          strokeWidth="0.8" 
        />
        <path 
          d="M130 146 C152 134, 184 138, 210 150 C196 138, 166 132, 146 136 Z" 
          fill="#047857" 
        />

        {/* Sayap / Tandatangan Emas Melambangkan Kelulusan (QABUL) di Puncak Kanan */}
        <path 
          d="M140 134 C160 114, 182 98, 198 88 C188 114, 168 132, 144 142 C140 140, 138 136, 140 134 Z" 
          fill="url(#embGoldMain)" 
        />
        <path 
          d="M142 132 C164 110, 188 94, 204 84 C192 110, 172 130, 146 140 Z" 
          fill="url(#embGoldLight)" 
        />
        <circle cx="202" cy="86" r="2.5" fill="#fde047" />
      </g>
    </svg>
  );
};

/**
 * Image 3: eQabul Melintang (eQabul melintang.png)
 * Logo rasmi lengkap berorientasi mendatar (horizontal) untuk paparan di footer dan header:
 * - Sebelah Kiri: Lambang Logo e-QABUL (EQabulEmblem)
 * - Sebelah Kanan:
 *   - Teks besar "e-QABUL" (e- hijau cerah berpiksel, Q bertajuk & berekor emas, ABUL hijau zamrud)
 *   - Subtajuk "Sistem Kemasukan Digital SMAG3"
 *   - Cogan kata "— Permohonan Mudah, Tawaran Lebih Tersusun —" dengan garisan keemasan
 */
export const EQabulHorizontal: React.FC<{
  className?: string;
  theme?: 'light' | 'dark' | 'emerald';
}> = ({
  className = '',
  theme = 'light'
}) => {
  const isDark = theme === 'dark' || theme === 'emerald';
  const eColor = isDark ? '#34d399' : '#059669';
  const titleTextColor = isDark ? '#ffffff' : '#064e3b';
  const subtitleColor = isDark ? '#d1fae5' : '#1e293b';
  const taglineColor = isDark ? '#fef08a' : '#b45309';
  const lineColor = isDark ? '#facc15' : '#d97706';

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      {/* Lambang Vektor e-QABUL (Image 2) */}
      <div className="shrink-0 flex items-center justify-center">
        <EQabulEmblem className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-md" />
      </div>

      {/* Tipografi Rasmi e-QABUL (Image 3) */}
      <div className="flex flex-col justify-center min-w-0">
        {/* Baris 1: e-QABUL */}
        <div className="flex items-baseline font-black tracking-tight leading-none">
          {/* Huruf e- Hijau Zamrud Berkilau */}
          <span 
            className="text-3xl sm:text-4xl md:text-5xl font-black italic mr-0.5"
            style={{ color: eColor, textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : undefined }}
          >
            e-
          </span>

          {/* Huruf Q Hijau Zamrud dengan Ekor Emas Mewah */}
          <span 
            className="relative text-3xl sm:text-4xl md:text-5xl font-black" 
            style={{ color: titleTextColor, textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : undefined }}
          >
            Q
            {/* Ekor Emas Q */}
            <span 
              className="absolute -bottom-1 -right-1 text-2xl sm:text-3xl font-black text-amber-400 transform rotate-12"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            >
              ~
            </span>
          </span>

          {/* Huruf ABUL Hijau Zamrud Pekat */}
          <span 
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-normal ml-0.5" 
            style={{ color: titleTextColor, textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : undefined }}
          >
            ABUL
          </span>
        </div>

        {/* Baris 2: Sistem Kemasukan Digital SMAG3 */}
        <p 
          className="text-xs sm:text-sm md:text-base font-bold tracking-tight mt-1 sm:mt-1.5"
          style={{ color: subtitleColor, textShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : undefined }}
        >
          Sistem Kemasukan Digital SMAG3
        </p>

        {/* Baris 3: Cogan Kata dengan Garisan Emas */}
        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
          <span className="h-[1.5px] w-6 sm:w-10 rounded-full" style={{ backgroundColor: lineColor }} />
          <p 
            className="text-[10px] sm:text-xs font-semibold italic tracking-tight whitespace-nowrap"
            style={{ color: taglineColor, textShadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : undefined }}
          >
            Satu Gerbang, Segala Urusan Kemasukan
          </p>
          <span className="h-[1.5px] w-6 sm:w-10 rounded-full" style={{ backgroundColor: lineColor }} />
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen Brand Pembungkus (Backward Compatible)
 */
export const EQabulBrand: React.FC<{
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  customUrl?: string;
  theme?: 'light' | 'dark' | 'emerald';
}> = ({
  variant = 'horizontal',
  className = '',
  customUrl,
  theme = 'light'
}) => {
  if (customUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={customUrl} 
          alt="Logo e-QABUL" 
          className="h-12 md:h-14 w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return <EQabulEmblem className={className || "w-12 h-12"} />;
  }

  if (variant === 'horizontal' || variant === 'full') {
    return <EQabulHorizontal className={className} theme={theme} />;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <EQabulEmblem className="w-8 h-8 shrink-0" />
      <span className="text-sm font-black text-emerald-800">
        <span className="text-emerald-500">e-</span>QABUL
      </span>
    </div>
  );
};

export const EQabulLogoIcon = EQabulEmblem;
export default EQabulBrand;
