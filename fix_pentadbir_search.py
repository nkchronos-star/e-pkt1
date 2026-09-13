import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add searchQuery to state
old_state = """  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;"""

new_state = """  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;"""

content = content.replace(old_state, new_state)

# Apply Search to filtered
old_filter = """  let filtered = candidates;
  if (filter === 'BERJAYA') filtered = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  if (filter === 'GAGAL') filtered = candidates.filter(c => c.statusTawaran === 'GAGAL');
  if (filter === 'TERIMA') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  if (filter === 'TOLAK') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  if (filter === 'LAYAK_TEMUDUGA') filtered = candidates.filter(c => c.statusTemuduga === 'LAYAK');"""

new_filter = """  let filtered = candidates;
  if (filter === 'BERJAYA') filtered = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  if (filter === 'GAGAL') filtered = candidates.filter(c => c.statusTawaran === 'GAGAL');
  if (filter === 'TERIMA') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  if (filter === 'TOLAK') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  if (filter === 'LAYAK_TEMUDUGA') filtered = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.name?.toLowerCase().includes(q) || c.ic?.includes(q) || c.studentName?.toLowerCase().includes(q) || c.icNumber?.includes(q));
  }"""
content = content.replace(old_filter, new_filter)

# Add Search Input UI
old_ui = """        <div className="flex justify-end mb-6">
           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}"""

new_ui = """        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <div className="relative flex-1">
             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Cari nama atau No. KP..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-medium" />
           </div>
           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}"""

content = content.replace(old_ui, new_ui)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
