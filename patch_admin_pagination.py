import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Find SuperAdminView
# We need to inject states.
state_inject = """  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'TAHFIZ' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
"""
content = content.replace("  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'TAHFIZ' });", state_inject)

# Find candidates.map
# We need to do this specifically for the PERMOHONAN tab.
permohonan_map = """                         {candidates.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>
                         ) : (
                            candidates.map(c => ("""
                            
permohonan_map_new = """                         {candidates.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>
                         ) : (
                            candidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(c => ("""

content = content.replace(permohonan_map, permohonan_map_new)

# Now find the end of the table to insert pagination controls
table_end = """                   </table>
                </div>
             </div>"""
             
pagination_html = """                   </table>
                </div>
                {candidates.length > itemsPerPage && (
                   <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                     <span className="text-sm text-slate-500">
                       Memaparkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, candidates.length)} daripada {candidates.length} rekod
                     </span>
                     <div className="flex gap-2">
                       <button
                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                         disabled={currentPage === 1}
                         className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Sebelumnya
                       </button>
                       <button
                         onClick={() => setCurrentPage(p => Math.min(Math.ceil(candidates.length / itemsPerPage), p + 1))}
                         disabled={currentPage === Math.ceil(candidates.length / itemsPerPage)}
                         className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Seterusnya
                       </button>
                     </div>
                   </div>
                )}
             </div>"""

content = content.replace(table_end, pagination_html)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
