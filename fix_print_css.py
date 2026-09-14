import re

def update_css(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    new_css = """        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          #root { display: none !important; }
          body, html { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            height: auto !important; 
            min-height: auto !important;
            overflow: visible !important; 
            position: static !important;
          }
          .break-after-page { 
             page-break-after: always !important; 
             break-after: page !important;
          }
          .break-after-page:last-child { 
             page-break-after: auto !important; 
             break-after: auto !important;
          }
        }"""
    
    # Replace everything between @media print { ... } with our robust css
    pattern = r'@media print \{.*\}'
    # Wait, the previous pattern spans multiple lines
    pattern = r'@media print\s*\{[^`]*\}'
    
    content = re.sub(pattern, new_css, content, flags=re.MULTILINE)
    
    with open(filepath, 'w') as f:
        f.write(content)

update_css('src/components/dashboard/BorangPukalCetakPDF.tsx')
update_css('src/components/dashboard/BorangCetakPDF.tsx')
