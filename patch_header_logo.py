import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

old_header = """      {/* Header Surat */}
      <div className="flex items-start mb-2 print:mb-1 border-b-2 border-gray-400 pb-3">
        <div className="flex items-center gap-6 w-full">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Jata Negara" className="w-24 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-end">
            <div className="text-gray-500">
              <h1 className="font-bold text-xl mb-1 tracking-wide">SMA KOTA GELANGGI 3</h1>
              <p className="leading-tight uppercase text-sm">
                27000 JERANTUT<br/>
                PAHANG DARUL MAKMUR
              </p>
            </div>
            <div className="text-xs leading-tight text-gray-500 text-right">
              <p>Tel:09-2051555</p>              
              <p>E-MEL:<a href="mailto:cft2001@moe.edu.my" className="text-blue-500 underline">cft2001@moe.edu.my</a></p>
            </div>
          </div>
        </div>
      </div>"""

new_header = """      {/* Header Surat */}
      <div className="flex justify-between items-end mb-2 print:mb-1 border-b-2 border-gray-400 pb-3 w-full">
        <div className="flex items-center gap-4">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo" className="w-[72px] h-auto object-contain" />
          <div className="text-slate-500">
            <h1 className="font-bold text-lg mb-0.5 tracking-wide text-slate-600">SMA KOTA GELANGGI 3</h1>
            <p className="leading-tight uppercase text-xs">
              27000 JERANTUT<br/>
              PAHANG DARUL MAKMUR
            </p>
          </div>
        </div>
        <div className="text-[11px] leading-tight text-slate-500 text-right pb-1">
          <p>Tel: 09-2051555</p>              
          <p>E-MEL: <a href="mailto:cft2001@moe.edu.my" className="text-blue-500 underline">cft2001@moe.edu.my</a></p>
        </div>
      </div>"""

content = content.replace(old_header, new_header)

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)
