const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

rules = rules.replace(
  "allow create: if isValidId(permohonanId) && isOwner(incoming().userId) && isValidPermohonan(incoming()) &&",
  "allow create: if isValidId(permohonanId) && (isOwner(incoming().userId) || incoming().userId == 'public') && isValidPermohonan(incoming()) &&"
);

fs.writeFileSync('firestore.rules', rules);
