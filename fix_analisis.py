import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# 1. Add demographic calculations
old_calc = """  const belum = ditawarkan.filter(c => !c.maklumBalasTawaran);
  const belumL = belum.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const belumP = belum.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;"""

new_calc = """  const belum = ditawarkan.filter(c => !c.maklumBalasTawaran);
  const belumL = belum.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const belumP = belum.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const demografiData = permohonan.reduce((acc, c) => {
    const n = c.negeri ? c.negeri.toUpperCase() : 'TIADA MAKLUMAT';
    const d = c.daerah ? c.daerah.toUpperCase() : 'TIADA MAKLUMAT';
    if (!acc[n]) acc[n] = {};
    if (!acc[n][d]) acc[n][d] = { jumlah: 0, layak: 0, tawaran: 0 };
    acc[n][d].jumlah++;
    if (c.statusTemuduga === 'LAYAK') acc[n][d].layak++;
    if (c.statusTawaran === 'BERJAYA') acc[n][d].tawaran++;
    return acc;
  }, {} as Record<string, Record<string, {jumlah: number, layak: number, tawaran: number}>>);

  const sortedNegeri = Object.keys(demografiData).sort();"""

content = content.replace(old_calc, new_calc)

# 2. Add the table section
old_return = """         <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-sm">Belum Maklum Balas</div>
            <div className="text-5xl font-extrabold text-amber-600 mb-2">{belum.length}</div>
            <div className="text-amber-600/80 font-bold">(L: {belumL} / P: {belumP})</div>
         </div>
      </div>
    </div>
  );
}"""

new_return = """         <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-sm">Belum Maklum Balas</div>
            <div className="text-5xl font-extrabold text-amber-600 mb-2">{belum.length}</div>
            <div className="text-amber-600/80 font-bold">(L: {belumL} / P: {belumP})</div>
         </div>
      </div>
      
      <div className="mt-10">
        <h4 className="font-bold text-lg text-slate-800 mb-4">Analisis Mengikut Negeri & Daerah</h4>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                 <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Negeri</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Daerah</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Permohonan</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Layak Temuduga</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Ditawarkan</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 bg-white">
                    {sortedNegeri.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">Tiada data demografi.</td>
                       </tr>
                    ) : (
                       sortedNegeri.map((negeri) => {
                          const daerahs = Object.keys(demografiData[negeri]).sort();
                          return daerahs.map((daerah, idx) => (
                             <tr key={`${negeri}-${daerah}`} className="hover:bg-slate-50 transition-colors">
                                {idx === 0 ? (
                                   <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-700 align-top" rowSpan={daerahs.length}>
                                      {negeri}
                                   </td>
                                ) : null}
                                <td className="px-4 py-3 font-medium text-slate-600 border-r border-slate-50">{daerah}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 bg-slate-50/50">{demografiData[negeri][daerah].jumlah}</td>
                                <td className="px-4 py-3 text-center font-bold text-purple-600 bg-purple-50/30">{demografiData[negeri][daerah].layak}</td>
                                <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/30">{demografiData[negeri][daerah].tawaran}</td>
                             </tr>
                          ));
                       })
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}"""

content = content.replace(old_return, new_return)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
