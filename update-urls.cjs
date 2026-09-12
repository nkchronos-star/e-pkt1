const fs = require('fs');
const oldUrl = 'https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec';
const newUrl = 'https://script.google.com/macros/s/AKfycby9c8Gq0S4hMftdBUJPmiuJJreGIkg2BDAs58ZXgWefre_vsRWV4IqxGBI_5rzJGpRl/exec';

['src/components/dashboard/Borang.tsx', 'src/store.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.split(oldUrl).join(newUrl);
    fs.writeFileSync(file, code);
    console.log('Updated ' + file);
  }
});
