import re

for filename in ['src/components/dashboard/BorangCetakPDF.tsx', 'src/components/dashboard/BorangPukalCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # Remove transform scaling which can mess up page breaks or take up extra pages
    content = re.sub(r'transform:\s*scale\([^)]+\)\s*!important;', '', content)
    content = re.sub(r'transform-origin:\s*[^;]+;', '', content)
    
    with open(filename, 'w') as f:
        f.write(content)
