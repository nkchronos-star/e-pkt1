import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# Fix spacing for section C which had mt-6
content = content.replace('mb-2 print:mb-1 mt-6', 'mb-2 print:mb-1 mt-4 print:mt-2')

# In BorangCetakPDF, the outer wrapper might not have full visibility during print
# Ensure the outermost printable container is properly styled
if '#printable-area' in content:
    # Ensure all ancestors are visible? Not necessary usually with absolute positioning, 
    # but the scale might be off.
    old_css = """          #printable-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
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
          
    content = content.replace(old_css, new_css)
    
    # Remove the extra whitespace div at the bottom
    content = content.replace('<div className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500 text-center">\n             \n            </div>', '')


with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content)
