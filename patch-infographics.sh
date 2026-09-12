#!/bin/bash
sed -i '/{\/\* Keputusan Akhir \*\/}/i \
       {/* Pengurusan Infografik */}\
       <section>\
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 mt-16">\
           <div className="p-3 bg-pink-100 rounded-xl">\
             <FileSignature className="w-7 h-7 text-pink-700" />\
           </div>\
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengurusan Infografik Panduan</h3>\
         </div>\
         <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm mb-6">\
            <form onSubmit={(e) => {\
              e.preventDefault();\
              const fd = new FormData(e.currentTarget);\
              const title = fd.get("title") as string;\
              const url = fd.get("url") as string;\
              if (title && url) {\
                 /* we need a way to call addInfographic */\
                 window.dispatchEvent(new CustomEvent("add-infographic", { detail: { title, url } }));\
                 e.currentTarget.reset();\
              }\
            }} className="flex flex-col sm:flex-row gap-4">\
               <input type="text" name="title" placeholder="Tajuk Infografik" className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3" required />\
               <input type="url" name="url" placeholder="URL Imej (cth: https://...)" className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3" required />\
               <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700">Tambah</button>\
            </form>\
         </div>\
       </section>\
' src/components/dashboard/AdminPanel.tsx
