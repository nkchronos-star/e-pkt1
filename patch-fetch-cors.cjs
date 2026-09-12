const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const fetchMatch = `await fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
        method: 'POST',
        body: sheetData
      });`;

const fetchReplace = `await fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: sheetData
      });`;

if (code.includes(fetchMatch)) {
   code = code.replace(fetchMatch, fetchReplace);
   fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
   console.log("Added no-cors to fetch");
} else {
   console.log("Could not find fetch block");
}
