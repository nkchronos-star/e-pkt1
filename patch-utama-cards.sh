#!/bin/bash
sed -i 's/bg-gradient-to-br from-emerald-50 to-emerald-100\/50 border-b border-emerald-100/bg-slate-900 border-b border-slate-800/g' src/components/dashboard/Utama.tsx
sed -i 's/text-emerald-900/text-white/g' src/components/dashboard/Utama.tsx
sed -i 's/text-emerald-700/text-slate-400/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-emerald-500/bg-teal-500/g' src/components/dashboard/Utama.tsx

sed -i 's/bg-gradient-to-br from-blue-50 to-blue-100\/50 border-b border-blue-100/bg-slate-900 border-b border-slate-800/g' src/components/dashboard/Utama.tsx
sed -i 's/text-blue-950/text-white/g' src/components/dashboard/Utama.tsx
sed -i 's/text-blue-700/text-slate-400/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-blue-500/bg-indigo-500/g' src/components/dashboard/Utama.tsx
