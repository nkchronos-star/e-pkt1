import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

tabs_old = """       <div className="flex gap-4 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Kawalan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Daftar Pengguna</button>
         <button onClick={() => setActiveTab('PENILAIAN' as any)} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENILAIAN' as any ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Penilaian</button>
         <button onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Senarai Pemohon</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>
       </div>"""
       
tabs_new = """       <div className="flex gap-4 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Kawalan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Daftar Pengguna</button>
         <button onClick={() => setActiveTab('PENILAIAN' as any)} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENILAIAN' as any ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Penilaian</button>
         <button onClick={() => setActiveTab('ANALISIS')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'ANALISIS' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Analisis</button>
         <button onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Senarai Pemohon</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>
       </div>"""
content = content.replace(tabs_old, tabs_new)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
