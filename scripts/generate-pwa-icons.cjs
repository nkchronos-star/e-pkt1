const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG content for the e-Qabul PWA app icon
const createSvg = (isMaskable = false) => {
  // Safe zone padding if maskable
  const scale = isMaskable ? 0.72 : 0.88;
  const translate = isMaskable ? 72 : 31; // For 512x512 canvas

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#043d2a" />
      <stop offset="45%" stop-color="#084e36" />
      <stop offset="100%" stop-color="#0a5c40" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#facc15" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>

    <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#facc15" />
    </linearGradient>

    <radialGradient id="halo" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#facc15" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#10b981" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#043d2a" stop-opacity="0" />
    </radialGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Solid Canvas Background -->
  <rect width="512" height="512" rx="${isMaskable ? 0 : 110}" fill="url(#bgGrad)" />

  <!-- Inner Soft Radial Halo -->
  <circle cx="256" cy="235" r="210" fill="url(#halo)" />

  <!-- Scaling container for safe zone compliance -->
  <g transform="translate(${translate}, ${translate}) scale(${scale})">
    
    <!-- Outer Golden Concentric Ring -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="url(#goldGrad)" stroke-width="6" stroke-dasharray="16 8" opacity="0.6" />
    <circle cx="256" cy="256" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.85" />

    <!-- Islamic Arch (Gerbang Ilmu) -->
    <g filter="url(#glow)">
      <!-- Outer Arch Outline -->
      <path d="M 160 310 V 205 C 160 145, 195 105, 256 80 C 317 105, 352 145, 352 205 V 310 Z" 
            fill="none" stroke="url(#goldGrad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Inner Arch Dark Fill -->
      <path d="M 172 310 V 208 C 172 155, 203 120, 256 98 C 309 120, 340 155, 340 208 V 310 Z" 
            fill="#03261a" opacity="0.75" />

      <!-- Inner Arch Golden Border -->
      <path d="M 180 310 V 212 C 180 165, 210 135, 256 115 C 302 135, 332 165, 332 212 V 310 Z" 
            fill="none" stroke="url(#goldLight)" stroke-width="4" stroke-linecap="round" opacity="0.9" />

      <!-- Star & Crescent / Light of Knowledge Symbol at Arch Apex -->
      <path d="M 256 125 L 261 140 L 276 142 L 264 151 L 268 166 L 256 156 L 244 166 L 248 151 L 236 142 L 251 140 Z" 
            fill="url(#goldLight)" />

      <!-- Two Students Silhouette Heading In -->
      <!-- Boy with Songkok -->
      <circle cx="236" cy="235" r="11" fill="url(#goldGrad)" />
      <path d="M 226 226 H 246 V 230 H 226 Z" fill="#ffffff" />
      <path d="M 222 250 C 222 245, 226 242, 236 242 C 246 242, 250 245, 250 250 V 285 H 222 Z" fill="url(#goldGrad)" />

      <!-- Girl with Tudung -->
      <path d="M 276 230 C 268 230, 263 236, 263 245 C 263 252, 267 257, 276 257 C 285 257, 289 252, 289 245 C 289 236, 284 230, 276 230 Z" fill="#ffffff" />
      <circle cx="276" cy="242" r="7" fill="#facc15" />
      <path d="M 262 254 C 258 258, 258 266, 264 285 H 288 C 294 266, 294 258, 290 254 Z" fill="#ffffff" />

      <!-- Open Book (Al-Quran & Akademik) at Base -->
      <path d="M 185 320 C 220 310, 250 315, 256 325 C 262 315, 292 310, 327 320 L 322 342 C 290 332, 262 337, 256 345 C 250 337, 222 332, 190 342 Z" 
            fill="url(#goldGrad)" />
      <path d="M 190 324 C 222 314, 248 319, 256 327 C 264 319, 290 314, 322 324" 
            stroke="#ffffff" stroke-width="2.5" fill="none" />
    </g>

    <!-- App Name Typography: e-QABUL -->
    <text x="256" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="3" filter="url(#glow)">
      <tspan fill="#34d399" font-style="italic">e-</tspan><tspan fill="#ffffff">Q</tspan><tspan fill="#facc15">ABUL</tspan>
    </text>

    <!-- Subtitle: SMAG3 KBT TAHFIZ -->
    <text x="256" y="445" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="20" fill="#fef08a" letter-spacing="4">
      SMA KOTA GELANGGI 3
    </text>
  </g>
</svg>`;
};

async function generate() {
  console.log('Generating PWA icons...');
  
  // 1. Save standard SVG icon
  const standardSvg = createSvg(false);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  console.log('Created icon.svg');

  // 2. Generate 192x192 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 3. Generate 512x512 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 4. Generate 512x512 Maskable PNG (full-bleed background with safe-zone margin)
  const maskableSvg = createSvg(true);
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 5. Generate 180x180 Apple Touch Icon
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 6. Generate 32x32 Favicon PNG
  await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  console.log('All PWA icons successfully generated!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
