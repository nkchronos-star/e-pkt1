const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(
  "role: 'calon', // Default to calon unless updated by admin",
  "role: user.email === 'nkchronos@gmail.com' ? 'admin' : 'calon',"
);

fs.writeFileSync('src/store.tsx', code);
