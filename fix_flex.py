import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix 1: Add missing </div> to close the flex row container
old_middle = """                  Muat Turun Semua
                </button>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">"""

new_middle = """                  Muat Turun Semua
                </button>
             </div>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">"""

content = content.replace(old_middle, new_middle)

# Fix 2: Remove the extra </div> at the end
old_end = """                   </div>
                )}
             </div>
          </div>
          </div>
       )}
       {printCandidate && <BorangCetakPDF"""

new_end = """                   </div>
                )}
             </div>
          </div>
       )}
       {printCandidate && <BorangCetakPDF"""

content = content.replace(old_end, new_end)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
