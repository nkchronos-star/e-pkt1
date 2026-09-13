with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re
# Find the end of SuperAdminView
# It ends with:
#       <style dangerouslySetInnerHTML={{__html: `
#         .print\:hidden { display: none !important; }
#       `}} />
#     </div>
#   );
# }
pattern = r'(<style dangerouslySetInnerHTML=\{\{__html: `\s*\.print\\:hidden \{ display: none !important; \}\s*`\}\} />\s*</div>\s*\);\s*})'

replacement = r"""
      {editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => setEditCandidate(null)}
         />
      )}
\1
"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
