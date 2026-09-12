const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetState = `  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smag3_state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {`;

const replacementState = `  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smag3_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Gagal memuatkan state, menggunakan data lalai', e);
      }
    }
    return {`;

if (code.includes(`return JSON.parse(saved);`)) {
  code = code.replace(targetState, replacementState);
  fs.writeFileSync('src/store.tsx', code);
  console.log("Patched store.tsx JSON.parse.");
} else {
  console.log("Could not find the target code block.");
}
