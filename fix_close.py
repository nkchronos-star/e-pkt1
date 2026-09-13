import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add the missing </div> for PERMOHONAN wrapper
old_str = """             </div>
          </div>
       )}

       {printCandidate && <BorangCetakPDF"""

new_str = """             </div>
          </div>
          </div>
       )}

       {printCandidate && <BorangCetakPDF"""
content = content.replace(old_str, new_str)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
