#!/bin/bash
sed -i 's/bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950/bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900/g' src/components/dashboard/Utama.tsx
sed -i 's/from-emerald-950\/80/from-slate-950\/80/g' src/components/dashboard/Utama.tsx
sed -i 's/from-white to-emerald-100/from-white to-teal-100/g' src/components/dashboard/Utama.tsx
sed -i 's/text-emerald-100\/90/text-teal-100\/80/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-white text-emerald-900 px-8 py-4 rounded-full/bg-white text-teal-950 px-8 py-4 rounded-full/g' src/components/dashboard/Utama.tsx
sed -i 's/shadow-emerald-900\/20/shadow-slate-900\/50/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-emerald-600\/80 backdrop-blur-md text-white border border-emerald-400\/30/bg-teal-500\/20 backdrop-blur-md text-teal-300 border border-teal-500\/30/g' src/components/dashboard/Utama.tsx
sed -i 's/hover:bg-emerald-500/hover:bg-teal-500\/40/g' src/components/dashboard/Utama.tsx
sed -i 's/from-emerald-900\/20/from-teal-900\/20/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-emerald-500\/10/bg-teal-500\/10/g' src/components/dashboard/Utama.tsx
sed -i 's/ring-emerald-500\/20/ring-teal-500\/20/g' src/components/dashboard/Utama.tsx
sed -i 's/text-emerald-400/text-teal-400/g' src/components/dashboard/Utama.tsx
