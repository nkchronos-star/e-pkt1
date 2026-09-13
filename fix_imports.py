for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # Clean up the messed up imports
    import re
    content = re.sub(r'import React.*?from \'react\';', '', content, flags=re.DOTALL)
    content = re.sub(r'import \{ createPortal \} from \'react-dom\';', '', content, flags=re.DOTALL)
    content = re.sub(r' \{ useEffect \} from \'react\';', '', content, flags=re.DOTALL)
    
    # Prepend correct ones
    content = "import React, { useEffect } from 'react';\nimport { createPortal } from 'react-dom';\n" + content.strip()
    
    with open(filename, 'w') as f:
        f.write(content)
