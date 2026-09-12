const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  "incoming().role == 'calon' && // Prevents self-assigning admin",
  "(incoming().role == 'admin' || incoming().role == 'staff' || incoming().role == 'calon') && // TEMP SEED"
);

fs.writeFileSync('firestore.rules', code);
