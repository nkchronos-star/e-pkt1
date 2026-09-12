#!/bin/bash
sed -i '/<div className="overflow-x-auto/i \
         <div className="bg-slate-50 p-6 border-b border-slate-200">\
            <form onSubmit={(e) => {\
              e.preventDefault();\
              const fd = new FormData(e.currentTarget);\
              const username = fd.get("username") as string;\
              const name = fd.get("name") as string;\
              const role = fd.get("role") as string as any;\
              if (username && name && role) {\
                 addUser({ id: "user-" + Date.now(), username, name, role });\
                 e.currentTarget.reset();\
              }\
            }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">\
               <div>\
                 <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">ID Pengguna</label>\
                 <input type="text" name="username" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2" required />\
               </div>\
               <div>\
                 <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Nama Penuh</label>\
                 <input type="text" name="name" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2" required />\
               </div>\
               <div>\
                 <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Peranan</label>\
                 <select name="role" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 bg-white" required>\
                    <option value="">-- Pilih Peranan --</option>\
                    <option value="SUPER_ADMIN">Super Admin</option>\
                    <option value="PENTADBIR">Pentadbir</option>\
                    <option value="TAHFIZ">Tahfiz</option>\
                    <option value="AKADEMIK">Akademik</option>\
                 </select>\
               </div>\
               <button type="submit" className="bg-cyan-600 text-white font-bold px-6 py-2 h-11 rounded-xl hover:bg-cyan-700">Tambah Pengguna</button>\
            </form>\
         </div>\
' src/components/dashboard/AdminPanel.tsx

