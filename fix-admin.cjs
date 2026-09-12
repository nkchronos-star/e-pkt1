const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

// I should probably also change the default password to something more secure like admin123 just in case?
// No, admin/123 is fine for default. I'll just explain.
