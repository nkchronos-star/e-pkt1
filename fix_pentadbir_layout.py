import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# PentadbirView is inside AdminPanel.tsx
# The issue is that we removed the Analisa from SuperAdminView, but for Pentadbir role, PentadbirView is shown for the "MARKAH" tab and possibly used elsewhere. 
# Wait, SuperAdminView's MARKAH tab uses PentadbirView entirely.
# Let's clean up PentadbirView so it doesn't show the Analisis blocks.

old_pentadbir_start = """  return (
    <div>
       <AnalisisKemasukan candidates={candidates} />

       {/* Analisa Penerimaan Tawaran (Pentadbir) */}
       <div className="mb-12">
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analisa Penerimaan Tawaran</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">Jumlah Ditawarkan</div>
              <div className="text-4xl font-extrabold text-blue-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA').length}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center">
              <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Diterima</div>
              <div className="text-4xl font-extrabold text-emerald-600">{candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center">
              <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
              <div className="text-4xl font-extrabold text-red-600">{candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center">
              <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-xs">Belum Maklum Balas</div>
              <div className="text-4xl font-extrabold text-amber-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran).length}</div>
            </div>
         </div>
       </div>

       <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="p-3 bg-purple-100 rounded-xl">
           <Users className="w-7 h-7 text-purple-700" />
         </div>
         <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Keputusan Calon Temuduga</h3>
       </div>"""

new_pentadbir_start = """  return (
    <div>
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-emerald-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Keputusan Temuduga & Tawaran</h3>
         </div>
       </div>"""

content = content.replace(old_pentadbir_start, new_pentadbir_start)


# Also move the Analisa Penerimaan Tawaran block into the Analisis Tab for SuperAdmin
# Let's check where AnalisisKemasukan is rendered inside SuperAdminView

analisa_block = """       {/* Analisa Penerimaan Tawaran (Pentadbir) */}
       <div className="mt-8 mb-12">
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analisa Penerimaan Tawaran</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">Jumlah Ditawarkan</div>
              <div className="text-4xl font-extrabold text-blue-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA').length}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center">
              <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Diterima</div>
              <div className="text-4xl font-extrabold text-emerald-600">{candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina?.toUpperCase() === 'LELAKI').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina?.toUpperCase() === 'PEREMPUAN').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center">
              <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
              <div className="text-4xl font-extrabold text-red-600">{candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina?.toUpperCase() === 'LELAKI').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina?.toUpperCase() === 'PEREMPUAN').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center">
              <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-xs">Belum Maklum Balas</div>
              <div className="text-4xl font-extrabold text-amber-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran).length}</div>
            </div>
         </div>
       </div>"""

analisis_tab_old = """       {activeTab === 'ANALISIS' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />
          </div>
       )}"""

analisis_tab_new = f"""       {{activeTab === 'ANALISIS' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={{candidates}} />
             {analisa_block}
          </div>
       )}}"""

content = content.replace(analisis_tab_old, analisis_tab_new)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
