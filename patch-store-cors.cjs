const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target1 = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => alert('Tetapan berjaya diselaraskan ke Pangkalan Data (Google Sheets)!'))`;

const replace1 = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      mode: 'no-cors',
      body: sheetData
    }).then(() => alert('Tetapan berjaya diselaraskan ke Pangkalan Data (Google Sheets)!'))`;

code = code.replace(target1, replace1);

const target2 = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => console.log('Users synced to server!'))`;

const replace2 = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      mode: 'no-cors',
      body: sheetData
    }).then(() => console.log('Users synced to server!'))`;

code = code.replace(target2, replace2);

const target3 = `            fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
               method: 'POST',
               body: sheetData
            }).catch(e => console.error("Auto-sync error", e));`;

const replace3 = `            fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
               method: 'POST',
               mode: 'no-cors',
               body: sheetData
            }).catch(e => console.error("Auto-sync error", e));`;

code = code.replace(target3, replace3);

fs.writeFileSync('src/store.tsx', code);
