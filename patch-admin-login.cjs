const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// 1. Add password state
code = code.replace(
  "const [username, setUsername] = useState('');",
  "const [username, setUsername] = useState('');\n  const [password, setPassword] = useState('');"
);

// 2. Update handleLogin
code = code.replace(
  "if (login(username)) {",
  "if (login(username, password)) {"
);

code = code.replace(
  "setError('Sila masukkan ID Pengguna yang sah (cth: admin, tahfiz1, akademik1, pentadbir1)');",
  "setError('ID Pengguna atau Kata Laluan tidak sah');"
);

// 3. Add password input
const usernameInputBlock = `            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">ID Pengguna</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800"
                placeholder="cth: tahfiz1"
                required
              />
            </div>`;

const usernameAndPasswordInputBlock = `            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">ID Pengguna</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800"
                placeholder="cth: tahfiz1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Kata Laluan</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800"
                placeholder="Kata Laluan"
                required
              />
            </div>`;

if(code.includes(usernameInputBlock)) {
    code = code.replace(usernameInputBlock, usernameAndPasswordInputBlock);
}

// 4. Also update the ID Demo text to show default password '123'
code = code.replace(
  "ID Demo: <span className=\"font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm\">admin</span>, <span className=\"font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm\">tahfiz1</span>, <span className=\"font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm\">akademik1</span>, <span className=\"font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm\">pentadbir1</span>",
  "ID Demo: admin, tahfiz1, akademik1, pentadbir1<br/>Kata Laluan: 123"
);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
