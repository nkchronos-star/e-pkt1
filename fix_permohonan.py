import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix tab button name
content = content.replace("Senarai Pemohon</button>", "Permohonan</button>")

# Wrap the PERMOHONAN tab and fix layout of header
old_permohonan_header = """       {activeTab === 'PERMOHONAN' && (
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Users className="w-6 h-6 text-slate-500" />
                  <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">"""

new_permohonan_header = """       {activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="p-3 bg-blue-100 rounded-xl hidden sm:block">
                    <Users className="w-7 h-7 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Keseluruhan Permohonan</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                    <div className="relative w-full sm:w-64">"""

content = content.replace(old_permohonan_header, new_permohonan_header)

# Fix the end wrapper of PERMOHONAN
# We need to find the end of the PERMOHONAN tab which is before:
#        {printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}
old_end = """             </div>
          </div>
       )}
       {printCandidate && <BorangCetakPDF"""

new_end = """             </div>
          </div>
          </div>
       )}
       {printCandidate && <BorangCetakPDF"""

content = content.replace(old_end, new_end)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
