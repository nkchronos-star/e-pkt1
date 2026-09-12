const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const regex = /const defaultUsers:\s*User\[\]\s*=\s*\[[\s\S]*?\];/;
const newUsers = `const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' }
];`;

code = code.replace(regex, newUsers);
fs.writeFileSync('src/store.tsx', code);
