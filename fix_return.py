import re
for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # fix the "from 'react';"
    content = content.replace("from 'react';", "")
    
    # fix the return createPortal() => clearTimeout
    content = content.replace("return createPortal() => clearTimeout", "return () => clearTimeout")
    
    with open(filename, 'w') as f:
        f.write(content)
