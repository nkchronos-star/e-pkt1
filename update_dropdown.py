import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

old_dropdown_ui = """       <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
         <select 
           value={filter} 
           onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
           className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-white text-slate-800 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 min-w-[200px]"
         >
           <option value="ALL">Semua Calon</option>
           <option value="LAYAK_TEMUDUGA">Layak Temuduga</option>
           <option value="BERJAYA">Tawaran Berjaya</option>
           <option value="GAGAL">Tawaran Gagal</option>
           <option value="TERIMA">Terima Tawaran</option>
           <option value="TOLAK">Tolak Tawaran</option>
         </select>
         <button 
           onClick={handleDownloadExcel}
           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
         >
           <Download className="w-5 h-5" />
           Muat Turun CSV (Senarai Dipapar)
         </button>
       </div>"""

new_dropdown_ui = """       <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
         <select 
           value={filter} 
           onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
           className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 min-w-[200px]"
         >
           <option value="LAYAK_TEMUDUGA">Semua Calon Temuduga</option>
           <option value="BERJAYA">Ditawarkan</option>
           <option value="GAGAL">Tidak Berjaya</option>
           <option value="TOLAK">Tolak Tawaran</option>
         </select>
         <button 
           onClick={handleDownloadExcel}
           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
         >
           <Download className="w-5 h-5" />
           Muat Turun Semua
         </button>
       </div>"""

content = content.replace(old_dropdown_ui, new_dropdown_ui)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
