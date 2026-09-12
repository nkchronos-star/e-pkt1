with open('src/App.tsx', 'r') as f:
    content = f.read()

old_block = """          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full w-14 h-14 flex items-center justify-center shrink-0 shadow-md">
               <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo SMAG3" className="h-11 w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-xl md:text-2xl tracking-wide uppercase">SMA KOTA GELANGGI 3</h1>
              <p className="text-emerald-100/90 text-sm">Sistem Permohonan Tingkatan 1</p>
            </div>
          </div>"""

new_block = """          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-white p-1 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0 shadow-lg">
               <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo SMAG3" className="h-12 md:h-16 w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-black text-2xl md:text-3xl lg:text-4xl tracking-tight uppercase drop-shadow-sm">SMA KOTA GELANGGI 3</h1>
              <p className="text-emerald-100 font-bold text-xs md:text-lg tracking-widest uppercase mt-1 drop-shadow-sm">Sistem Permohonan Tingkatan 1</p>
            </div>
          </div>"""

content = content.replace(old_block, new_block)

with open('src/App.tsx', 'w') as f:
    f.write(content)
