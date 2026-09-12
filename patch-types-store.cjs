const fs = require('fs');

// Patch types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
if(!typesCode.includes('password?: string;')) {
    typesCode = typesCode.replace('  role: Role;', '  role: Role;\n  password?: string;');
    fs.writeFileSync('src/types.ts', typesCode);
}

// Patch store.tsx
let storeCode = fs.readFileSync('src/store.tsx', 'utf8');

// Add password to default users
storeCode = storeCode.replace(
  /{ id: 'admin1', username: 'admin', name: 'Super Admin', role: 'SUPER_ADMIN' },/,
  "{ id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' },"
);
storeCode = storeCode.replace(
  /{ id: 'tahfiz1', username: 'tahfiz1', name: 'Ustaz Ahmad', role: 'TAHFIZ' },/,
  "{ id: 'tahfiz1', username: 'tahfiz1', password: '123', name: 'Ustaz Ahmad', role: 'TAHFIZ' },"
);
storeCode = storeCode.replace(
  /{ id: 'akademik1', username: 'akademik1', name: 'Cikgu Siti', role: 'AKADEMIK' },/,
  "{ id: 'akademik1', username: 'akademik1', password: '123', name: 'Cikgu Siti', role: 'AKADEMIK' },"
);
storeCode = storeCode.replace(
  /{ id: 'pentadbir1', username: 'pentadbir1', name: 'PK HEM', role: 'PENTADBIR' },/,
  "{ id: 'pentadbir1', username: 'pentadbir1', password: '123', name: 'PK HEM', role: 'PENTADBIR' },"
);

// update AppContextType
storeCode = storeCode.replace('login: (username: string) => boolean;', 'login: (username: string, password?: string) => boolean;');

// update login function
const oldLogin = `  const login = (username: string) => {
    const user = state.users.find(u => u.username === username);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };`;

const newLogin = `  const login = (username: string, password?: string) => {
    const user = state.users.find(u => u.username === username);
    if (user) {
      // Allow login if password matches, or if no password is set for the user (fallback to '123')
      const userPass = user.password || '123';
      if (password === userPass) {
        setState(prev => ({ ...prev, currentUser: user }));
        return true;
      }
    }
    return false;
  };`;

if(storeCode.includes(oldLogin)) {
    storeCode = storeCode.replace(oldLogin, newLogin);
}

fs.writeFileSync('src/store.tsx', storeCode);
