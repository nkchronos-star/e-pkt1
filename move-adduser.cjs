const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const userManagementSection = `       <section>
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8 mt-16">
           <div className="p-3 bg-cyan-100 rounded-xl">
             <Users className="w-7 h-7 text-cyan-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengurusan Pengguna</h3>
         </div>
         <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
             <form onSubmit={(e) => {
               e.preventDefault();
               const fd = new FormData(e.currentTarget);
               const username = fd.get("username") as string;
               const name = fd.get("name") as string;
               const role = fd.get("role") as string as any;
               if (username && name && role) {
                  addUser({ id: "user-" + Date.now(), username, name, role });
                  e.currentTarget.reset();
               }
             }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">ID Pengguna</label>
                  <input type="text" name="username" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Nama Penuh</label>
                  <input type="text" name="name" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Peranan</label>
                  <select name="role" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 bg-white" required>
                     <option value="">-- Pilih Peranan --</option>
                     <option value="SUPER_ADMIN">Super Admin</option>
                     <option value="PENTADBIR">Pentadbir</option>
                     <option value="TAHFIZ">Tahfiz (Penilai)</option>
                     <option value="AKADEMIK">Akademik</option>
                  </select>
                </div>
                <button type="submit" className="bg-cyan-600 text-white font-bold px-6 py-2 h-11 rounded-xl hover:bg-cyan-700 shadow-md">Tambah Pengguna</button>
             </form>
          </div>
          <div className="overflow-x-auto p-4">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Username</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Penuh</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Peranan</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">{u.username}</td>
                      <td className="px-6 py-5 text-slate-700">{u.name}</td>
                      <td className="px-6 py-5"><span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{u.role}</span></td>
                      <td className="px-6 py-5 text-right">
                         <button onClick={() => setAdminPasswordModalUser(u)} className="text-emerald-600 hover:text-emerald-800 p-2 mr-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200">
                            Tukar Kata Laluan
                         </button>
                         <button disabled={u.id === currentUser?.id} onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 border border-red-100">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
         </div>
       </section>`;

// Let's remove the broken add user forms from both places first

const tahfizAddUserStart = `         <div className="bg-slate-50 p-6 border-b border-slate-200">
            <form onSubmit={(e) => {`;
const tahfizAddUserEnd = `                <button type="submit" className="bg-cyan-600 text-white font-bold px-6 py-2 h-11 rounded-xl hover:bg-cyan-700">Tambah Pengguna</button>
            </form>
         </div>`;

if(code.includes(tahfizAddUserStart) && code.includes(tahfizAddUserEnd)){
  const blockToRemove = code.substring(code.indexOf(tahfizAddUserStart), code.indexOf(tahfizAddUserEnd) + tahfizAddUserEnd.length);
  code = code.replace(blockToRemove, "");
}

// Ensure the User Management Section exists in KAWALAN only (It's already there at the end, but let's make sure it's clean and has the right labels)
// I will just replace the label "Tahfiz" with "Tahfiz (Penilai)"

code = code.replace('<option value="TAHFIZ">Tahfiz</option>', '<option value="TAHFIZ">Tahfiz (Penilai)</option>');

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Cleaned up");
