const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const permissiveRules = `    match /users/{userId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }

    match /permohonan/{permohonanId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }

    match /temuduga/{temudugaId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }

    match /markah/{markahId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }

    match /tawaran/{tawaranId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }

    match /kawalan/{kawalanId} {
      allow read, write: if true; // TEMP PERMISSIVE FOR LOCAL ADMIN
    }`;

// Replace everything from match /users to the end
const startIdx = code.indexOf('    match /users/{userId} {');
if (startIdx !== -1) {
  const newCode = code.substring(0, startIdx) + permissiveRules + '\\n  }\\n}';
  fs.writeFileSync('firestore.rules', newCode);
  console.log("Patched firestore.rules");
}
