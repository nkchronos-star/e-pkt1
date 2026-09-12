#!/bin/bash
# App.tsx
sed -i 's/bg-slate-950 border-r border-slate-800/bg-white border-r border-slate-200\/60/g' src/App.tsx
sed -i 's/border-b border-slate-800\/80/border-b border-slate-100/g' src/App.tsx
sed -i 's/bg-gradient-to-r from-emerald-400 to-teal-400/bg-gradient-to-r from-blue-800 to-blue-600/g' src/App.tsx
sed -i 's/bg-emerald-500\/10 text-emerald-400 shadow-sm ring-1 ring-emerald-500\/20/bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200\/50/g' src/App.tsx
sed -i 's/text-slate-400 hover:bg-slate-900 hover:text-slate-200/text-slate-600 hover:bg-slate-100\/80 hover:text-slate-900/g' src/App.tsx
sed -i 's/text-emerald-400/text-blue-600/g' src/App.tsx
sed -i 's/text-slate-500/text-slate-400/g' src/App.tsx
sed -i 's/border-t border-slate-800 bg-slate-900\/50/border-t border-slate-100 bg-slate-50/g' src/App.tsx
sed -i 's/bg-slate-950\/90 backdrop-blur-md border-b border-slate-800/bg-white\/90 backdrop-blur-md border-b border-slate-200\/60/g' src/App.tsx
sed -i 's/bg-slate-950 border-b border-slate-800/bg-white border-b border-slate-200/g' src/App.tsx
sed -i 's/text-slate-400 hover:bg-slate-800/text-slate-500 hover:bg-slate-100/g' src/App.tsx
sed -i 's/bg-emerald-500\/10 text-emerald-400 ring-1 ring-emerald-500\/20/bg-blue-50 text-blue-700 ring-1 ring-blue-200\/50/g' src/App.tsx

# Utama.tsx
sed -i 's/bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900/bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950/g' src/components/dashboard/Utama.tsx
sed -i 's/from-slate-950\/80/from-blue-950\/80/g' src/components/dashboard/Utama.tsx
sed -i 's/from-white to-teal-100/from-white to-blue-100/g' src/components/dashboard/Utama.tsx
sed -i 's/text-teal-100\/80/text-blue-100\/90/g' src/components/dashboard/Utama.tsx
sed -i 's/text-teal-950/text-blue-900/g' src/components/dashboard/Utama.tsx
sed -i 's/shadow-slate-900\/50/shadow-blue-900\/20/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-teal-500\/20 backdrop-blur-md text-teal-300 border border-teal-500\/30 hover:bg-teal-500\/40/bg-blue-600\/80 backdrop-blur-md text-white border border-blue-400\/30 hover:bg-blue-500/g' src/components/dashboard/Utama.tsx

# Utama video section
sed -i 's/bg-slate-900 rounded-\[2rem\] shadow-2xl overflow-hidden relative border border-slate-800/bg-white rounded-\[2rem\] shadow-2xl shadow-slate-200\/50 overflow-hidden relative border border-slate-200\/60/g' src/components/dashboard/Utama.tsx
sed -i 's/from-teal-900\/20/from-blue-50\/50/g' src/components/dashboard/Utama.tsx
sed -i 's/text-white relative z-10/text-slate-900 relative z-10/g' src/components/dashboard/Utama.tsx
sed -i 's/bg-teal-500\/10/bg-blue-50/g' src/components/dashboard/Utama.tsx
sed -i 's/ring-teal-500\/20/ring-blue-100/g' src/components/dashboard/Utama.tsx
sed -i 's/text-teal-400/text-blue-600/g' src/components/dashboard/Utama.tsx

# Utama cards
sed -i 's/bg-slate-900 border-b border-slate-800/bg-gradient-to-br from-blue-50 to-indigo-50\/50 border-b border-blue-100/g' src/components/dashboard/Utama.tsx
sed -i 's/text-white/text-blue-950/g' src/components/dashboard/Utama.tsx
sed -i 's/text-slate-400/text-blue-700/g' src/components/dashboard/Utama.tsx
