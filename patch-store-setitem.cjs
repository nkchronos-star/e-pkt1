const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    localStorage.setItem('smag3_state', JSON.stringify(state));
  }, [state]);`;

const replacementEffect = `  useEffect(() => {
    try {
      localStorage.setItem('smag3_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Gagal menyimpan state ke localStorage (Quota mungkin melebihi had)', e);
    }
  }, [state]);`;

if (code.includes(`localStorage.setItem('smag3_state', JSON.stringify(state));`)) {
  code = code.replace(targetEffect, replacementEffect);
  fs.writeFileSync('src/store.tsx', code);
  console.log("Patched store.tsx localStorage.setItem.");
} else {
  console.log("Could not find the target code block.");
}
