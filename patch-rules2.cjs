const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace('\\n  }\\n}', '\n  }\n}');

fs.writeFileSync('firestore.rules', code);
console.log("Patched firestore.rules newlines");
