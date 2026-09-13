with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# First, remove `fixed inset-0 overflow-y-auto` during print so it naturally expands
content = content.replace('className="fixed inset-0 z-50 bg-white overflow-y-auto"', 'className="fixed inset-0 z-50 bg-white overflow-y-auto print:static print:h-auto print:overflow-visible"')

import re
css_pattern = r'#printable-area, #printable-pukal-area \{(.*?)\}'
replacement = r"""#printable-area, #printable-pukal-area {
            position: relative;
            width: 100%;
            margin: 0;
            padding: 0;
          }"""

content = re.sub(css_pattern, replacement, content, flags=re.DOTALL)

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content)
