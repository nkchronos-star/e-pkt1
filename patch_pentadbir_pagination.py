import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add state to PentadbirView
pentadbir_state = """  const [filter, setFilter] = useState('ALL');"""
pentadbir_state_new = """  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;"""
content = content.replace(pentadbir_state, pentadbir_state_new)

# Reset page when filter changes? That requires a useEffect. 
# Alternatively, I can just slice the table rows.
# Find `filtered.map(c => (` in PentadbirView table.
table_map = """                         {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Tiada permohonan dijumpai.</td></tr>
                         ) : (
                            filtered.map(c => ("""
table_map_new = """                         {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Tiada permohonan dijumpai.</td></tr>
                         ) : (
                            filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(c => ("""
content = content.replace(table_map, table_map_new)

# Add pagination controls
table_end = """                   </table>
                </div>
             </div>"""
pagination_html = """                   </table>
                </div>
                {filtered.length > itemsPerPage && (
                   <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                     <span className="text-sm text-slate-500">
                       Memaparkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, filtered.length)} daripada {filtered.length} rekod
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
                         onClick={() => setCurrentPage(p => Math.min(Math.ceil(filtered.length / itemsPerPage), p + 1))}
                         disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                         className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Seterusnya
                       </button>
                     </div>
                   </div>
                )}
             </div>"""
# Only replace the first match of table_end within PentadbirView
parts = content.split('// ================= SUPER ADMIN VIEW =================')
if len(parts) == 2:
    parts[0] = parts[0].replace(table_end, pagination_html, 1)
    content = '// ================= SUPER ADMIN VIEW ================='.join(parts)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

