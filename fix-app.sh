#!/bin/bash
sed -i 's/className="w-72 bg-white border-r border-slate-200\/60/className="w-72 bg-slate-950 border-r border-slate-800/g' src/App.tsx
sed -i 's/bg-gradient-to-r from-emerald-800 to-emerald-600/bg-gradient-to-r from-emerald-400 to-teal-400/g' src/App.tsx
sed -i 's/border-b border-slate-100 flex items-center/border-b border-slate-800\/80 flex items-center/g' src/App.tsx
sed -i 's/bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200\/50/bg-emerald-500\/10 text-emerald-400 shadow-sm ring-1 ring-emerald-500\/20/g' src/App.tsx
sed -i 's/text-slate-600 hover:bg-slate-100\/80 hover:text-slate-900/text-slate-400 hover:bg-slate-900 hover:text-slate-200/g' src/App.tsx
sed -i 's/isActive ? '"'"'text-emerald-600'"'"' : '"'"'text-slate-400'"'"'/isActive ? '"'"'text-emerald-400'"'"' : '"'"'text-slate-500'"'"'/g' src/App.tsx
sed -i 's/p-6 border-t border-slate-100 bg-slate-50/p-6 border-t border-slate-800 bg-slate-900\/50/g' src/App.tsx
sed -i 's/text-slate-500 text-center/text-slate-500 text-center/g' src/App.tsx
