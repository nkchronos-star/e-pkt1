import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# Apply the same strict shrinking logic to single Borang
content = content.replace('p-8 sm:p-12 print:p-0', 'p-4 sm:p-6 print:p-0')
content = content.replace('mb-8 border-b-2 border-slate-800 pb-6', 'mb-4 print:mb-2 border-b-2 border-slate-800 pb-2 print:pb-1')
content = content.replace('text-2xl font-black', 'text-xl print:text-base font-black')
content = content.replace('text-slate-600 mt-1', 'text-slate-600 mt-0')
content = content.replace('space-y-6', 'space-y-4 print:space-y-2')
content = content.replace('gap-8', 'gap-4')
content = content.replace('grid-cols-4 gap-4', 'grid-cols-4 gap-4 print:gap-2')

# Titles and sections
content = content.replace('text-lg font-bold', 'text-base print:text-sm font-bold')
content = content.replace('text-slate-500 text-sm', 'text-slate-500 text-xs')
content = content.replace('uppercase mt-1', 'uppercase mt-0.5')
content = content.replace('w-32 h-40 object-cover', 'w-24 h-32 object-cover')

# Print CSS: Ensure printable-area overrides background and fits properly
css_to_replace = """          #printable-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }"""
          
new_css = """          #printable-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }"""

# Actually, the issue with blank print is usually that #printable-area gets hidden or the modal overlay gets hidden.
# Let's check visibility rules:
old_print_rules = """        @media print {
          @page { size: A4 portrait; margin: 0.5cm;
          transform: scale(0.90);
          transform-origin: top center; }
          body * { visibility: hidden !important; }"""
          
new_print_rules = """        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          body * { visibility: hidden !important; }"""

content = content.replace(old_print_rules, new_print_rules)

# Make sure printable area is visible
visibility_rule = """          #printable-area, #printable-area * { visibility: visible !important; }"""
new_visibility_rule = """          #printable-area, #printable-area * { visibility: visible !important; }
          .fixed.inset-0 { background: transparent !important; }
          .bg-white.max-w-4xl { box-shadow: none !important; border: none !important; margin: 0 !important; }
          .print\:hidden { display: none !important; }"""
content = content.replace(visibility_rule, new_visibility_rule)

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content)
