import re

files_to_patch = ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # Shrink padding and margins more aggressively for print
    content = content.replace('p-4 sm:p-6 print:p-1', 'p-4 sm:p-6 print:p-0')
    content = content.replace('text-2xl print:text-lg', 'text-2xl print:text-base')
    content = content.replace('text-xl print:text-lg', 'text-xl print:text-base')
    
    # Titles
    content = content.replace('border-l-4 border-slate-800 mb-4', 'border-l-4 border-slate-800 mb-2 print:mb-1')
    content = content.replace('border-l-4 border-slate-800 mb-4 mt-6', 'border-l-4 border-slate-800 mb-2 print:mb-1 mt-4 print:mt-2')
    content = content.replace('p-2 font-bold text-slate-800 uppercase text-sm', 'p-1.5 font-bold text-slate-800 uppercase text-[11px] print:text-[10px]')
    content = content.replace('p-2 font-bold text-slate-800 mb-4', 'p-1 font-bold text-slate-800 mb-2 print:mb-1')
    
    # Shrink sections
    content = content.replace('pb-2 mb-3', 'pb-1 mb-1')
    content = content.replace('mb-3 print:mb-1.5', 'mb-2 print:mb-1')
    content = content.replace('space-y-3', 'space-y-1')
    content = content.replace('mb-6 print:mb-2', 'mb-3 print:mb-1')
    content = content.replace('mt-4 pt-4 border-t', 'mt-2 pt-2 border-t')
    
    content = content.replace('p-4 border-2 border-slate-200', 'p-2 border-2 border-slate-200')
    content = content.replace('text-sm text-slate-700 text-justify', 'text-xs print:text-[10px] text-slate-700 text-justify')
    content = content.replace('mb-2 print:mb-1 grid grid-cols-2 gap-4 print:gap-2', 'mb-1 grid grid-cols-2 gap-2')
    
    # Shrink image
    content = content.replace('w-32 h-40', 'w-24 h-32')

    # Re-apply CSS changes
    if 'transform: scale(0.92);' in content:
        content = content.replace('transform: scale(0.92);', 'transform: scale(0.90);')
    else:
        # Inject the transform explicitly into the page element, not just the @page config which some browsers ignore
        new_css = """          #printable-pukal-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }"""
        content = content.replace("""          #printable-pukal-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }""", new_css)
          
        new_css_single = """          #printable-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }"""
        content = content.replace("""          #printable-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }""", new_css_single)

    with open(file_path, 'w') as f:
        f.write(content)

