#!/bin/bash
sed -i '/<\/form>/a \
         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\
           {infographics?.map(info => (\
             <div key={info.id} className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">\
               <img src={info.url} alt={info.title} className="w-full h-48 object-cover" />\
               <div className="p-4 bg-white">\
                 <h4 className="font-bold text-slate-800 truncate">{info.title}</h4>\
               </div>\
               <button onClick={() => deleteInfographic(info.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-4 h-4" /></button>\
             </div>\
           ))}\
         </div>\
' src/components/dashboard/AdminPanel.tsx
