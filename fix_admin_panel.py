import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace("import { BorangCetakPDF } from './BorangCetakPDF';", "import BorangCetakPDF from './BorangCetakPDF';")
content = content.replace("import { BorangPukalCetakPDF } from './BorangPukalCetakPDF';", "import BorangPukalCetakPDF from './BorangPukalCetakPDF';")

# Add Search icon
if "Search" not in content:
    content = content.replace("Download } from 'lucide-react';", "Download, Search } from 'lucide-react';")

# In PentadbirView, add Search state
search_state = """  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);"""
content = content.replace("  const [filter, setFilter] = useState('ALL');\n  const [currentPage, setCurrentPage] = useState(1);", search_state)

# Filter logic for PentadbirView
filter_logic = """  const filteredCandidates = candidates.filter(c => {
    const matchStatus = filter === 'ALL' || c.statusTemuduga === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = c.studentName?.toLowerCase().includes(searchLower) || c.name?.toLowerCase().includes(searchLower) || c.ic?.includes(searchQuery) || c.icNumber?.includes(searchQuery);
    return matchStatus && matchSearch;
  });"""
content = content.replace("  const filteredCandidates = candidates.filter(c => filter === 'ALL' || c.statusTemuduga === filter);", filter_logic)

# Search UI in PentadbirView
ui_replacement = """        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <div className="relative flex-1">
             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Cari nama atau No. KP..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-medium" />
           </div>
           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}"""
content = content.replace("""        <div className="flex justify-end mb-6">
           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}""", ui_replacement)


# Do the same for SuperAdminView (PERMOHONAN tab)
# Oh wait, SuperAdminView's PERMOHONAN tab uses PentadbirView's table directly or its own?
# Let's check SuperAdminView code
