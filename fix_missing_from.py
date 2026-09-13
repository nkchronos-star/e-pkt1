for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # The first line is "import React, { useEffect }" without "from 'react';"
    content = content.replace("import React, { useEffect }\n", "import React, { useEffect } from 'react';\n")
    
    with open(filename, 'w') as f:
        f.write(content)
