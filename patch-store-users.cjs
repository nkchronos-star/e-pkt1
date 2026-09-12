const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const oldUsers = `const defaultUsers: User[] = [  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' },  { id: 'tahfiz1', username: 'tahfiz1', password: '123', name: 'Ustaz Ahmad', role: 'TAHFIZ' },  { id: 'akademik1', username: 'akademik1', password: '123', name: 'Cikgu Siti', role: 'AKADEMIK' },  { id: 'pentadbir1', username: 'pentadbir1', password: '123', name: 'PK HEM', role: 'PENTADBIR' },];`;
const newUsers = `const defaultUsers: User[] = [  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' },];`;

code = code.replace(oldUsers, newUsers);
fs.writeFileSync('src/store.tsx', code);
