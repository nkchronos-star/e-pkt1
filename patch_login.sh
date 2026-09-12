#!/bin/bash
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importAuth = \"import { signInWithGoogle, logoutUser } from './lib/auth';\nimport { useAppContext } from './store';\";
code = code.replace(\"import { Home,\", importAuth + \"\nimport { Home,\");

// Let's add a login/logout button to the top header
const authBtn = \`
          <div className=\"hidden md:block\">
            <span className=\"bg-white/10 border border-white/20 px-4 py-2 rounded-md font-medium text-sm mr-4\">
              Sesi Kemasukan 2026/2027
            </span>
          </div>
\`;

code = code.replace(
  '<div className=\"hidden md:block\">\n            <span className=\"bg-white/10 border border-white/20 px-4 py-2 rounded-md font-medium text-sm\">\n              Sesi Kemasukan 2026/2027\n            </span>\n          </div>',
  authBtn
);

// Oh wait, we need to inject useAppContext into AppContent.
code = code.replace(
  'function AppContent() {',
  'function AppContent() {\n  const { firebaseUser } = useAppContext();'
);

const loginUi = \`
          <div className=\"hidden md:flex items-center\">
            <span className=\"bg-white/10 border border-white/20 px-4 py-2 rounded-md font-medium text-sm mr-4\">
              Sesi Kemasukan 2026/2027
            </span>
            {firebaseUser ? (
              <div className=\"flex items-center gap-3\">
                <span className=\"text-sm text-emerald-100\">{firebaseUser.email}</span>
                <button onClick={logoutUser} className=\"text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-bold\">Log Keluar</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className=\"text-sm bg-white hover:bg-slate-100 text-[#0c6b4b] px-4 py-2 rounded-md font-bold\">Daftar / Log Masuk</button>
            )}
          </div>
\`;

code = code.replace(authBtn, loginUi);

fs.writeFileSync('src/App.tsx', code);
"
