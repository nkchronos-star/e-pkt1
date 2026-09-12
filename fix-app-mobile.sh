#!/bin/bash
sed -i 's/md:hidden bg-white\/90 backdrop-blur-md border-b border-slate-200\/60/md:hidden bg-slate-950\/90 backdrop-blur-md border-b border-slate-800/g' src/App.tsx
sed -i 's/text-emerald-800">SMAG3/text-emerald-400">SMAG3/g' src/App.tsx
sed -i 's/text-slate-500 hover:bg-slate-100/text-slate-400 hover:bg-slate-800/g' src/App.tsx
sed -i 's/md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200/md:hidden absolute top-16 left-0 right-0 bg-slate-950 border-b border-slate-800/g' src/App.tsx
sed -i 's/bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200\/50/bg-emerald-500\/10 text-emerald-400 ring-1 ring-emerald-500\/20/g' src/App.tsx
sed -i 's/text-slate-600 hover:bg-slate-50 hover:text-slate-900/text-slate-400 hover:bg-slate-900 hover:text-slate-200/g' src/App.tsx
