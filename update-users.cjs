const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const oldUsers = `const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' }
];`;

const newUsers = `const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' },
  { id: 'admin2', username: 'pentadbir', password: '123', name: 'Pentadbir Sekolah', role: 'PENTADBIR' },
  { id: 'tahfiz1', username: 'tahfiz', password: '123', name: 'Ustaz/Ustazah (Penilai Tahfiz)', role: 'TAHFIZ' },
  { id: 'akademik1', username: 'akademik', password: '123', name: 'Cikgu Akademik', role: 'AKADEMIK' }
];`;

if (code.includes(oldUsers)) {
    code = code.replace(oldUsers, newUsers);
    fs.writeFileSync('src/store.tsx', code);
    console.log('Users updated successfully.');
} else {
    console.log('Failed to find oldUsers block.');
}
