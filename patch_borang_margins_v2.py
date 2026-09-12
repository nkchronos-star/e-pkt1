import re

files_to_patch = ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # Apply tighter font and padding classes explicitly
    content = content.replace('text-xs print:text-[11px]', 'text-[11px] print:text-[10px]')
    content = content.replace('text-[11px] print:text-[11px] sm:text-xs', 'text-[11px] print:text-[10px]')
    
    # Adjust scale in print CSS further to squeeze it in
    if 'transform: scale(0.96);' in content:
        content = content.replace('transform: scale(0.96);', 'transform: scale(0.92);')
        
    with open(file_path, 'w') as f:
        f.write(content)

