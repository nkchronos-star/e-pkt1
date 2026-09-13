import re
for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # The current end looks like:
    #     </div>
    #   ),
    #   document.body
    # );
    # }
    
    # We want it to be:
    #     </div>
    #   , document.body
    # );
    # }
    
    content = content.replace('  ),\n  document.body\n);\n}', '  , document.body\n);\n}')
    content = content.replace('  ),\n  document.body\n);', '  , document.body\n);')
    
    with open(filename, 'w') as f:
        f.write(content)
