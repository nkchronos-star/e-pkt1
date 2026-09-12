import re

files_to_patch = ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # Sometimes forcing `height: 28.5cm; overflow: hidden;` causes page breaking issues in some browsers (they add blank pages).
    # Let's remove the forced height and let the page break naturally.
    old_css_page = """          .printable-page {
             height: 28.5cm; /* Enforce slightly less than A4 height */
             overflow: hidden;
             box-sizing: border-box;
          }"""
          
    new_css_page = """          .printable-page {
             box-sizing: border-box;
             /* Remove fixed height to prevent blank extra pages */
          }"""
          
    content = content.replace(old_css_page, new_css_page)

    with open(file_path, 'w') as f:
        f.write(content)

