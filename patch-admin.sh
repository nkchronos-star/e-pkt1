#!/bin/bash
# Insert user management into AdminPanel.tsx

sed -i '/{\/\* Saringan Temuduga \*\/}/i \
       {/* Pengurusan Pengguna */}\
       <section>\
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 mt-16">\
           <div className="p-3 bg-cyan-100 rounded-xl">\
             <Users className="w-7 h-7 text-cyan-700" />\
           </div>\
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengurusan Pengguna</h3>\
         </div>\
         <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">\
            <div className="overflow-x-auto">\
              <table className="min-w-full divide-y divide-slate-200">\
                <thead className="bg-slate-50">\
                  <tr>\
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Username</th>\
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Penuh</th>\
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Peranan</th>\
                  </tr>\
                </thead>\
                <tbody className="bg-white divide-y divide-slate-100">\
                  {users.map(u => (\
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">\
                      <td className="px-6 py-5 font-bold text-slate-900">{u.username}</td>\
                      <td className="px-6 py-5 text-slate-700">{u.name}</td>\
                      <td className="px-6 py-5"><span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{u.role}</span></td>\
                    </tr>\
                  ))}\
                </tbody>\
              </table>\
            </div>\
         </div>\
       </section>\
' src/components/dashboard/AdminPanel.tsx

