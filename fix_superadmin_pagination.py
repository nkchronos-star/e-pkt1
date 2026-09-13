import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

pagination_ui = """                   </table>
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                   <div className="text-sm text-slate-500">
                     Menunjukkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPermohonan.length)} hingga {Math.min(currentPage * itemsPerPage, filteredPermohonan.length)} daripada {filteredPermohonan.length} rekod
                   </div>
                   <div className="flex gap-2">
                     <button
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Sebelumnya
                     </button>
                     <button
                       onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPermohonan.length / itemsPerPage), p + 1))}
                       disabled={currentPage >= Math.ceil(filteredPermohonan.length / itemsPerPage)}
                       className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Seterusnya
                     </button>
                   </div>
                </div>
             </div>
          </div>
       )}"""

content = content.replace("""                   </table>
                </div>
             </div>
          </div>
       )}""", pagination_ui)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
