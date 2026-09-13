for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # Just force the top 2 lines to be correct.
    import re
    content = re.sub(r'^import React, \{ useEffect \}.*?react-dom\';', "import React, { useEffect } from 'react';\nimport { createPortal } from 'react-dom';", content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)
