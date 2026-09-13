import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# 1. Update Tab State Type
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');",
    "const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'ANALISIS' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');"
)

# 2. Add Tab Button for Analisis
tab_buttons_old = """         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tetapan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Pengguna (Staf)</button>
         <button onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Senarai Pemohon</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>"""

tab_buttons_new = """         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tetapan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Pengguna (Staf)</button>
         <button onClick={() => setActiveTab('ANALISIS')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'ANALISIS' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Analisis</button>
         <button onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Senarai Pemohon</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>"""
content = content.replace(tab_buttons_old, tab_buttons_new)

# 3. Add Analisis Tab View
analisis_view = """       {activeTab === 'ANALISIS' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />
          </div>
       )}
       {activeTab === 'PERMOHONAN' && ("""
content = content.replace("""       {activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />""", analisis_view)

# 4. Add Search State and Filter to SuperAdminView
state_vars_old = """  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'ANALISIS' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);"""

state_vars_new = """  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'ANALISIS' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredPermohonan = candidates.filter(c => {
     const searchLower = searchQuery.toLowerCase();
     return c.studentName?.toLowerCase().includes(searchLower) || c.name?.toLowerCase().includes(searchLower) || c.ic?.includes(searchQuery) || c.icNumber?.includes(searchQuery);
  });
"""
content = content.replace(state_vars_old, state_vars_new)

# 5. Add Search Input UI to Permohonan Tab
search_ui = """             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Users className="w-6 h-6 text-slate-500" />
                  <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                       <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="Cari nama atau No. KP..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-medium" />
                    </div>
                    <button 
                      onClick={() => setPrintPukalBorang(true)}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-sm whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Pukal
                    </button>
                </div>
             </div>"""

content = content.replace("""             <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-500" />
                  <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
                </div>
                <button 
                  onClick={() => setPrintPukalBorang(true)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Borang Pukal
                </button>
                <button 
                  onClick={() => {""", search_ui + """\n                <button \n                  onClick={() => {""")

# 6. Apply filter and pagination to the table mapping in SuperAdminView
content = content.replace("candidates.length === 0 ? (", "filteredPermohonan.length === 0 ? (")
content = content.replace("candidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(c => (", "filteredPermohonan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(c => (")


with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
