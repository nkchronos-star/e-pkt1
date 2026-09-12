import re

with open('src/components/dashboard/Borang.tsx', 'r') as f:
    content = f.read()

# Replace the outer div
content = content.replace(
    'className="bg-[#fac73d] px-8 sm:px-12 py-3 border-b-4 border-[#e5b32e]"',
    'className="bg-emerald-50 px-8 sm:px-12 py-4 border-b-2 border-emerald-100"'
)

# Replace the h2 text color
content = content.replace(
    'className="text-xl font-extrabold text-slate-900 flex items-center gap-3"',
    'className="text-xl font-extrabold text-emerald-900 flex items-center gap-3"'
)

# Replace the span styles inside the h2 (only the ones for the header numbers)
content = content.replace(
    'className="w-7 h-7 rounded bg-white text-slate-900 flex items-center justify-center text-sm font-black shadow-sm"',
    'className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm"'
)

with open('src/components/dashboard/Borang.tsx', 'w') as f:
    f.write(content)

