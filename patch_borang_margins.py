import re

files_to_patch = ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # Move title closer to top and make it smaller
    content = content.replace('className="text-2xl font-bold uppercase mb-1"', 'className="text-xl print:text-lg font-bold uppercase mb-0.5"')
    
    # Squeeze spacing
    content = content.replace('className="text-center mb-6"', 'className="text-center mb-4 print:mb-2"')
    content = content.replace('className="border-b-2 border-slate-800 pb-4 mb-6"', 'className="border-b-2 border-slate-800 pb-2 print:pb-1 mb-4 print:mb-2"')
    
    # Section margins
    content = content.replace('className="bg-slate-100 p-2 font-bold text-slate-800 mb-4"', 'className="bg-slate-100 p-1.5 font-bold text-slate-800 mb-2"')
    
    # General margins between fields
    content = content.replace('className="mb-4"', 'className="mb-2 print:mb-1"')
    content = content.replace('className="mb-6"', 'className="mb-3 print:mb-1.5"')
    content = content.replace('className="grid grid-cols-2 gap-4"', 'className="grid grid-cols-2 gap-2 print:gap-1"')
    
    # Academic spacing
    content = content.replace('className="mb-4 grid grid-cols-2 gap-8"', 'className="mb-2 print:mb-1 grid grid-cols-2 gap-4 print:gap-2"')
    content = content.replace('className="font-bold text-slate-600 mb-2"', 'className="font-bold text-slate-600 mb-1"')
    
    # UPKK spacing
    content = content.replace('className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4"', 'className="grid grid-cols-2 gap-2 print:gap-1 border-t border-slate-200 pt-2 print:pt-1"')
    
    # Bottom margins
    content = content.replace('className="mt-8 print:mt-6 grid grid-cols-2 gap-8 text-center"', 'className="mt-4 print:mt-2 grid grid-cols-2 gap-4 text-center"')
    content = content.replace('className="border-t border-slate-400 pt-2 px-8"', 'className="border-t border-slate-400 pt-1 px-4"')

    # Fix CSS padding
    content = content.replace('className="p-4 sm:p-8 print:p-2', 'className="p-4 sm:p-6 print:p-1')
    
    # Scale via CSS if needed
    if 'transform: scale' not in content:
        content = content.replace('margin: 0.5cm;', 'margin: 0.5cm;\n          transform: scale(0.96);\n          transform-origin: top center;')

    with open(file_path, 'w') as f:
        f.write(content)

