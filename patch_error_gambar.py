import re

with open('src/components/dashboard/Borang.tsx', 'r') as f:
    content = f.read()

old_image_block = """              <div className="flex-1 w-full text-center sm:text-left">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
              </div>"""

new_image_block = """              <div className="flex-1 w-full text-center sm:text-left">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
                {!formData.gambarUrl && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100">
                    <span className="text-xs font-bold uppercase tracking-wide">Wajib: Sila muat naik gambar pasport</span>
                  </div>
                )}
              </div>"""

content = content.replace(old_image_block, new_image_block)

with open('src/components/dashboard/Borang.tsx', 'w') as f:
    f.write(content)
