with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re

replacement = r"""
       {editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => setEditCandidate(null)}
         />
       )}
    </div>
  );
}
"""

content = re.sub(r'    </div>\s*\);\s*}\s*$', replacement, content)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
