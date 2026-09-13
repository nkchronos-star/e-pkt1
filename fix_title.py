import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

old_header = """             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="p-3 bg-blue-100 rounded-xl hidden sm:block">
                    <Users className="w-7 h-7 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Keseluruhan Permohonan</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">"""

new_header = """             <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 w-full xl:w-auto">
                  <div className="p-3 bg-blue-100 rounded-xl hidden sm:block flex-shrink-0">
                    <Users className="w-7 h-7 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Keseluruhan Permohonan</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">"""

content = content.replace(old_header, new_header)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
